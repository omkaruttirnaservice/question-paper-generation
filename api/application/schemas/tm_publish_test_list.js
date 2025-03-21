import { BIGINT, DATE, DATEONLY, Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import tm_publish_test_by_post from './tm_publish_test_by_post.js';

const tm_publish_test_list = sequelize.define('tm_publish_test_list', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},

	ptl_active_date: { type: Sequelize.DATEONLY },
	ptl_time: { type: Sequelize.INTEGER },
	ptl_link: { type: Sequelize.STRING(100) },
	ptl_test_id: { type: Sequelize.BIGINT },
	ptl_added_date: { type: Sequelize.DATEONLY },
	ptl_added_time: { type: Sequelize.TIME },
	ptl_time_tramp: { type: Sequelize.DATE },
	ptl_test_description: { type: Sequelize.TEXT('medium') },
	ptl_is_live: { type: Sequelize.INTEGER },
	ptl_aouth_id: { type: Sequelize.BIGINT },
	ptl_is_test_done: { type: Sequelize.INTEGER },
	ptl_test_info: { type: Sequelize.TEXT('long') },
	mt_name: { type: Sequelize.TEXT('medium') },
	mt_added_date: { type: Sequelize.DATEONLY },
	mt_descp: { type: Sequelize.TEXT('long') },
	mt_is_live: { type: Sequelize.TEXT('medium') },
	mt_time_stamp: { type: Sequelize.STRING(20) },
	mt_type: { type: Sequelize.INTEGER },
	tm_aouth_id: { type: Sequelize.BIGINT },
	mt_test_time: { type: Sequelize.STRING(20) },
	mt_total_test_takan: { type: Sequelize.INTEGER },
	mt_is_negative: { type: Sequelize.STRING(10) },
	mt_negativ_mark: { type: Sequelize.STRING(10) },
	mt_mark_per_question: { type: Sequelize.STRING(10) },
	mt_passing_out_of: { type: Sequelize.STRING(10) },
	mt_total_marks: { type: Sequelize.INTEGER },
	mt_pattern_type: { type: Sequelize.INTEGER },
	mt_total_test_question: { type: Sequelize.INTEGER },
	mt_added_time: { type: Sequelize.STRING(20) },
	ptl_link_1: { type: Sequelize.STRING(20) },
	tm_allow_to: { type: Sequelize.STRING(20) },
	ptl_test_mode: { type: Sequelize.STRING(20) },
	is_test_loaded: { type: Sequelize.STRING(20) },
	is_student_added: { type: Sequelize.STRING(20) },
	ptl_master_exam_id: { type: Sequelize.BIGINT },
	ptl_master_exam_name: { type: Sequelize.TEXT('long') },
	is_test_generated: { type: Sequelize.INTEGER },
	is_push_done: { type: Sequelize.INTEGER },
	is_show_exam_sections: { type: Sequelize.INTEGER, defaultValue: 0 },

	createdAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
	updatedAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
});

export default tm_publish_test_list;
