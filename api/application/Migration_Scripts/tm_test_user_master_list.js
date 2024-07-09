import { BIGINT, DATEONLY, Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_test_user_master_list = sequelize.define('tm_test_user_master_list', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	mt_name: { type: Sequelize.TEXT('medium') },
	mt_added_date: { type: Sequelize.DATEONLY },
	mt_descp: { type: Sequelize.TEXT('medium') },
	mt_added_time: { type: Sequelize.TIME },
	mt_is_live: { type: Sequelize.TINYINT },
	mt_time_stamp: { type: Sequelize.DATE },
	mt_type: { type: Sequelize.TINYINT },
	tm_aouth_id: { type: Sequelize.INTEGER },
	mt_test_time: { type: Sequelize.STRING(20) },
	mt_total_test_takan: { type: Sequelize.INTEGER },
	mt_is_negative: { type: Sequelize.STRING(10) },
	mt_negativ_mark: { type: Sequelize.STRING(10) },
	mt_mark_per_question: { type: Sequelize.STRING(10) },
	mt_passing_out_of: { type: Sequelize.STRING(10) },
	mt_total_marks: { type: Sequelize.INTEGER },
	mt_pattern_type: { type: Sequelize.INTEGER },
	mt_total_test_question: { type: Sequelize.INTEGER },
});

export default tm_test_user_master_list;
