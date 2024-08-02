import { BIGINT, STRING, DATEONLY, INTEGER, Sequelize, DATE, TIME } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const aouth = sequelize.define('aouth', {
	id: {
		type: INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	a_master_name: {
		type: STRING(255),
	},

	a_master_password: {
		type: STRING(40),
	},

	a_last_password: {
		type: STRING(40),
	},

	a_added_date: {
		type: DATEONLY,
	},
	a_added_time: {
		type: TIME,
	},
	a_time_stamp: {
		type: DATE,
	},
	a_valid: {
		type: INTEGER,
		defaultValue: 0,
	},
	a_form_filling_ip: {
		type: STRING(1024),
	},
	exam_server_ip: {
		type: STRING(1024),
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

export default aouth;
