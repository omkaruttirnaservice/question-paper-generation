import sequelize from '../config/db-connect-migration.js';
import { Sequelize } from 'sequelize';

const tm_student_test_list = sequelize.define('tm_student_test_list', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},

	stl_test_id: {
		type: Sequelize.INTEGER,
	},
	stl_stud_id: {
		type: Sequelize.INTEGER,
	},
	stl_publish_id: {
		type: Sequelize.INTEGER,
	},
	stl_date: {
		type: Sequelize.DATEONLY,
	},
	stl_test_url: {
		type: Sequelize.TEXT('long'),
	},
	stl_time: {
		type: Sequelize.STRING(20),
	},
	stl_time_stamp: {
		type: Sequelize.STRING(20),
	},
	stl_test_compliet_in: {
		type: Sequelize.STRING(20),
	},
	stl_test_submition_time: {
		type: Sequelize.STRING(20),
	},
	stl_test_status: {
		type: Sequelize.INTEGER,
	},
	stl_agrement_accepted: {
		type: Sequelize.INTEGER,
	},
	stm_min: {
		type: Sequelize.INTEGER,
	},
	stm_sec: {
		type: Sequelize.INTEGER,
	},
	stl_browser_info: {
		type: Sequelize.TEXT('long'),
	},
	stl_user_ip: {
		type: Sequelize.STRING(20),
	},
	stl_user_mac: {
		type: Sequelize.STRING(20),
	},
});

export default tm_student_test_list;
