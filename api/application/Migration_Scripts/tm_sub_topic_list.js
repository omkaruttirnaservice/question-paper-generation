import { TEXT, BIGINT, STRING, DATEONLY, INTEGER } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_sub_topic_list = sequelize.define('tm_sub_topic_list', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	stl_name: {
		type: TEXT('long'),
		allowNull: false,
	},
	stl_master_test_id: {
		type: BIGINT,
	},

	stl_main_topic_list_id: {
		type: BIGINT,
	},

	stl_added_date: {
		type: DATEONLY,
	},

	stl_added_time: {
		type: STRING(20),
	},
	stl_time_stamp: {
		type: STRING(20),
	},
});

export default tm_sub_topic_list;
