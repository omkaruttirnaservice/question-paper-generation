import sequelize from '../config/db-connect-migration.js';
import { myDate } from '../config/utils.js';
import tm_test_question_sets from '../Migration_Scripts/tm_test_question_sets.js';
import tm_test_user_master_list from '../Migration_Scripts/tm_test_user_master_list.js';

const testsModel = {
	createTest: async (_t, _q, _fd) => {
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
					q_i_sol: _q.mqs_ans,
					stl_topic_number: null,
					sl_section_no: null,
					q_sol: null,
					q_ans: null,
					q_mat_ans: null,
					q_mat_ans_row: null,
					q_col_display_type: null,
					question_no: null,
					mark_per_question: _t.marks_per_question,
					tqs_question_id: null,
					tqs_chapter_id: null,
					tqs_section_id: null,
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
};

export default testsModel;
