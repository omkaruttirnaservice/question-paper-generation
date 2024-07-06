import { INTEGER, BIGINT, STRING, DATEONLY, TEXT } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const question = sequelize.define('question', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	question_content: {
		type: TEXT('long'),
		allowNull: false,
	},

	option_A: {
		type: TEXT('long'),
		allowNull: false,
	},
	option_B: {
		type: TEXT('long'),
		allowNull: false,
	},
	option_C: {
		type: TEXT('long'),
		allowNull: false,
	},
	option_D: {
		type: TEXT('long'),
		allowNull: false,
	},
	option_E: {
		type: TEXT('long'),
	},

	correct_option: {
		type: STRING,
		allowNull: false,
	},

	explanation: {
		type: TEXT('long'),
		defaultValue: '',
	},

	subject_id: {
		type: BIGINT,
		allowNull: false,
	},

	topic_id: {
		type: BIGINT,
		allowNull: false,
	},
	pub_name: {
		type: STRING(200),
		defaultValue: '0',
	},
	pg_no: {
		type: INTEGER,
		defaultValue: '0',
	},
});

export default question;
