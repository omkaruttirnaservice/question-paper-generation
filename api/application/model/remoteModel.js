import { Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const remoteModel = {
	getTodaysExamList: async (downloadedExamsId) => {
		console.log(downloadedExamsId[0].id, '==${downloadedExamsId[0].id==');
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
				ptl_time_tramp,
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
				is_push_done,
				post_id, post_name, published_test_id
			FROM tm_publish_test_list

			INNER JOIN
				tm_publish_test_by_post
			ON tm_publish_test_list.id = tm_publish_test_by_post.published_test_id
			
			WHERE 
				ptl_active_date >= CURDATE()
				${
					downloadedExamsId[0]?.id
						? `AND tm_publish_test_list.id NOT IN (${downloadedExamsId[0].id})`
						: ''
				}	
			GROUP BY tm_publish_test_list.id
			`,
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		return results;
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
// 				'ptl_time_tramp',
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
