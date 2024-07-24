import { myDate } from '../config/utils.js';
import postModel from '../model/postModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const postController = {
	getPostList: async (req, res, next) => {
		try {
			let [postsList] = await postModel.getPostList();
			return sendSuccess(res, postsList);
		} catch (error) {
			return sendError(res, error);
		}
	},
	addPost: async (req, res) => {
		try {
			const { postName } = req.body;
			let insertData = {
				mtl_test_name: postName,
				mtl_long_form: '-',
				mtl_test_desc: '-',
				added_time: myDate.getTime(),
				added_date: myDate.getDate(),
				added_time_stamp: myDate.getTimeStamp(),
				mtl_is_active: 1,
			};
			const response = await postModel.addPost(insertData);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			} else {
				throw new Error('Data not inserted');
			}
		} catch (error) {
			return sendError(res, error);
		}
	},
};

export default postController;
