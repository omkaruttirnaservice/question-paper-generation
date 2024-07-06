import { myDate } from '../config/utils.js';
import subjectModel from '../model/subjectModel.js';
import { sendSuccess, sendError } from '../utils/commonFunctions.js';
const subjectController = {
	getSubjectList: async (req, res) => {
		try {
			let { post_id } = req.body;
			if (!post_id) {
				throw new Error('Please send post id');
			}
			const [response] = await subjectModel.getSubjectList(post_id);
			sendSuccess(res, response);
		} catch (error) {
			sendError(res, error);
		}
	},
	addSubject: async (req, res) => {
		try {
			const { postId, subjectName } = req.body;

			let insertData = {
				mtl_master_test_list_id: postId,
				mtl_name: subjectName,
				mtp_added_aouth_id: 1,
				mtl_added_time: '00:00:00',
				mtl_added_date: new Date(),
				mtl_time_stamp: '',
				mtl_is_live: 1,
				type: 1,
			};

			const response = await subjectModel.addSubject(insertData);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			} else {
				throw new Error('Data not inserted');
			}
		} catch (error) {
			sendError(res, error);
		}
	},

	getTopicList: async function (req, res) {
		try {
			const subjectId = req.body.subjectId;
			const response = await subjectModel.getTopicList(subjectId);
			sendSuccess(res, response[0]);
		} catch (error) {
			sendError(res, error);
		}
	},

	addTopic: async function (req, res) {
		try {
			const { postId, subjectId, topicName } = req.body;

			let insertData = {
				stl_name: topicName,
				stl_master_test_id: postId,
				stl_main_topic_list_id: subjectId,
				stl_added_date: myDate.getDate(),
				stl_added_time: myDate.getTime(),
				stl_time_stamp: myDate.getTimeStamp(),
			};
			const response = await subjectModel.addTopic(insertData);
			sendSuccess(res, response[0]);
		} catch (error) {
			sendError(res, error);
		}
	},
};

export default subjectController;
