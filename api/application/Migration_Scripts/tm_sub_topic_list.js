import {
	TEXT,
	BIGINT,
	STRING,
	DATEONLY,
	INTEGER,
	Sequelize,
	DATE,
	TIME,
} from 'sequelize';
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
		type: INTEGER,
		references: {
			model: 'tm_master_test_list',
			key: 'id',
		},
	},

	stl_main_topic_list_id: {
		type: INTEGER,
		references: {
			model: 'tm_main_topic_list',
			key: 'id',
		},
	},

	stl_added_date: {
		type: DATEONLY,
	},

	stl_added_time: {
		type: TIME,
	},
	stl_time_stamp: {
		type: DATE,
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

export default tm_sub_topic_list;
