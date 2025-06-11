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

const tm_exam_to_question = sequelize.define('tm_exam_to_question', {
	id: {
		type: INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	etq_exam_id: {
		type: INTEGER,
		allowNull: false,
	},
	etq_question_id: {
		type: INTEGER,
		allowNull: false,
	},
	etq_chapter_id: {
		type: INTEGER,
		allowNull: false,
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

export default tm_exam_to_question;
