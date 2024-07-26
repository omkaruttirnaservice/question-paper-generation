import { BIGINT, TEXT, STRING, DATEONLY, INTEGER, Sequelize, DATE, TIME } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tn_center_list = sequelize.define('tn_center_list', {
	id: {
		type: INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	cl_number: {
		type: INTEGER,
	},

	cl_name: {
		type: STRING(512),
	},

	cl_address: {
		type: TEXT('long'),
	},

	cl_user_name: {
		type: TEXT('long'),
	},

	cl_password: {
		type: TEXT('long'),
	},

	cl_sever_number: {
		type: INTEGER,
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

export default tn_center_list;
