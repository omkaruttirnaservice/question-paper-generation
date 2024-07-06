import { BIGINT, STRING, DATEONLY, INTEGER } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_main_topic_list = sequelize.define('tm_main_topic_list', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	mtl_master_test_list_id: {
		type: INTEGER,
		allowNull: false,
	},
	mtl_name: {
		type: STRING(255),
	},

	mtp_added_aouth_id: {
		type: BIGINT,
	},

	mtl_added_time: {
		type: STRING(20),
	},

	mtl_added_date: {
		type: DATEONLY,
	},

	mtl_time_stamp: {
		type: STRING(20),
	},
	mtl_is_live: {
		type: INTEGER,
	},

	type: {
		type: INTEGER,
	},
});

export default tm_main_topic_list;
