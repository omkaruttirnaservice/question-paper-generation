import {
	BIGINT,
	STRING,
	DATEONLY,
	INTEGER,
	Sequelize,
	DATE,
	TIME,
} from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_main_topic_list = sequelize.define('tm_main_topic_list', {
	id: {
		type: INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	mtl_master_test_list_id: {
		type: INTEGER,
		allowNull: false,
		references: {
			model: 'tm_master_test_list',
			key: 'id',
		},
	},
	mtl_name: {
		type: STRING(255),
	},

	mtp_added_aouth_id: {
		type: BIGINT,
	},

	mtl_added_time: {
		type: TIME,
	},

	mtl_added_date: {
		type: DATEONLY,
	},

	mtl_time_stamp: {
		type: DATE,
	},
	mtl_is_live: {
		type: INTEGER,
	},

	type: {
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

export default tm_main_topic_list;
