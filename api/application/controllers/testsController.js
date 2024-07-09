import testsModel from '../model/testsModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const testsController = {
	createTest: async (req, res) => {
		console.log(req.body, 'createTest');
		let { test: _t, testQuestions: _q, _formData: _fd } = req.body;
		try {
			let _createTestRes = await testsModel.createTest(_t, _q, _fd);
			console.log(_createTestRes);
			if (_createTestRes) {
				return sendSuccess(res, 'Successfully created test');
			}
		} catch (error) {
			console.log(error);
			return sendError(res, error.message);
		}
	},
};

export default testsController;
