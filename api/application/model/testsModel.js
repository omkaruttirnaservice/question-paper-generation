import { Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import db from '../config/db.connect.js';
import mockDummyData from '../config/mockDummyData.js';
import { myDate } from '../config/utils.js';
import tm_mega_question_set from '../schemas/tm_mega_question_set.js';
import tm_publish_test_by_post from '../schemas/tm_publish_test_by_post.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';
import tm_test_question_sets from '../schemas/tm_test_question_sets.js';
import tm_test_user_master_list from '../schemas/tm_test_user_master_list.js';
import tn_student_list from '../schemas/tn_student_list.js';

const testsModel = {
    getList: async () => {
        return tm_test_user_master_list.findAll(
            {
                // prettier-ignore
                attributes: [
					'id',
					'mt_name',
					[sequelize.fn('DATE_FORMAT', sequelize.col('mt_added_date'), '%d-%m-%Y'), 'mt_added_date'],
					'mt_descp',
					'mt_added_time',
					'mt_is_live',
					'mt_time_stamp',
					'mt_type',
					'tm_aouth_id',
					'mt_test_time',
					'mt_total_test_takan',
					'mt_is_negative',
					'mt_negativ_mark',
					'mt_mark_per_question',
					'mt_passing_out_of',
					'mt_total_marks',
					'mt_pattern_type',
					'mt_total_test_question',
				],
            },
            { raw: true }
        );
    },

    getPublishedList: async (type = 'EXAM') => {
        return await sequelize.query(
            `SELECT 
				JSON_ARRAYAGG(
					JSON_OBJECT(
						'post_id', post_id,
						'post_name', post_name,
						'published_test_id', published_test_id
					)
				) AS post_details,
				tm_publish_test_list.id,
				DATE_FORMAT(ptl_active_date, '%d-%m-%Y') ptl_active_date,
				ptl_time,
				ptl_link,
				ptl_test_id,
				ptl_added_date,
				ptl_added_time,
				ptl_time_stamp,
				ptl_test_description,
				ptl_is_live,
				ptl_aouth_id,
				ptl_is_test_done,
				ptl_test_info,
				mt_name,
				mt_added_date,
				mt_descp,
				mt_is_live,
				mt_time_stamp,
				mt_type,
				tm_aouth_id,
				mt_test_time,
				mt_total_test_takan,
				mt_is_negative,
				mt_negativ_mark,
				mt_mark_per_question,
				mt_passing_out_of,
				mt_total_marks,
				mt_pattern_type,
				mt_total_test_question,
				mt_added_time,
				ptl_link_1,
				tm_allow_to,
				ptl_test_mode,
				is_test_loaded,
				is_student_added,
				ptl_master_exam_id,
				ptl_master_exam_name,
				is_test_generated,
				post_id, post_name, published_test_id
			FROM tm_publish_test_list

			INNER JOIN
				tm_publish_test_by_post
			ON tm_publish_test_list.id = tm_publish_test_by_post.published_test_id
			
			WHERE 
				ptl_active_date >= CURDATE()
            AND ptl_test_mode = '${type}'
			GROUP BY tm_publish_test_list.id`,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        // let today = new Date();
        // today.setHours(0, 0, 0, 0);

        // return tm_publish_test_list.findAll(
        // 	{
        // 		attributes: [
        // 			'id',
        // 			[
        // 				sequelize.fn(
        // 					'DATE_FORMAT',
        // 					sequelize.col('ptl_active_date'),
        // 					'%d-%m-%Y'
        // 				),
        // 				'ptl_active_date',
        // 			],
        // 			'ptl_time',
        // 			'ptl_link',
        // 			'ptl_test_id',
        // 			'ptl_added_date',
        // 			'ptl_added_time',
        // 			'ptl_time_stamp',
        // 			'ptl_test_description',
        // 			'ptl_is_live',
        // 			'ptl_aouth_id',
        // 			'ptl_is_test_done',
        // 			'ptl_test_info',
        // 			'mt_name',
        // 			'mt_added_date',
        // 			'mt_descp',
        // 			'mt_is_live',
        // 			'mt_time_stamp',
        // 			'mt_type',
        // 			'tm_aouth_id',
        // 			'mt_test_time',
        // 			'mt_total_test_takan',
        // 			'mt_is_negative',
        // 			'mt_negativ_mark',
        // 			'mt_mark_per_question',
        // 			'mt_passing_out_of',
        // 			'mt_total_marks',
        // 			'mt_pattern_type',
        // 			'mt_total_test_question',
        // 			'mt_added_time',
        // 			'ptl_link_1',
        // 			'tm_allow_to',
        // 			'ptl_test_mode',
        // 			'is_test_loaded',
        // 			'is_student_added',
        // 			'ptl_master_exam_id',
        // 			'ptl_master_exam_name',
        // 			'is_test_generated',
        // 			'is_push_done',
        // 		],

        // 		where: {
        // 			ptl_active_date: {
        // 				[Op.gte]: today,
        // 			},
        // 		},
        // 		order: [['ptl_active_date', 'ASC']],
        // 	},
        // 	{ raw: true }
        // );
    },

    deleteTest: async (deleteId) => {
        let transact = await sequelize.transaction();
        try {
            await tm_test_user_master_list.destroy({ where: { id: +deleteId } });
            await tm_test_question_sets.destroy({
                where: { tqs_test_id: +deleteId },
            });

            await transact.commit();
            return {
                message: 'Deleted successful',
            };
        } catch (error) {
            console.log(error, '==error==');
            await transact.rollback();
        }
    },

    createTest: async (_t, _q) => {
        let transact = await sequelize.transaction();
        try {
            let _masterTest = await tm_test_user_master_list.create(
                {
                    mt_name: _t.test_name,
                    mt_added_date: myDate.getDate(),
                    mt_descp: 'TEST',
                    mt_added_time: myDate.getTime(),
                    mt_is_live: 1,
                    mt_time_stamp: myDate.getDateTime(),
                    mt_type: 1,
                    tm_aouth_id: 1,
                    mt_test_time: _t.test_duration,
                    mt_total_test_takan: 0,
                    mt_is_negative: _t.is_negative_marking,
                    mt_negativ_mark: 0,
                    mt_mark_per_question: _t.marks_per_question,
                    mt_passing_out_of: _t.test_passing_mark,
                    mt_total_marks: +_t.total_questions * +_t.marks_per_question,
                    mt_pattern_type: 1,
                    mt_total_test_question: +_t.total_questions,
                },
                { transaction: transact }
            );

            let masterTestId = _masterTest.toJSON().id;

            let questionsData = [];
            _q.forEach((_q) => {
                questionsData.push({
                    q_id: _q.q_id,
                    tqs_test_id: masterTestId,
                    section_id: 0,
                    section_name: '-',
                    sub_topic_id: _q.sub_topic_id,
                    sub_topic_section: _q.sub_topic_section,
                    main_topic_id: _q.main_topic_id,
                    main_topic_name: _q.main_topic_name,
                    q: _q.q,
                    q_a: _q.q_a,
                    q_b: _q.q_b,
                    q_c: _q.q_c,
                    q_d: _q.q_d,
                    q_e: _q.q_e,
                    q_display_type: 1,
                    q_ask_in: null,
                    q_data_type: null,
                    q_mat_data: null,
                    q_col_a: null,
                    q_col_b: null,
                    q_mat_id: null,
                    q_i_a: null,
                    q_i_b: null,
                    q_i_c: null,
                    q_i_d: null,
                    q_i_e: null,
                    q_i_q: null,
                    q_i_sol: null,
                    stl_topic_number: null,
                    sl_section_no: null,
                    q_sol: _q.q_sol,
                    q_ans: _q.q_ans,
                    q_mat_ans: null,
                    q_mat_ans_row: null,
                    q_col_display_type: null,
                    question_no: null,
                    mark_per_question: _t.marks_per_question,
                    tqs_question_id: _q.q_id,
                    tqs_chapter_id: _q.sub_topic_id,
                    tqs_section_id: 0,
                    pub_name: _q.pub_name,
                    book_name: _q.book_name,
                    page_name: _q.page_name,
                    mqs_ask_in_month: _q.mqs_ask_in_month,
                    mqs_ask_in_year: _q.mqs_ask_in_year,
                    mqs_leval: _q.mqs_leval,
                });
            });
            await tm_test_question_sets.bulkCreate(questionsData, {
                transaction: transact,
            });

            await transact.commit();
            return _masterTest.toJSON();
        } catch (error) {
            await transact.rollback();
            console.log('error occured in query', error);
        }
    },

    getRandQues: (subjectId, topicId, limit) => {
        let query = `SELECT
							question_list.id as q_id,
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
								WHERE
									mqs_section_id = ${subjectId} OR
									mqs_chapter_id = ${topicId} AND
									is_que_selected_previously = 0

								ORDER BY RAND()
									LIMIT ${limit}`;
        return db.query(query);
    },

    createMasterTest: async (_t) => {
        return await tm_test_user_master_list.create({
            mt_name: _t.test_name,
            mt_added_date: myDate.getDate(),
            mt_descp: 'TEST',
            mt_added_time: myDate.getTime(),
            mt_is_live: 1,
            mt_time_stamp: myDate.getDateTime(),
            mt_type: 1,
            tm_aouth_id: 1,
            mt_test_time: _t.test_duration,
            mt_total_test_takan: 0,
            mt_is_negative: _t.is_negative_marking,
            mt_negativ_mark: 0,
            mt_mark_per_question: _t.marks_per_question,
            mt_passing_out_of: _t.test_passing_mark,
            mt_total_marks: +_t.total_questions * +_t.marks_per_question,
            mt_pattern_type: 1,
            mt_total_test_question: +_t.total_questions,
        });
    },

    getQuestionsDataToSave: (q, masterTestId, _t) => {
        let questionsData = [];
        q.forEach((_q) => {
            questionsData.push({
                q_id: _q.q_id,
                tqs_test_id: masterTestId,
                section_id: 0,
                section_name: '-',
                sub_topic_id: _q.sub_topic_id,
                sub_topic_section: _q.sub_topic_section,
                main_topic_id: _q.main_topic_id,
                main_topic_name: _q.main_topic_name,
                q: _q.q,
                q_a: _q.q_a,
                q_b: _q.q_b,
                q_c: _q.q_c,
                q_d: _q.q_d,
                q_e: _q.q_e,
                q_display_type: 1,
                q_ask_in: null,
                q_data_type: null,
                q_mat_data: null,
                q_col_a: null,
                q_col_b: null,
                q_mat_id: null,
                q_i_a: null,
                q_i_b: null,
                q_i_c: null,
                q_i_d: null,
                q_i_e: null,
                q_i_q: null,
                q_i_sol: null,
                stl_topic_number: null,
                sl_section_no: null,
                q_sol: _q.q_sol,
                q_ans: _q.q_ans,
                q_mat_ans: null,
                q_mat_ans_row: null,
                q_col_display_type: null,
                question_no: null,
                mark_per_question: _t.marks_per_question,
                tqs_question_id: _q.q_id,
                tqs_chapter_id: _q.sub_topic_id,
                tqs_section_id: 0,
                pub_name: _q.pub_name,
                book_name: _q.book_name,
                page_name: _q.page_name,
                mqs_ask_in_month: _q.mqs_ask_in_month,
                mqs_ask_in_year: _q.mqs_ask_in_year,
                mqs_leval: _q.mqs_leval,
            });
        });
        return questionsData;
        // return await tm_test_question_sets.bulkCreate(questionsData);
    },

    saveExamQuestions: async (q, masterTestId, _t) => {
        let questionsData = [];
        q.forEach((_q) => {
            questionsData.push({
                q_id: _q.q_id,
                tqs_test_id: masterTestId,
                section_id: 0,
                section_name: '-',
                sub_topic_id: _q.sub_topic_id,
                sub_topic_section: _q.sub_topic_section,
                main_topic_id: _q.main_topic_id,
                main_topic_name: _q.main_topic_name,
                q: _q.q,
                q_a: _q.q_a,
                q_b: _q.q_b,
                q_c: _q.q_c,
                q_d: _q.q_d,
                q_e: _q.q_e,
                q_display_type: 1,
                q_ask_in: null,
                q_data_type: null,
                q_mat_data: null,
                q_col_a: null,
                q_col_b: null,
                q_mat_id: null,
                q_i_a: null,
                q_i_b: null,
                q_i_c: null,
                q_i_d: null,
                q_i_e: null,
                q_i_q: null,
                q_i_sol: null,
                stl_topic_number: null,
                sl_section_no: null,
                q_sol: _q.q_sol,
                q_ans: _q.q_ans,
                q_mat_ans: null,
                q_mat_ans_row: null,
                q_col_display_type: null,
                question_no: null,
                mark_per_question: _t.marks_per_question,
                tqs_question_id: _q.q_id,
                tqs_chapter_id: _q.sub_topic_id,
                tqs_section_id: 0,
                pub_name: _q.pub_name,
                book_name: _q.book_name,
                page_name: _q.page_name,
                mqs_ask_in_month: _q.mqs_ask_in_month,
                mqs_ask_in_year: _q.mqs_ask_in_year,
                mqs_leval: _q.mqs_leval,
            });
        });
        return await tm_test_question_sets.bulkCreate(questionsData);
    },

    updateTestQueSelectionStatus: (id) => {
        return tm_mega_question_set.update(
            {
                is_que_selected_previously: 1,
            },
            {
                where: {
                    id: [...id],
                },
            }
        );
    },

    // tests key
    checkForDuplicateTestKey: (testKey) => {
        return tm_publish_test_list.findAll({
            where: {
                ptl_link_1: testKey,
            },
            raw: true,
            limit: 1,
        });
    },

    publishTest: async ({
        batch,
        publish_date,
        test_key,
        test_details: mt,
        selected_posts,
        is_show_exam_sections,
    }) => {
        // changing publish date format from dd-mm-yyyy to yyy-mm-dd
        let _tmpPubDate = publish_date.split('-');
        publish_date = `${_tmpPubDate[2]}-${_tmpPubDate[1]}-${_tmpPubDate[0]}`;

        let [mt_date, mt_month, mt_year] = mt.mt_added_date.split('-');

        // preparing insert data to save into database
        let insertData = {
            ptl_active_date: publish_date,
            ptl_time: 0,
            ptl_link: btoa(test_key),
            ptl_link_1: test_key,
            ptl_test_id: mt.id,
            ptl_added_date: myDate.getDate(),
            ptl_added_time: myDate.getTime(),
            ptl_time_stamp: myDate.getDateTime(),
            ptl_test_description: '-',
            ptl_is_live: 1,
            ptl_aouth_id: 1,
            ptl_is_test_done: 0,
            ptl_test_info: JSON.stringify({}),

            mt_name: mt.mt_name,
            mt_added_date: `${mt_year}-${mt_month}-${mt_date}`,
            mt_descp: mt.mt_descp,
            mt_is_live: mt.mt_is_live,
            mt_time_stamp: mt.mt_time_stamp,
            mt_type: mt.mt_type,
            tm_aouth_id: mt.tm_aouth_id,
            mt_test_time: mt.mt_test_time,
            mt_total_test_takan: mt.mt_total_test_takan,
            mt_is_negative: mt.mt_is_negative,
            mt_negativ_mark: mt.mt_negativ_mark,
            mt_mark_per_question: mt.mt_mark_per_question,
            mt_passing_out_of: mt.mt_passing_out_of,
            mt_total_marks: mt.mt_total_marks,
            mt_pattern_type: mt.mt_pattern_type,
            mt_total_test_question: mt.mt_total_test_question,
            mt_added_time: mt.mt_added_time,

            mt_pattern_name: '-',
            is_test_generated: 0,
            ptl_test_mode: 'EXAM',
            center_code: '',
            tm_allow_to: batch,
            is_test_loaded: 0,
            is_student_added: 0,
            is_uploaded: '',

            is_start_exam: 0,
            is_absent_mark: 0,
            is_exam_downloaded: 0,

            is_photos_downloaded: 0,
            is_sign_downloaded: 0,
            is_final_published: 0,
            is_students_downloaded: 0,
            is_attendance_started: 0,

            ptl_master_exam_id: 0,
            ptl_master_exam_name: '-',
            is_show_exam_sections: is_show_exam_sections == 'yes' ? 1 : 0,
        };

        console.log(insertData, 'insertData for publish exam');

        let trans = await sequelize.transaction();

        try {
            let _publishTestInsert = await tm_publish_test_list.create(insertData, {
                transaction: trans,
            });

            const postTestMappingList = selected_posts.map((_post) => {
                return {
                    post_id: _post.ca_post_id,
                    post_name: _post.ca_post_name,
                    published_test_id: _publishTestInsert.id,
                };
            });

            console.log(postTestMappingList, '==postTestMappingList==');

            // map published test id with post in new table
            await tm_publish_test_by_post.bulkCreate(postTestMappingList);

            await trans.commit();

            return _publishTestInsert;
        } catch (error) {
            trans.rollback();
        }
    },

    unpublishTest: async (id) => {
        return tm_publish_test_list.destroy({
            where: {
                id: id,
            },
        });
    },

    // getting test questions list
    getTestQuestionsList: async (testId) => {
        return tm_test_question_sets.findAll({
            where: { tqs_test_id: testId },
            order: [['sub_topic_id', 'ASC']],
        });
    },

    // update test question
    updateTestQuestion: async (data) => {
        console.log(data, '==data to update question==');

        let trans = await sequelize.transaction();
        try {
            let _updateRes = tm_test_question_sets.update(
                {
                    q: data.question_content,
                    q_a: data.option_A,
                    q_b: data.option_B,
                    q_c: data.option_C,
                    q_d: data.option_D,
                    q_e: data.option_E,
                    q_ans: data.correct_option,
                    q_sol: data.explanation,
                    pub_name: data.pub_name,
                    book_name: data.book_name,
                    page_name: data.pg_no,
                    mqs_ask_in_month: data.month,
                    mqs_ask_in_year: data.year,
                    mqs_leval: data.difficulty,
                },
                {
                    where: {
                        id: data.question_id,
                    },
                },
                { transaction: trans }
            );
            await trans.commit();
            return _updateRes;
        } catch (error) {
            trans.rollback();
            console.log(error, '==error==');
        }
    },

    publishMockTest: async (testData) => {
        let d = mockDummyData.testDetails(testData);

        console.log(d, '-mock test data');

        return await tm_publish_test_list.create({
            ptl_active_date: d.ptl_active_date,
            ptl_time: d.ptl_time,
            ptl_link: d.ptl_link,
            ptl_link_1: d.ptl_link_1,
            ptl_test_id: d.ptl_test_id,
            ptl_master_exam_id: d.ptl_master_exam_id,
            ptl_master_exam_name: d.ptl_master_exam_name,
            ptl_added_date: d.ptl_added_date,
            ptl_added_time: d.ptl_added_time,
            ptl_time_stamp: d.ptl_time_stamp,
            ptl_test_description: d.ptl_test_description,
            ptl_is_live: d.ptl_is_live,
            ptl_aouth_id: d.ptl_aouth_id,
            ptl_is_test_done: d.ptl_is_test_done,
            // ptl_test_info: JSON.stringify(d.ptl_test_info),
            ptl_test_info: JSON.stringify({}),
            mt_name: d.mt_name,
            mt_added_date: d.mt_added_date,
            mt_descp: d.mt_descp,
            mt_is_live: d.mt_is_live,
            mt_time_stamp: d.mt_time_stamp,
            mt_type: d.mt_type,
            tm_aouth_id: d.tm_aouth_id,
            mt_test_time: d.mt_test_time,
            mt_total_test_takan: d.mt_total_test_takan,
            mt_is_negative: d.mt_is_negative,
            mt_negativ_mark: d.mt_negativ_mark,
            mt_mark_per_question: d.mt_mark_per_question,
            mt_passing_out_of: d.mt_passing_out_of,
            mt_total_marks: d.mt_total_marks,
            mt_pattern_type: d.mt_pattern_type,
            mt_total_test_question: d.mt_total_test_question,
            mt_added_time: d.mt_added_time,
            mt_pattern_name: d.mt_pattern_name,
            is_test_generated: d.is_test_generated,
            ptl_test_mode: d.ptl_test_mode,

            center_code: d.center_code,
            tm_allow_to: d.tm_allow_to,
            is_test_loaded: d.is_test_loaded,
            is_student_added: d.is_student_added,
            is_uploaded: d.is_uploaded,
            is_start_exam: d.is_start_exam,
            is_absent_mark: d.is_absent_mark,
            is_exam_downloaded: d.is_exam_downloaded,
            is_photos_downloaded: d.is_photos_downloaded,
            is_sign_downloaded: d.is_sign_downloaded,
            is_final_published: d.is_final_published,
            is_students_downloaded: d.is_students_downloaded,
            is_attendance_started: 0,
        });
    },

    publishTestByPost: async (testData) => {
        return await tm_publish_test_by_post.create({
            post_id: 1,
            post_name: testData.post_name,
            published_test_id: testData.published_test_id,
        });
    },

    checkForDuplicateTest: async function (testData) {
        const q = `SELECT 
            *,
            DATE_FORMAT(ptl_active_date,'%Y-%m-%d') AS ptl_active_date

            FROM tm_publish_test_list
            WHERE center_code = ${testData.center_code}
            AND ptl_active_date = '${testData.exam_date}'
            AND ptl_test_mode = 'MOCK'

            LIMIT 1
        `;
        return await db.query(q);
    },

    getPublishedTestById: async function (ptid) {
        return await tm_publish_test_list.findOne({ where: { id: ptid }, raw: true });
    },

    removeDuplicateTestData: async function (duplicateTestDetails) {
        try {
            const q = `DELETE FROM tm_publish_test_list WHERE id = ${duplicateTestDetails.id}`;
            const q2 = `DELETE FROM tm_publish_test_by_post WHERE published_test_id = ${duplicateTestDetails.id} AND id >= 1`;

            const q3 = `DELETE FROM tn_student_list 
                        WHERE sl_center_code = ${duplicateTestDetails.center_code} 
                        AND sl_batch_no = ${duplicateTestDetails.tm_allow_to}
                        AND sl_exam_date = '${duplicateTestDetails.ptl_active_date}'
                        AND id >= 1`;
            const q4 = `DELETE FROM tm_test_question_sets
                        WHERE tqs_test_id = ${duplicateTestDetails.ptl_test_id}
                        AND id >= 1`;
            await db.query(q);
            await db.query(q2);
            await db.query(q3);
            await db.query(q4);
        } catch (error) {
            console.log(error, '=error');
        }
    },

    truncateTable: async function (table) {
        try {
            console.log(`Truncating : ${table}`);
            let query = `TRUNCATE ${table}`;
            return await db.query(query);
        } catch (error) {
            console.log(error, '=error');
        }
    },

    getLastInsertRollNumber: async () => {
        const q = `SELECT id FROM tn_student_list ORDER BY id DESC LIMIT 1;`;
        return await db.query(q);
    },

    generateMockStudents: async (testData) => {
        let students = mockDummyData.studentDummyData(testData);

        return await tn_student_list.bulkCreate(students);
    },

    generateMockquestions: async (testData) => {
        const questions = mockDummyData.getDummyQuestion(testData);

        return await tm_test_question_sets.bulkCreate(questions);
    },

    getMockExamReport: async (testDetails) => {
        const q = `SELECT 
                        mac_id,
                        stm_min,
                        stm_sec,
                        stl_test_status,
                        stl_publish_id,
                        CONCAT(sl_f_name,' ',sl_m_name,' ',sl_l_name) AS full_name,
                        ptl.id AS published_test_id
                    FROM tn_student_list AS sl

                    LEFT JOIN mock_exam_report AS mer
                    ON sl.id =  mer.stl_stud_id

                    LEFT JOIN tm_publish_test_list AS ptl
                    ON ptl.id = mer.stl_publish_id AND ptl.id = ${Number(testDetails.id)} 

                    WHERE sl.sl_exam_date = '${testDetails.ptl_active_date}'
                    AND sl.sl_center_code = ${testDetails.center_code}`;
        return sequelize.query(q, {
            type: Sequelize.QueryTypes.SELECT,
        });
    },
};

export default testsModel;
