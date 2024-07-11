import sequelize from '../config/db-connect-migration.js';
import db from '../config/db.connect.js';
import { myDate } from '../config/utils.js';
import tm_test_question_sets from '../Migration_Scripts/tm_test_question_sets.js';
import tm_test_user_master_list from '../Migration_Scripts/tm_test_user_master_list.js';

const testsModel = {
	getList: async () => {
		return tm_test_user_master_list.findAll({ raw: true });
	},

	deleteTest: async (deleteId) => {
		let transact = await sequelize.transaction();
		try {
			await tm_test_user_master_list.destroy({ where: { id: +deleteId } });
			await tm_test_question_sets.destroy({
				where: { tqs_test_id: +deleteId },
			});

			await transact.commit();
			return {
				message: 'Deleted successful',
			};
		} catch (error) {
			console.log(error, '==error==');
			await transact.rollback();
		}
	},

	createTest: async (_t, _q, _fd) => {
		console.log(_q, 'Q===============================================');
		console.log(_t, '==_t==');
		console.log(_fd, '==_fd==');
		let transact = await sequelize.transaction();
		try {
			let _masterTest = await tm_test_user_master_list.create(
				{
					mt_name: _t.test_name,
					mt_added_date: myDate.getDate(),
					mt_descp: 'TEST',
					mt_added_time: myDate.getTime(),
					mt_is_live: 1,
					mt_time_stamp: myDate.getDateTime(),
					mt_type: 1,
					tm_aouth_id: 1,
					mt_test_time: _t.test_duration,
					mt_total_test_takan: 0,
					mt_is_negative: _t.is_negative_marking,
					mt_negativ_mark: 0,
					mt_mark_per_question: _t.marks_per_question,
					mt_passing_out_of: _t.test_passing_mark,
					mt_total_marks: +_t.total_questions * +_t.marks_per_question,
					mt_pattern_type: 1,
					mt_total_test_question: +_t.total_questions,
				},
				{ transaction: transact }
			);

			let masterTestId = _masterTest.toJSON().id;

			let questionsData = [];
			_q.forEach((_q) => {
				questionsData.push({
					q_id: _q.id,
					tqs_test_id: masterTestId,
					section_id: null,
					section_name: null,
					sub_topic_id: _fd.topic_id,
					sub_topic_section: _fd.topic_name,
					main_topic_id: _fd.subject_id,
					main_topic_name: _fd.subject_name,
					q: _q.mqs_question,
					q_a: _q.mqs_opt_one,
					q_b: _q.mqs_opt_two,
					q_c: _q.mqs_opt_three,
					q_d: _q.mqs_opt_four,
					q_e: _q.mqs_opt_five,
					q_display_type: null,
					q_ask_in: null,
					q_data_type: null,
					q_mat_data: null,
					q_col_a: null,
					q_col_b: null,
					q_mat_id: null,
					q_i_a: null,
					q_i_b: null,
					q_i_c: null,
					q_i_d: null,
					q_i_e: null,
					q_i_q: null,
					q_i_sol: null,
					stl_topic_number: null,
					sl_section_no: null,
					q_sol: _q.mqs_solution,
					q_ans: _q.mqs_ans,
					q_mat_ans: null,
					q_mat_ans_row: null,
					q_col_display_type: null,
					question_no: null,
					mark_per_question: _t.marks_per_question,
					tqs_question_id: _q.id,
					tqs_chapter_id: _fd.topic_id,
					tqs_section_id: _fd.subject_id,
					pub_name: _q.msq_publication_name,
					book_name: _q.msq_book_name,
					page_name: _q.maq_page_number,
				});
			});
			await tm_test_question_sets.bulkCreate(questionsData, {
				transaction: transact,
			});

			await transact.commit();
			return masterTestId;
		} catch (error) {
			await transact.rollback();
			console.log('error occured in query', error);
		}
	},

	getRandQues: (subjectId, topicId, limit) => {
		let query = `SELECT
												question_list.id as q_id,
		                    IFNULL(0,0) as section_id,
		                    IFNULL('-','-')as section_name,
		                    sub_topic_list.id as sub_topic_id,
		                    sub_topic_list.stl_name as sub_topic_section,
		                    sub_topic_list.stl_main_topic_list_id as main_topic_id,
		                    main_topic_list.mtl_name as main_topic_name,
		                   	IFNULL(question_list.mqs_question,'') as q,
		                   	IFNULL(question_list.mqs_opt_one,'') as q_a,
		                   	IFNULL(question_list.mqs_opt_two,'') as q_b,
		                    IFNULL(question_list.mqs_opt_three,'') as q_c,
		                    IFNULL(question_list.mqs_opt_four,'') as q_d,
		                    IFNULL(question_list.mqs_opt_five,'') as q_e,
												IFNULL(question_list.mqs_type,'') as q_display_type,
		                    IFNULL('','') as q_mat_data,
		                    IFNULL('','') as q_col_a,
		                    IFNULL('','') as q_col_b,
		                    IFNULL('','0') as q_mat_id,
		                    IFNULL(0,0) as q_i_a,
		                    IFNULL(0,0) as q_i_b,
		                    IFNULL(0,0) as q_i_c,
		                    IFNULL(0,0) as q_i_d,
		                    IFNULL(0,0) as q_i_e,
		                    IFNULL(0,0) as q_i_q,
		                    IFNULL(0,0) as q_i_sol,
		                    IFNULL(0,0) as stl_topic_number,
		                    IFNULL(0,0) as sl_section_no,
		                    IFNULL(question_list.mqs_solution,'') as q_sol,
							IFNULL(question_list.mqs_ans,'') as q_ans,
							IFNULL('','') as q_mat_ans,	
							IFNULL('','') as q_mat_ans_row,	
							IFNULL(1,1) as q_col_display_type,	
							IFNULL('-','-') as question_no,	
							IFNULL(1,1) as mark_per_question,
							question_list.id as tqs_question_id,
							mqs_chapter_id as tqs_chapter_id,
							mqs_section_id as tqs_section_id,
							msq_publication_name as pub_name,
							msq_book_name as book_name,
							maq_page_number as page_name

							FROM 
		                        tm_mega_question_set as question_list INNER JOIN  
		                        tm_sub_topic_list as sub_topic_list ON
		                        sub_topic_list.id = question_list.mqs_chapter_id  
		                      	INNER JOIN 
	                   			tm_main_topic_list as main_topic_list ON
	                   			sub_topic_list.stl_main_topic_list_id  = main_topic_list.id
								WHERE
									mqs_section_id = ${subjectId} AND
									mqs_chapter_id = ${topicId} 

								ORDER BY RAND()
									LIMIT ${limit}`;
		return db.query(query);
	},

	createMasterTest: async (_t) => {
		return await tm_test_user_master_list.create({
			mt_name: _t.test_name,
			mt_added_date: myDate.getDate(),
			mt_descp: 'TEST',
			mt_added_time: myDate.getTime(),
			mt_is_live: 1,
			mt_time_stamp: myDate.getDateTime(),
			mt_type: 1,
			tm_aouth_id: 1,
			mt_test_time: _t.test_duration,
			mt_total_test_takan: 0,
			mt_is_negative: _t.is_negative_marking,
			mt_negativ_mark: 0,
			mt_mark_per_question: _t.marks_per_question,
			mt_passing_out_of: _t.test_passing_mark,
			mt_total_marks: +_t.total_questions * +_t.marks_per_question,
			mt_pattern_type: 1,
			mt_total_test_question: +_t.total_questions,
		});
	},

	saveExamQuestions: async (q, masterTestId, _t) => {
		let questionsData = [];
		q.forEach((_q) => {
			questionsData.push({
				q_id: _q.q_id,
				tqs_test_id: masterTestId,
				section_id: null,
				section_name: null,
				sub_topic_id: _q.sub_topic_id,
				sub_topic_section: _q.sub_topic_section,
				main_topic_id: _q.main_topic_id,
				main_topic_name: _q.main_topic_name,
				q: _q.q,
				q_a: _q.q_a,
				q_b: _q.q_b,
				q_c: _q.q_c,
				q_d: _q.q_d,
				q_e: _q.q_e,
				q_display_type: null,
				q_ask_in: null,
				q_data_type: null,
				q_mat_data: null,
				q_col_a: null,
				q_col_b: null,
				q_mat_id: null,
				q_i_a: null,
				q_i_b: null,
				q_i_c: null,
				q_i_d: null,
				q_i_e: null,
				q_i_q: null,
				q_i_sol: _q.mqs_ans,
				stl_topic_number: null,
				sl_section_no: null,
				q_sol: _q.q_sol,
				q_ans: _q.q_ans,
				q_mat_ans: null,
				q_mat_ans_row: null,
				q_col_display_type: null,
				question_no: null,
				mark_per_question: _t.marks_per_question,
				tqs_question_id: _q.tqs_question_id,
				tqs_chapter_id: _q.tqs_chapter_id,
				tqs_section_id: _q.tqs_section_id,
				pub_name: _q.pub_name,
				book_name: _q.book_name,
				page_name: _q.page_name,
			});
		});
		return await tm_test_question_sets.bulkCreate(questionsData);
	},
};

export default testsModel;
