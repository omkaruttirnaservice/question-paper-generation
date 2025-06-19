import { Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const remoteModel = {
    getTodaysExamList: async (data) => {
        console.log(data.downloadedExamsId, '=data.downloadedExamsId');
        const results = await sequelize.query(
            `
			SELECT 
				JSON_ARRAYAGG(
					JSON_OBJECT(
						'post_id', post_id,
						'post_name', post_name,
						'published_test_id', published_test_id
					)
				) AS post_details,
				tm_publish_test_list.id,
				DATE_FORMAT('ptl_active_date', '%d-%m-%Y'), ptl_active_date,
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
				ptl_active_date >= CURDATE() AND ptl_test_mode = '${data.exam_mode}'
				${
                    data.downloadedExamsId.length > 0
                        ? ` AND tm_publish_test_list.id NOT IN (${data.downloadedExamsId}) `
                        : ''
                }	
			GROUP BY tm_publish_test_list.id
			ORDER BY tm_allow_to
			`,
            {
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        // this is temp removed
        // AND center_code = '${data.center_code}'
        return results;
    },

    getMockStudensList: async (center_code, published_test_id) => {
        let query = `SELECT * FROM tn_student_list AS sl
					INNER JOIN tm_publish_test_list AS ptl
					ON sl.sl_batch_no = ptl.tm_allow_to 
						AND
						sl.sl_exam_date = ptl.ptl_active_date
						AND
						sl.sl_center_code = ptl.center_code
					WHERE sl.sl_center_code = ${center_code}
							AND
						ptl.id = ${published_test_id}
					`;
        return await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
        });
    },
};

export default remoteModel;

// attributes: [
// 				'id',
// 				[
// 					Sequelize.fn(
// 						'DATE_FORMAT',
// 						Sequelize.col('ptl_active_date'),
// 						'%d-%m-%Y'
// 					),
// 					'ptl_active_date',
// 				],
// 				'ptl_time',
// 				'ptl_link',
// 				'ptl_test_id',
// 				'ptl_added_date',
// 				'ptl_added_time',
// 				'ptl_time_stamp',
// 				'ptl_test_description',
// 				'ptl_is_live',
// 				'ptl_aouth_id',
// 				'ptl_is_test_done',
// 				'ptl_test_info',
// 				'mt_name',
// 				'mt_added_date',
// 				'mt_descp',
// 				'mt_is_live',
// 				'mt_time_stamp',
// 				'mt_type',
// 				'tm_aouth_id',
// 				'mt_test_time',
// 				'mt_total_test_takan',
// 				'mt_is_negative',
// 				'mt_negativ_mark',
// 				'mt_mark_per_question',
// 				'mt_passing_out_of',
// 				'mt_total_marks',
// 				'mt_pattern_type',
// 				'mt_total_test_question',
// 				'mt_added_time',
// 				'ptl_link_1',
// 				'tm_allow_to',
// 				'ptl_test_mode',
// 				'is_test_loaded',
// 				'is_student_added',
// 				'ptl_master_exam_id',
// 				'ptl_master_exam_name',
// 				'is_test_generated',
// 				'is_push_done',
// 			],
// 			where: {
// 				ptl_active_date: {
// 					[Op.gte]: myDate.getDate(), // this will check for date today and greater than today
// 				},
// 			},
