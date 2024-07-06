import postModel from '../model/postModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const postController = {
	getPostList: async (req, res, next) => {
		console.log('here ====backend');
		try {
			let [postsList] = await postModel.getPostList();
			console.log(postsList, 'list');
			return sendSuccess(res, postsList);
		} catch (error) {
			console.log(error, '==error==');

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
				added_time: '00:00:00',
				added_date: new Date(),
				added_time_stamp: '',
				mtl_is_active: 1,
			};
			const response = await postModel.addPost(insertData);
			if (response[0].affectedRows === 1) {
				sendSuccess(res);
			} else {
				throw new Error('Data not inserted');
			}
		} catch (error) {
			sendError(res, error);
		}
	},
};

export default postController;
