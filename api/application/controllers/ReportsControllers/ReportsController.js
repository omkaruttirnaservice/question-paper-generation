import sequelize from '../../config/db-connect-migration.js';
import reportsModel from '../../model/reportsModel.js';
import tm_publish_test_list from '../../schemas/tm_publish_test_list.js';
import tm_student_final_result_set from '../../schemas/tm_student_final_result_set.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const reportsController = {
	getExamServerIP: asyncHandler(async (req, res) => {
		let _serverIP = await reportsModel.getExamServerIP();
		if (!_serverIP?.exam_server_ip) throw new ApiError(409, 'Exam server IP not found');
		return res.status(200).json(new ApiResponse(201, _serverIP.exam_server_ip));
	}),
	setExamServerIP: asyncHandler(async (req, res) => {
		let { ip } = req.body;
		if (!ip) throw new ApiError(404, 'Invalid IP address');
		let [_updateRes] = await reportsModel.saveExamServerIP(ip);
		if ([_updateRes] == 1) {
			return res.status(201).json(new ApiResponse(201, ip));
		}
	}),

	getPublishedTests: asyncHandler(async (req, res) => {
		let _tests = await reportsModel.getPublishedTests();
		return res.status(200).json(new ApiResponse(200, _tests));
		console.log(_tests, '==_tests==');
	}),

	generateResult: async (req, res, next) => {
		const transact = await sequelize.transaction();
		try {
			let { testIdInBase64 } = req.body;
			let publishedTestId = atob(testIdInBase64);

			// generate student result
			let [_resultGeneratedRes] = await reportsModel.generateResult(publishedTestId, transact);
			console.log(_resultGeneratedRes, '==_resultGeneratedRes==');
			if (_resultGeneratedRes.length == 0) throw new ApiError(404, 'Could not find the students to generate result');

			// update that result has been declared
			let _updateResultDeclaredRes = await tm_publish_test_list.update(
				{
					is_test_generated: 1,
				},
				{
					where: {
						id: publishedTestId,
					},
					transaction: transact,
				}
			);

			// save result to tm_student_final_result_set
			let _saveResultRes = await tm_student_final_result_set.bulkCreate(_resultGeneratedRes, { transaction: transact });

			// delete result data
			let deleteResultRes = await reportsModel.deleteResultsData(transact);
			console.log(deleteResultRes, '==deleteResultRes==');

			await transact.commit();
		} catch (error) {
			await transact.rollback();
			next(error);
		}
	},
};

export default reportsController;
