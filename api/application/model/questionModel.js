import db from '../config/db.connect.js';
import { myDate } from '../config/utils.js';
import tm_mega_question_set from '../schemas/tm_mega_question_set.js';
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
		return db.query(`SELECT COUNT(id) AS total_questions FROM tm_mega_question_set;`);
	},

	getQuestionList: (d) => {
		console.log(d, 'in model');

		const q = `SELECT
 	 						questions.q_id as q_id,
          					questions.tqs_test_id as tqs_test_id,
		                    questions.section_id as section_id,
		                    questions.section_name as section_name,
		                    questions.sub_topic_id as sub_topic_id,
		                    questions.sub_topic_section as sub_topic_section,
		                    questions.main_topic_id as main_topic_id,
		                    questions.main_topic_name as main_topic_name,
		                   	questions.q as q,
		                   	questions.q_a as q_a,
		                   	questions.q_b as q_b,
		                    questions.q_c as q_c,
		                    questions.q_d as q_d,
		                    questions.q_e as q_e,
 							questions.q_display_type as q_display_type,
		                    questions.q_ask_in as q_ask_in,
		                    questions.q_data_type as q_data_type,
		                    questions.q_mat_data as q_mat_data,
		                    questions.q_col_a as q_col_a,
		                    questions.q_col_b as q_col_b,
		                    questions.q_mat_id as q_mat_id,
		                    questions.q_i_a as q_i_a,
		                    questions.q_i_b as q_i_b,
		                    questions.q_i_c as q_i_c,
		                    questions.q_i_d as q_i_d,
		                    questions.q_i_e as q_i_e,
		                    questions.q_i_q as q_i_q,
		                    questions.q_i_sol as q_i_sol,
		                    questions.stl_topic_number as stl_topic_number,
		                    questions.sl_section_no as sl_section_no,
		                    questions.q_sol as q_sol,
							questions.q_ans as q_ans,
							questions.q_mat_ans as q_mat_ans,	
							questions.q_mat_ans_row as q_mat_ans_row,	
							questions.q_col_display_type as q_col_display_type,	
							questions.question_no as question_no,	
							questions.mark_per_question as mark_per_question,
							questions.tqs_question_id as tqs_question_id,
							questions.tqs_chapter_id as tqs_chapter_id,
							questions.tqs_section_id as tqs_section_id,
							questions.pub_name as pub_name,
							questions.book_name as book_name,
							questions.page_name as page_name,
							count(tqs.id) as duplicate_count,
							questions.mqs_ask_in_month as mqs_ask_in_month,
							questions.mqs_ask_in_year as mqs_ask_in_year,
							questions.mqs_leval as mqs_leval
						FROM  
	 	 					(SELECT
	          					question_list.id as q_id,
	          					IFNULL(0,0) as tqs_test_id,
			                    IFNULL(0,0) as section_id,
			                    IFNULL('-','-')as section_name,
			                    sub_topic_list.id as sub_topic_id,
			                    sub_topic_list.stl_name as sub_topic_section,
			                    sub_topic_list.stl_main_topic_list_id as main_topic_id,
			                    main_topic_list.mtl_name as main_topic_name,
			                   	IFNULL(question_list.mqs_question,'') as q,
			                   	IFNULL(question_list.mqs_opt_one,'') as q_a,
			                   	IFNULL(question_list.mqs_opt_two,'') as q_b,
			                    IFNULL(question_list.mqs_opt_three,'') as q_c,
			                    IFNULL(question_list.mqs_opt_four,'') as q_d,
			                    IFNULL(question_list.mqs_opt_five,'') as q_e,
	 							IFNULL(question_list.mqs_type,'') as q_display_type,
			                    IFNULL(question_list.mqs_ask_in,'') as q_ask_in,
			                    IFNULL(question_list.mqs_question_data,1) as q_data_type,
			                    IFNULL('','') as q_mat_data,
			                    IFNULL('','') as q_col_a,
			                    IFNULL('','') as q_col_b,
			                    IFNULL('','0') as q_mat_id,
			                    IFNULL(0,0) as q_i_a,
			                    IFNULL(0,0) as q_i_b,
			                    IFNULL(0,0) as q_i_c,
			                    IFNULL(0,0) as q_i_d,
			                    IFNULL(0,0) as q_i_e,
			                    IFNULL(0,0) as q_i_q,
			                    IFNULL(0,0) as q_i_sol,
			                    IFNULL(0,0) as stl_topic_number,
			                    IFNULL(0,0) as sl_section_no,
			                    IFNULL(question_list.mqs_solution,'') as q_sol,
								IFNULL(question_list.mqs_ans,'') as q_ans,
								IFNULL('','') as q_mat_ans,	
								IFNULL('','') as q_mat_ans_row,	
								IFNULL(1,1) as q_col_display_type,	
								IFNULL('-','-') as question_no,	
								IFNULL(1,1) as mark_per_question,
								question_list.id as tqs_question_id,
								mqs_chapter_id as tqs_chapter_id,
								mqs_section_id as tqs_section_id,
								msq_publication_name as pub_name,
								msq_book_name as book_name,
								maq_page_number as page_name,
								mqs_ask_in_month as mqs_ask_in_month,
								mqs_ask_in_year as mqs_ask_in_year,
								mqs_leval as mqs_leval

								FROM 
			                        tm_mega_question_set as question_list 

									INNER JOIN  
			                        tm_sub_topic_list as sub_topic_list ON
			                        sub_topic_list.id = question_list.mqs_chapter_id  

			                      	INNER JOIN 
		                   			tm_main_topic_list as main_topic_list ON
		                   			sub_topic_list.stl_main_topic_list_id  = main_topic_list.id

		                   			WHERE mqs_chapter_id = ${+d.topic_id}
							) as questions LEFT JOIN
							tm_test_question_sets as tqs
							ON 
							questions.q_id = tqs.q_id
						GROUP BY q_id;`;
		console.log(q, '==q==');
		return db.query(q);
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
