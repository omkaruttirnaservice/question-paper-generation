import { BIGINT, DATE, DATEONLY, Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_test_question_sets = sequelize.define('tm_test_question_sets', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	q_id: { type: Sequelize.INTEGER },
	tqs_test_id: { type: Sequelize.INTEGER },
	section_id: { type: Sequelize.INTEGER },
	section_name: { type: Sequelize.TEXT('medium') },
	sub_topic_id: { type: Sequelize.INTEGER },
	sub_topic_section: { type: Sequelize.TEXT('medium') },
	main_topic_id: { type: Sequelize.INTEGER },
	main_topic_name: { type: Sequelize.STRING },
	q: { type: Sequelize.TEXT('long') },
	q_a: { type: Sequelize.TEXT('long') },
	q_b: { type: Sequelize.TEXT('long') },
	q_c: { type: Sequelize.TEXT('long') },
	q_d: { type: Sequelize.TEXT('long') },
	q_e: { type: Sequelize.TEXT('long') },
	q_display_type: { type: Sequelize.INTEGER },
	q_ask_in: { type: Sequelize.TEXT('long') },
	q_data_type: { type: Sequelize.INTEGER() },
	q_mat_data: { type: Sequelize.TEXT('long') },
	q_col_a: { type: Sequelize.TEXT('long') },
	q_col_b: { type: Sequelize.TEXT('long') },
	q_mat_id: { type: Sequelize.BIGINT },
	q_i_a: { type: Sequelize.TEXT('long') },
	q_i_b: { type: Sequelize.TEXT('long') },
	q_i_c: { type: Sequelize.TEXT('long') },
	q_i_d: { type: Sequelize.TEXT('long') },
	q_i_e: { type: Sequelize.TEXT('long') },
	q_i_q: { type: Sequelize.TEXT('long') },
	q_i_sol: { type: Sequelize.TEXT('long') },
	stl_topic_number: { type: Sequelize.STRING },
	sl_section_no: { type: Sequelize.STRING },
	q_sol: { type: Sequelize.TEXT('long') },
	q_ans: { type: Sequelize.STRING },
	q_mat_ans: { type: Sequelize.TEXT('long') },
	q_mat_ans_row: { type: Sequelize.TEXT('long') },
	q_col_display_type: { type: Sequelize.INTEGER },
	question_no: { type: Sequelize.STRING(1024) },
	mark_per_question: { type: Sequelize.STRING(1024) },
	tqs_question_id: { type: Sequelize.BIGINT },
	tqs_chapter_id: { type: Sequelize.BIGINT },
	tqs_section_id: { type: Sequelize.BIGINT },
	pub_name: { type: Sequelize.STRING(255) },
	book_name: { type: Sequelize.STRING(255) },
	page_name: { type: Sequelize.BIGINT },
	mqs_ask_in_month: { type: Sequelize.STRING(20) },
	mqs_ask_in_year: { type: Sequelize.STRING(20) },
	mqs_leval: {
		type: Sequelize.STRING(255),
	},
	createdAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
	updatedAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
});

export default tm_test_question_sets;