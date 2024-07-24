import studentAreaModel from '../../model/studentAreaModel.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const StudentAreaController = {
	getServerIP: asyncHandler(async (req, res) => {
		let _serverIP = await studentAreaModel.getServerIP();
		return res.status(200).json(new ApiResponse(201, _serverIP[0].a_form_filling_ip));
	}),
	saveFormFillingIP: asyncHandler(async (req, res) => {
		let { ip } = req.body;
		if (!ip) throw new ApiError(404, 'Invalid IP address');
		let [_updateRes] = await studentAreaModel.addFormFillingIP(ip);
		if ([_updateRes] == 1) {
			return res.status(201).json(new ApiResponse(201, ip));
		}
	}),

	getAllStudentsList_1: asyncHandler(async (req, res) => {
		let { ip } = req.body;
		if (!ip) throw new ApiError(404, 'Invalid IP address');

		let _res = await fetch(`${ip}/master/students-data/data-download`);
		if (!_res.ok) throw new ApiError(404, 'Unable to get students data');

		let { data } = await _res.json();

		let _studSaveRes = await studentAreaModel.saveAllStudentsList(data);

		return res.status(200).json(new ApiResponse(200, '', 'Students list'));
	}),

	getAllStudentsList_2: asyncHandler(async (req, res) => {
		let _studListAll = await studentAreaModel.getAllStudentsList_2();

		return res.status(200).json(new ApiResponse(200, _studListAll, 'Students list'));
	}),
};
export default StudentAreaController;
