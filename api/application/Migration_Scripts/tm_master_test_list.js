import { BIGINT, DATE, DATEONLY, STRING, TIME, TINYINT } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_master_test_list = sequelize.define('tm_master_test_list', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	mtl_test_name: {
		type: STRING(50),
		allowNull: false,
	},
	mtl_long_form: {
		type: STRING(50),
		defaultValue: '-',
	},
	mtl_test_desc: {
		type: STRING(255),
		defaultValue: '-',
	},
	added_time: {
		type: TIME,
		allowNull: false,
	},
	added_date: {
		type: DATEONLY,
		allowNull: false,
	},
	added_time_stamp: {
		type: DATE,
		allowNull: false,
	},
	mtl_is_active: {
		type: TINYINT,
		allowNull: false,
	},
});

export default tm_master_test_list;
