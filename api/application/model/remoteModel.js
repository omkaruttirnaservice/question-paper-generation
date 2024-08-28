import { Op, Sequelize } from 'sequelize';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';
import { myDate } from '../config/utils.js';
import sequelize from '../config/db-connect-migration.js';

const remoteModel = {
	getTodaysExamList: async ({ exam_list }) => {
		console.log(exam_list, '====exam_list=====');
		if (exam_list.exam_list.length == 0) {
			return await tm_publish_test_list.findAll({
				attributes: [
					'id',
					[Sequelize.fn('DATE_FORMAT', Sequelize.col('ptl_active_date'), '%d-%m-%Y'), 'ptl_active_date'],
					'ptl_time',
					'ptl_link',
					'ptl_test_id',
					'ptl_added_date',
					'ptl_added_time',
					'ptl_time_tramp',
					'ptl_test_description',
					'ptl_is_live',
					'ptl_aouth_id',
					'ptl_is_test_done',
					'ptl_test_info',
					'mt_name',
					'mt_added_date',
					'mt_descp',
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
					'mt_added_time',
					'ptl_link_1',
					'tm_allow_to',
					'ptl_test_mode',
					'is_test_loaded',
					'is_student_added',
					'ptl_master_exam_id',
					'ptl_master_exam_name',
					'is_test_generated',
					'is_push_done',
				],
				raw: true,
				where: {
					ptl_active_date: {
						[Op.gte]: myDate.getDate(), // this will check for date today and greater than today
					},
				},
			});
		}

		console.log(exam_list.exam_list, '==exam_list.exam_list==');
	},
};

export default remoteModel;
