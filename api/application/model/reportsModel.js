import sequelize from '../config/db-connect-migration.js';
import aouth from '../schemas/aouth.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';

export const DATES_LIST = 'dates';
export const BATCH_LIST = 'batchs';
export const POST_LIST = 'posts';

const reportsModel = {
	getReportForType: async (type) => {
		let q;
		if (type === DATES_LIST) {
			q = `SELECT 
					DATE_FORMAT(sl_exam_date,'%d-%m-%Y') as sl_exam_date  
				FROM tn_student_list 
				GROUP BY sl_exam_date`;
			return await sequelize.query(q);
		}

		if (type === BATCH_LIST) {
			q = `SELECT 
					sl_batch_no 
				FROM tn_student_list 
				GROUP BY sl_batch_no`;
			return await sequelize.query(q);
		}

		if (type === POST_LIST) {
			q = `SELECT 
					sl_post
				FROM tn_student_list 
				GROUP BY sl_post`;
			return await sequelize.query(q);
		}
	},

	getResultData: async (data) => {
		const RESULT_BY_BATCH = 'Batch';
		const RESULT_BY_POST = 'Post';
		let q = `SELECT *,
					CONCAT(sl_f_name,' ',sl_m_name,' ',sl_l_name) AS full_name,
					DATE_FORMAT(sl_date_of_birth,'%d-%m-%Y') AS dob
					FROM tm_student_final_result_set AS sfrs
					INNER JOIN tn_student_list sl
					ON sfrs.sfrs_student_id = sl.id
					`;
		if (data.viewResultBy === RESULT_BY_POST) {
			q += ` WHERE sl_post = '${data.postName}' `;
			return await sequelize.query(q);
		}
		
		if (data.viewResultBy === RESULT_BY_BATCH) {
			q += ` WHERE sl_post = '${data.postName}' AND DATE_FORMAT(sl_exam_date,'%d-%m-%Y') = '${data.examDate}' `;
			return await sequelize.query(q);
		}
	},

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

	getTestDetails: async (testId) => {
		let q = ` SELECT  
					post_list.mtl_test_name as post_name,
					test.mt_name as test_name,
					test.ptl_active_date as test_date
				FROM 
					tm_publish_test_list as test INNER JOIN 
					tm_master_test_list as post_list 
				ON test.mt_pattern_type = post_list.id
				WHERE test.id = ${testId} LIMIT 1`;
		return await sequelize.query(q);
	},

	getTestReportsForExcel: async (testId) => {
		let q = ` SELECT 
                      IFNULL(student_list.sl_f_name,'') as f_name ,
                      IFNULL(student_list.sl_m_name,'') as m_name ,
                      IFNULL(student_list.sl_l_name,'') as l_name ,
                        sfrc_total_marks as count,
                        student_list.id as student_id,
                        student_list.sl_roll_number as roll_number,
                        student_list.sl_application_number as student_application_no,
                        student_list.sl_post as student_post,
                        student_list.sl_catagory as student_catatory,
                        DATE_FORMAT(student_list.sl_date_of_birth,'%d-%m-%Y') as dob,
                        student_list.sl_contact_number as mobile_number,
                        student_list.sl_image as student_image,
                        IF(sl_is_physical_handicap=0,'No','Yes')as ph,
                        sfrs_correct as correct,
                        sfrs_correct as correct_score,
                        sfrs_unattempted as unattempted,
                        sfrs_wrong as wrong,
                        IFNULL(0,0) as wrong_score,
                        main_test_list.mt_mark_per_question as per_question,
                        IF(main_test_list.mt_negativ_mark='',0,main_test_list.mt_negativ_mark) as negative
                      FROM 
                        tn_student_list as student_list INNER JOIN
                         tm_student_final_result_set as student_paper ON
                        student_paper.sfrs_student_id = student_list.id INNER JOIN 
                        tm_publish_test_list as main_test_list ON
                        main_test_list.id = student_paper.sfrs_publish_id
                        WHERE 
                         main_test_list.id = ${testId}
                          GROUP BY student_paper.sfrs_student_id
                        ORDER BY roll_number`;
		return await sequelize.query(q);
	},
};

export default reportsModel;
