import extractZip from 'extract-zip';
import fs from 'fs';
import path from 'path';
import sequelize from '../../config/db-connect-migration.js';
import studentAreaModel from '../../model/studentAreaModel.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { DIR } from '../../utils/directories.js';

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

	getAllStudentsList_1: async (req, res, next) => {
		let transact = await sequelize.transaction();
		try {
			let { ip } = req.body;

			if (!ip) throw new ApiError(404, 'Invalid IP address');

			let _res = await fetch(`${ip}/master/students-data/data-download`);
			if (!_res.ok) throw new ApiError(404, 'Unable to get students data');

			let { data } = await _res.json();

			let _studSaveRes = await studentAreaModel.saveAllStudentsList(data, transact);
			console.log(_studSaveRes, '==_studSaveRes==');

			// get students images and sign
			console.log('==------------------------------------------------------------------===');
			let _response = await fetch(`${ip}/master/students-data/download-photo-sign`);
			console.log(_response, '==_response.ok==');

			if (!_response.ok) throw new ApiError(500, 'Something went wrong while downloading photos/sign');

			const chunks = [];

			const headers = await _response.headers;
			let contentLength = headers.get('Content-Length');
			let fileName = headers.get('x-file-name');
			let downloadedContent = 0;
			let downloadPercentage = 0;

			let reader = _response.body.getReader();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				chunks.push(value);
				downloadedContent += value.byteLength;
				downloadPercentage = ((downloadedContent / contentLength) * 100).toFixed(1);
				console.log(downloadPercentage, '==downloadPercentage==');
			}

			let blob = new Blob(chunks, { type: 'application/pdf' });
			let buff = Buffer.from(await blob.arrayBuffer());

			if (!fs.existsSync(DIR.TEMP_DIR)) {
				fs.mkdirSync(DIR.TEMP_DIR, { recursive: true });
			}

			fs.writeFileSync(path.resolve(DIR.TEMP_DIR, `${fileName}`), buff, 'binary');

			if (!fs.existsSync(DIR.PICS_DIR)) {
				fs.mkdirSync(DIR.PICS_DIR, { recursive: true });
			}

			await extractZip(path.resolve(DIR.TEMP_DIR, fileName), {
				dir: DIR.PICS_DIR,
			});

			fs.unlinkSync(DIR.TEMP_DIR + '/' + fileName);

			await transact.commit();
			return res.status(200).json(new ApiResponse(200, '', 'Students list'));
		} catch (error) {
			console.log(error, '==error=================================');
			await transact.rollback();
			next(error);
		}
	},

	getAllStudentsList_2: asyncHandler(async (req, res) => {
		let _studListAll = await studentAreaModel.getAllStudentsList_2();

		return res.status(200).json(new ApiResponse(200, _studListAll, 'Students list'));
	}),
};
export default StudentAreaController;
