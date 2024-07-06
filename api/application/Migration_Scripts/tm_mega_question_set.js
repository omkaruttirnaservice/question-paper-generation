import {
	BIGINT,
	DATE,
	DATEONLY,
	INTEGER,
	STRING,
	TIME,
	TINYINT,
	TEXT,
} from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_mega_question_set = sequelize.define('tm_mega_question_set', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},

	mqs_question: {
		type: TEXT('long'),
	},
	mqs_opt_one: {
		type: TEXT('long'),
	},
	mqs_opt_two: {
		type: TEXT('long'),
	},
	mqs_opt_three: {
		type: TEXT('long'),
	},
	mqs_opt_four: {
		type: TEXT('long'),
	},
	mqs_opt_five: {
		type: TEXT('long'),
	},
	mqs_type: {
		type: INTEGER,
	},
	mqs_ask_in_month: {
		type: STRING('10'),
	},
	mqs_ask_in_year: {
		type: STRING(4),
	},

	mqs_ans: {
		type: TEXT('long'),
	},
	mqs_solution: {
		type: TEXT('long'),
	},
	mqs_leval: {
		type: STRING(255),
	},
	mqs_added_by: {
		type: INTEGER,
	},
	mqs_section_id: {
		type: BIGINT,
	},
	mqs_chapter_id: {
		type: BIGINT,
	},
	mqs_added_date: {
		type: DATEONLY,
	},
	mqs_added_time: {
		type: TIME,
	},
	mqs_added_time_stamp: {
		type: DATE,
	},
	mqs_is_trash: {
		type: INTEGER,
	},
	msq_publication_name: {
		type: STRING(255),
	},
	msq_book_name: {
		type: STRING(255),
	},
	maq_page_number: {
		type: INTEGER(),
	},
});

export default tm_mega_question_set;
