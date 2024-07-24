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
		console.log(!ip, '==ip==');
		if (!ip) throw new ApiError(404, 'Invalid IP address');
		let [_updateRes] = await studentAreaModel.addFormFillingIP(ip);
		console.log(_updateRes, '==_updateRes==');
		if ([_updateRes] == 1) {
			return res.status(201).json(new ApiResponse(201, ip));
		}
	}),
};
export default StudentAreaController;
