import sequelize from '../config/db-connect-migration.js';
import aouth from '../schemas/aouth.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';

const reportsModel = {
	getExamServerIP: async () => {
		return await aouth.findOne({
			attributes: ['exam_server_ip'],
			where: {
				id: 1,
			},
			raw: true,
		});
	},
	saveExamServerIP: async (ip) => {
		return await aouth.update({ exam_server_ip: ip }, { where: { id: 1 } });
	},

	getPublishedTests: async () => {
		return await tm_publish_test_list.findAll({ raw: true });
	},

	generateResult: async (publishedTestId, transact) => {
		let where = '';

		if (publishedTestId != 0) {
			where += `main_test_list.id = ${publishedTestId}`;
		}

		let query = `SELECT
                 main_result.sfrs_publish_id as sfrs_publish_id,
                 main_result.student_id as  sfrs_student_id,
                 main_result.sfrs_student_roll_no as sfrs_student_roll_no,
                 (SUM( main_result.correct ) * main_result.per_question_mark) -
                 (SUM( main_result.wrong ) * main_result.negative_mark) as sfrs_marks_gain,
                 SUM( main_result.correct ) as sfrs_correct,
                 SUM( main_result.wrong ) as sfrs_wrong,
                 SUM( main_result.unatempted ) as sfrs_unattempted,
                 main_result.sfrs_cutoff as   sfrs_cutoff,
                 main_result.sfrc_total_marks as sfrc_total_marks,
                 main_result.sfrs_test_date as sfrs_test_date,
                 IFNULL('Test','Test') as sfrs_test_info,
                 main_result.sfrs_rem_min as sfrs_rem_min,
                 main_result.sfrs_rem_sec as sfrs_rem_sec
                FROM 
                (SELECT 
                  student_list.sl_roll_number as sfrs_student_roll_no,
                  main_test_list.id as sfrs_publish_id,
                  main_test_list.mt_total_marks as sfrc_total_marks,
                  main_test_list.mt_passing_out_of as   sfrs_cutoff,
                  main_test_list.ptl_active_date as sfrs_test_date,
                  main_test_list.mt_negativ_mark as negative_mark,
                  student_paper.sqp_student_id student_id,
                  student_paper.sqp_ans as student_ans,
                  main_test_list.mt_mark_per_question as per_question_mark,
                  IF(student_paper.sqp_ans = main_paper.q_ans ,1,0) as correct,
                  IF(student_paper.sqp_ans = '',1,IF(student_paper.sqp_ans IS NOT NULL,0,1)) as unatempted,
                  IF(student_paper.sqp_ans <> '' ,IF(student_paper.sqp_ans <> main_paper.q_ans ,1,0),0) as wrong,
                   stud_test_info.stm_min as sfrs_rem_min,
                   stud_test_info.stm_sec as sfrs_rem_sec

                  FROM  
                   tm_publish_test_list as main_test_list 
					INNER JOIN 
						tm_student_question_paper as student_paper 
							ON  
								main_test_list.id = student_paper.sqp_publish_id 

					INNER JOIN 
						tm_test_question_sets as main_paper 
							ON 
								(student_paper.sqp_question_id = main_paper.q_id AND main_test_list.ptl_test_id = main_paper.tqs_test_id) 

					INNER JOIN 
						tn_student_list as student_list 
							ON 
								student_list.id = student_paper.sqp_student_id  
								
					INNER JOIN 
						tm_student_test_list as stud_test_info 
							ON
								(main_test_list.id = stud_test_info.stl_publish_id  AND student_list.id = stud_test_info.stl_stud_id) 

                  WHERE ${where} GROUP BY student_paper.id,student_paper.sqp_student_id ORDER BY student_paper.sqp_student_id
                 ) as main_result
                GROUP BY main_result.student_id`;

		return await sequelize.query(query, { transaction: transact });
	},

	deleteResultsData: async (transact) => {
		let query = `DELETE
							set_1
						FROM 
							tm_student_final_result_set set_1 ,
							tm_student_final_result_set set_2
						WHERE 
							set_1.id < set_2.id AND (
							set_1.sfrs_publish_id = set_2.sfrs_publish_id
							AND set_1.sfrs_student_id = set_2.sfrs_student_id )`;
		return await sequelize.query(query, { transaction: transact });
	},
};

export default reportsModel;
