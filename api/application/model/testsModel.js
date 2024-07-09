import sequelize from '../config/db-connect-migration.js';
import { myDate } from '../config/utils.js';
import tm_test_user_master_list from '../Migration_Scripts/tm_test_user_master_list.js';

const testsModel = {
	createTest: async (t) => {
		try {
			await sequelize.transactions(async (t) => {
				await tm_test_user_master_list.create(
					{
						mt_name: t.test_name,
						mt_added_date: myDate.getDate(),
						mt_descp: 'TEST',
						mt_added_time: myDate.getTime(),
						mt_is_live: 1,
						mt_time_stamp: myDate.getDateTime(),
						mt_type: 1,
						tm_aouth_id: 1,
						mt_test_time: t.test_duration,
						mt_total_test_takan: 0,
						mt_is_negative: t.is_negative_marking,
						mt_negativ_mark: 0,
						mt_mark_per_question: t.marks_per_question,
						mt_passing_out_of: t.test_passing_mark,
						mt_total_marks: +t.total_questions * +t.marks_per_question,
						mt_pattern_type: 1,
						mt_total_test_question: +t.total_questions,
					},
					{ transactions: t }
				);

				await tm_test_question_sets.create(
					{
						q_id: '',
						tqs_test_id: '',
						section_id: '',
						section_name: '',
						sub_topic_id: '',
						sub_topic_section: '',
						main_topic_id: '',
						main_topic_name: '',
						q: '',
						q_a: '',
						q_b: '',
						q_c: '',
						q_d: '',
						q_e: '',
						q_display_type: '',
						q_ask_in: '',
						q_data_type: '',
						q_mat_data: '',
						q_col_a: '',
						q_col_b: '',
						q_mat_id: '',
						q_i_a: '',
						q_i_b: '',
						q_i_c: '',
						q_i_d: '',
						q_i_e: '',
						q_i_q: '',
						q_i_sol: '',
						stl_topic_number: '',
						sl_section_no: '',
						q_sol: '',
						q_ans: '',
						q_mat_ans: '',
						q_mat_ans_row: '',
						q_col_display_type: '',
						question_no: '',
						mark_per_question: '',
						tqs_question_id: '',
						tqs_chapter_id: '',
						tqs_section_id: '',
						pub_name: '',
						book_name: '',
						page_name: '',
					},
					{ transactions: t }
				);
			});
		} catch (error) {
			console.log('error occured in query', error);
		}
	},
};

export default testsModel;
