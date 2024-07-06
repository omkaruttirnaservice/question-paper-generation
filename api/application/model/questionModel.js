import db from '../config/db.connect.js';
import { myDate } from '../config/utils.js';
const questionModel = {
	addNewQuestion: (data) => {
		console.log(data, 'save question data.');
		return db.query(
			`INSERT INTO tm_mega_question_set 
                        (mqs_question, 
                        mqs_opt_one, 
                        mqs_opt_two, 
                        mqs_opt_three, 
                        mqs_opt_four, 
                        mqs_opt_five,
                        mqs_type,
                        mqs_ans,
                        mqs_solution, 
                        mqs_leval, 
                        mqs_added_by, 
                        mqs_section_id, 
                        mqs_chapter_id, 
                        mqs_added_date, 
                        mqs_added_time, 
                        mqs_added_time_stamp, 
                        mqs_is_trash, 
                        msq_publication_name, 
                        msq_book_name, 
                        maq_page_number, 
                        mqs_ask_in_month, 
                        mqs_ask_in_year
                        )
                    VALUES
                    ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.question_content,
				data.option_A,
				data.option_B,
				data.option_C,
				data.option_D,
				data.option_E,
				'1', // hard coding value to 1 because of mcq question type
				data.correct_option,
				data.explanation,
				data.difficulty,
				'1', // hard coding to 1 because of added by admin
				data.subject_id,
				data.topic_id,
				myDate.getDate(),
				myDate.getTime(),
				myDate.getTimeStamp(),
				'0', // hard coding to 1 becuase question is not trash
				data.pub_name,
				data.book_name,
				data.pg_no,
				data.month,
				data.year,
			]
		);
	},

	restoreQuestion: (id) => {
		const q = `UPDATE tm_mega_question_set SET mqs_is_trash = 0 WHERE id = ?`;
		return db.query(q, [+id]);
	},

	deleteQuestion: (id) => {
		const q = `UPDATE tm_mega_question_set SET mqs_is_trash = 1 WHERE id = ?`;
		return db.query(q, [+id]);
	},

	deleteQuestionPermenant: (id) => {
		const q = `DELETE FROM tm_mega_question_set WHERE id = ?`;
		return db.query(q, [+id]);
	},

	getEditQuestionData: (id) => {
		const q = `
							SELECT 
								mqs.id id,
								mqs.mqs_question question_content,
								mqs.mqs_opt_one option_A,
								mqs.mqs_opt_two option_B,
								mqs.mqs_opt_three option_C,
								mqs.mqs_opt_four option_D,
								mqs.mqs_opt_five option_E,
								mqs.mqs_ans correct_option,
								mqs.mqs_solution explanation,
								mqs.mqs_leval difficulty,
								mqs.mqs_section_id subject_id,
								mqs.mqs_chapter_id topic_id,
								mqs.msq_publication_name pub_name,
								mqs.msq_book_name book_name,
								mqs.maq_page_number pg_no,
								mqs.mqs_ask_in_month month,
								mqs.mqs_ask_in_year year,
								mtl.mtl_name subject_name,
								stl.stl_name topic_name 
							FROM
									tm_mega_question_set AS mqs
											LEFT JOIN
									tm_main_topic_list AS mtl ON mqs.mqs_section_id = mtl.id
											LEFT JOIN
									tm_sub_topic_list AS stl ON mqs.mqs_chapter_id = stl.id
							WHERE
								mqs.id = ?`;
		return db.query(q, [+id]);
	},

	saveEditQuestion: (data) => {
		const q = `UPDATE tm_mega_question_set SET 
                mqs_question = ?,
								mqs_opt_one = ?,
								mqs_opt_two = ?,
								mqs_opt_three = ?,
								mqs_opt_four = ?,
								mqs_opt_five = ?,
                mqs_ans = ?,
                mqs_solution = ?
            WHERE id = ?`;
		return db.query(q, [
			data.question_content,
			data.option_A,
			data.option_B,
			data.option_C,
			data.option_D,
			data.option_E,
			data.correct_option,
			data.explanation,
			data.id,
		]);
	},

	getQuestionNumber: () => {
		return db.query(
			`SELECT COUNT(id) AS total_questions FROM tm_mega_question_set;`
		);
	},

	getQuestionList: (d) => {
		console.log(d, 'in model');
		const q = `SELECT 
                        *
                    FROM tm_mega_question_set AS mqs
                    WHERE 
                        mqs.mqs_section_id = ? AND mqs.mqs_chapter_id = ? AND mqs.mqs_is_trash = 0`;

		return db.query(q, [+d.subject_id, +d.topic_id]);
	},

	getQuestionListTrash: (d) => {
		console.log(d, 'in model');
		const q = `SELECT 
                        *
                    FROM tm_mega_question_set AS mqs
                    WHERE 
                        mqs.mqs_section_id = ? AND mqs.mqs_chapter_id = ? AND mqs.mqs_is_trash = 1`;

		return db.query(q, [+d.subject_id, +d.topic_id]);
	},

	getPublicationList: async () => {
		return db.query(
			`SELECT 
                msq_publication_name
            FROM 
                tm_mega_question_set 
            WHERE
                coalesce(msq_publication_name, '') != ''
            GROUP BY msq_publication_name`
		);
	},

	getBooksList: async (pubName) => {
		return db.query(
			`SELECT 
                msq_book_name
            FROM 
                tm_mega_question_set 
            WHERE
                msq_publication_name = ?
            GROUP BY msq_book_name`,
			[pubName]
		);
	},
};

export default questionModel;
