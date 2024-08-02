import reportsModel from '../../model/reportsModel.js';
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
};

export default reportsController;
