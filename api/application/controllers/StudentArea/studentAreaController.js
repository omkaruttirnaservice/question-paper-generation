import Joi from 'joi';
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

		if (_serverIP.length > 0) {
			return res.status(200).json(new ApiResponse(200, _serverIP));
		}
		return res.status(404).json(new ApiResponse(404, [], 'No ip found.'));
	}),

	saveFormFillingIP: asyncHandler(async (req, res) => {
		let { form_filling_server_ip, exam_panel_server_ip } = req.body;

		if (!form_filling_server_ip)
			throw new ApiError(404, 'Invalid IP address form filling.');
		if (!exam_panel_server_ip)
			throw new ApiError(404, 'Invalid IP address exam server.');

		await studentAreaModel.addFormFillingIP({
			form_filling_server_ip,
			exam_panel_server_ip,
		});
		return res
			.status(201)
			.json(new ApiResponse(201, null, 'Successfully added new ip.'));
	}),

	updateFormFillingIP: asyncHandler(async (req, res) => {
		let { form_filling_server_ip, exam_panel_server_ip, id } = req.body;

		if (!form_filling_server_ip)
			throw new ApiError(404, 'Invalid IP address form filling.');
		if (!exam_panel_server_ip)
			throw new ApiError(404, 'Invalid IP address exam server.');
		if (!id) throw new ApiError(404, 'Invalid edit ID');

		await studentAreaModel.updateFormFillingIP(
			{ form_filling_server_ip, exam_panel_server_ip },
			id
		);

		return res
			.status(201)
			.json(new ApiResponse(201, null, 'Successfully updated new ip.'));
	}),

	deleteFormFillingIP: asyncHandler(async (req, res) => {
		let { id } = req.params;
		if (!id) throw new ApiError(400, 'Invalid delete id.');
		const _deleteResponse = await studentAreaModel.deleteFormFillingIP(id);
		console.log(_deleteResponse, '_deleteResponse');
		return res
			.status(200)
			.json(new ApiResponse(200, null, 'Successfully deleted IP.'));
	}),

	getAllStudentsList_1: async (req, res, next) => {
		let transact = await sequelize.transaction();
		try {
			let { ip } = req.body;

			console.log(ip, '==ip==');
			if (!ip) throw new ApiError(404, 'Invalid IP address');

			// let _res = await fetch(`${ip}/master/students-data/data-download`);
			// if (!_res.ok) throw new ApiError(404, 'Unable to get students data');

			// let { data } = await _res.json();

			const [error, data] =
				await StudentAreaController.downloadStudentsFromFormFilling(ip);
			console.log(data, '==data==');
			if (error) {
				throw new ApiError(400, error);
			}
			if (data.length === 0) {
				throw new ApiError(400, 'Students list empty.');
			}

			let _studSaveRes = await studentAreaModel.saveAllStudentsList(
				data,
				transact
			);
			console.log(_studSaveRes, '==_studSaveRes==');

			// get students images and sign
			console.log(
				'==------------------------------------------------------------------==='
			);
			// let _response = await fetch(
			// 	`${ip}/master/students-data/download-photo-sign`
			// );
			// console.log(_response, '==_response.ok==');

			// if (!_response.ok)
			// 	throw new ApiError(
			// 		500,
			// 		'Something went wrong while downloading photos/sign'
			// 	);

			// const chunks = [];

			// const headers = await _response.headers;
			// let contentLength = headers.get('Content-Length');
			// let fileName = headers.get('x-file-name');
			// let downloadedContent = 0;
			// let downloadPercentage = 0;

			// let reader = _response.body.getReader();
			// while (true) {
			// 	const { done, value } = await reader.read();
			// 	if (done) break;

			// 	chunks.push(value);
			// 	downloadedContent += value.byteLength;
			// 	downloadPercentage = (
			// 		(downloadedContent / contentLength) *
			// 		100
			// 	).toFixed(1);
			// 	console.log(downloadPercentage, '==downloadPercentage==');
			// }

			// let blob = new Blob(chunks, { type: 'application/pdf' });
			// let buff = Buffer.from(await blob.arrayBuffer());

			// if (!fs.existsSync(DIR.TEMP_DIR)) {
			// 	fs.mkdirSync(DIR.TEMP_DIR, { recursive: true });
			// }

			// fs.writeFileSync(
			// 	path.resolve(DIR.TEMP_DIR, `${fileName}`),
			// 	buff,
			// 	'binary'
			// );

			// if (!fs.existsSync(DIR.PICS_DIR)) {
			// 	fs.mkdirSync(DIR.PICS_DIR, { recursive: true });
			// }

			// await extractZip(path.resolve(DIR.TEMP_DIR, fileName), {
			// 	dir: DIR.PICS_DIR,
			// });

			// fs.unlinkSync(DIR.TEMP_DIR + '/' + fileName);

			await transact.commit();
			console.log(1, '==1==');
			return res.status(200).json(new ApiResponse(200, '', 'Students list'));
		} catch (error) {
			console.log(error, '==error=================================');
			await transact.rollback();
			next(error);
		}
	},

	downloadStudentsFromFormFilling: async (ip) => {
		try {
			let _res = await fetch(`${ip}/api/student-data/data-download`);
			if (!_res.ok) throw new ApiError(404, 'Unable to get students data');

			let { data } = await _res.json();
			// console.log(data, '==data==');
			return [null, data];
		} catch (error) {
			if (error.type == 'fetch failed') {
				return ['fetch failed', null];
			} else {
				return [
					error?.message ||
						'Server error when downloading data from form filling server.',
					null,
				];
			}
		}
	},

	getAllStudentsList_2: asyncHandler(async (req, res) => {
		/**
		 * getting students list from local database (i.e. downlaoded db)
		 * */
		let _studListAll = await studentAreaModel.getAllStudentsList_2();
		console.log(_studListAll, '==_studListAll==');

		return res
			.status(200)
			.json(new ApiResponse(200, _studListAll, 'Students list'));
	}),

	getStudentsListByFilter: asyncHandler(async (req, res) => {
		const schema = Joi.object({
			centerNumber: Joi.number().required(),
			batchNumber: Joi.number().required(),
			date: Joi.date(),
		});
		let { centerNumber, batchNumber, postName, date } = req.body;
		let { value, error } = await schema.validate(
			{ centerNumber, batchNumber, date },
			{ abortEarly: false }
		);
		console.log(error, '==_isValid==');

		if (error) {
			throw new ApiError(400, 'Invalid data', error.details);
		}

		let _res = await studentAreaModel.getStudentsListByFilter(req.body);
		return res.status(200).json(new ApiResponse(200, _res, 'Students list'));

		// {
		//     "centerNumber": "101",
		//     "batchNumber": "3",
		//     "date": "26-7-2024"
		// }
	}),

	// get centers list
	downloadCentersList: asyncHandler(async (req, res) => {
		let { ip } = req.body;
		if (!ip) throw new ApiError(400, 'Invalid IP address');
		console.log(ip, '==ip==');

		/**
		 * this fetchtes college list from form filling server.
		 * */

		// let _centersListRes = await fetch(
		// 	`${ip}/master/students-data/download-centers-list`
		// );

		// const _centersListResJson = await _centersListRes.json();
		// console.log(_centersListResJson, '==_centersListResJson==');
		const [error, data] =
			await StudentAreaController.downloadCenterListFromFormFilling(ip);
		console.log(error, '==error==');
		if (error) {
			throw new ApiError(400, error);
		}
		if (data.length === 0) {
			throw new ApiError(400, 'No center / college list found.');
		}
		let centersListToSave = [];
		data.forEach((el) => {
			centersListToSave.push({
				cl_number: el.c_collageCode,
				cl_name: el.c_collageName,
				cl_address: el.c_collageAddress,
				cl_user_name: 'utr',
				cl_password: 'utr',
				cl_server_number: null, // TODO (Omkar): find What is this value?
			});
		});

		// before saving centers list delete old list
		await studentAreaModel.deleteCentersListOld();

		let [_saveCenterListRes] = await studentAreaModel.saveCentersList(
			centersListToSave
		);

		console.log(_saveCenterListRes, '==_saveCenterListRes==');
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					_saveCenterListRes.toJSON(),
					'Centers list downloaded successfully'
				)
			);
	}),

	downloadCenterListFromFormFilling: async (ip) => {
		try {
			let _centersListRes = await fetch(
				`${ip}/api/student-data/download-centers-list`
			);

			const _centersListResJson = await _centersListRes.json();
			console.log(_centersListResJson, '==_centersListResJson==');
			return [null, _centersListResJson?.data || []];
		} catch (error) {
			if (error.type == 'fetch failed') {
				return ['fetch failed', null];
			} else {
				return [
					error?.message ||
						'Form filling server error while downloading centers list.',
				];
			}
		}
	},

	getCenterAndBatchList: asyncHandler(async (req, res) => {
		let _centersList = await studentAreaModel.getCentersList();
		let _batchList = await studentAreaModel.getBatchList();
		// let _postsList = await studentAreaModel.getPostsList();
		let resData = { _centersList, _batchList };
		console.log(resData, '==resData==');
		return res
			.status(200)
			.json(new ApiResponse(200, resData, 'Centers list and batch list'));
	}),

	// download students question paper from exam panel
	downloadStudentQuestionPaper: asyncHandler(async (req, res) => {
		const { exam_panel_server_ip } = req.body;
		console.log(exam_panel_server_ip, '==exam_server_ip==');
		if (!exam_panel_server_ip)
			throw new ApiError(400, 'Please provide exam server ip.');

		const [error, data] =
			await StudentAreaController.getQuestionPaperFromExamServer(
				exam_panel_server_ip
			);
		if (error) {
			throw new ApiError(400, error);
		}
		if (data.length == 0) {
			throw new ApiError(400, 'No student question paper found.');
		}

		const [_saveStudentQuestionPaperError, _saveStudentQuestionPaperResponse] =
			await studentAreaModel.saveStudentQuestionPaper(data);

		if (_saveStudentQuestionPaperError) {
			throw new ApiError(400, 'Failed to insert student question paper.');
		}

		console.log(
			_saveStudentQuestionPaperError,
			'==_saveStudentQuestionPaperResponse=='
		);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					null,
					'Successfully downlaoded student question paper.'
				)
			);
	}),

	async getQuestionPaperFromExamServer(exam_panel_server_ip) {
		if (!exam_panel_server_ip) return ['Please provide exam panel IP.', null];
		try {
			let _studentQuestionPaperResponse = await fetch(
				`${exam_panel_server_ip}/api/student/question-paper`
			);

			const _studentQuestionPaperResponseJson =
				await _studentQuestionPaperResponse.json();
			return [null, _studentQuestionPaperResponseJson?.data || []];
		} catch (error) {
			if (error.type == 'fetch failed') {
				return ['fetch failed', null];
			} else {
				return [
					error?.message ||
						'Form filling server error while downloading centers list.',
				];
			}
		}
	},
};

export default StudentAreaController;
