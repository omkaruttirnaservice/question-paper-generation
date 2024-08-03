import excel from 'exceljs';
import { Sequelize } from 'sequelize';
import sequelize from '../../config/db-connect-migration.js';
import reportsModel from '../../model/reportsModel.js';
import tm_publish_test_list from '../../schemas/tm_publish_test_list.js';
import tm_student_final_result_set from '../../schemas/tm_student_final_result_set.js';
import tn_student_list from '../../schemas/tn_student_list.js';
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
			return res.status(201).json(new ApiResponse(201, {}, 'Successfully generated result'));
		} catch (error) {
			await transact.rollback();
			next(error);
		}
	},

	getResultViewData: asyncHandler(async (req, res) => {
		let { testId } = req.body;
		if (!testId) throw new ApiError(400, 'Invalid test ID');

		let _resultDetilsRes = await tm_student_final_result_set.findAll({
			include: [
				{
					model: tn_student_list,
					as: 'tn_student_list',
					attributes: [
						[Sequelize.fn('CONCAT', Sequelize.col('sl_f_name'), ' ', Sequelize.col('sl_m_name'), ' ', Sequelize.col('sl_l_name')), 'full_name'],
					],
					required: true,
				},
			],
			where: {
				sfrs_publish_id: testId,
			},
			raw: true,
		});
		console.log(_resultDetilsRes, '====');

		return res.status(200).json(new ApiResponse(200, _resultDetilsRes, 'Result details list'));
	}),

	getResultExcel: asyncHandler(async (req, res) => {
		const { testId } = req.body;
		if (!testId) throw new ApiError(400, 'Invalid test ID');

		let [_testDetails] = await reportsModel.getTestDetails(atob(testId));

		if (!_testDetails || _testDetails.length == 0) throw new ApiError(404, 'No test details found');

		let [_testReportsForExcel] = await reportsModel.getTestReportsForExcel(atob(testId));

		if (!_testReportsForExcel || _testReportsForExcel.length == 0) throw new ApiError(404, 'No student found for this test');

		console.log(_testReportsForExcel, '==_testReportsForExcel==');

		let _excelData = _testReportsForExcel.map((el, idx) => {
			return [
				idx + 1,
				el.roll_number,
				el.student_application_no,
				el.student_post,
				el.f_name,
				el.m_name,
				el.l_name,
				el.dob,
				el.mobile_number,
				el.student_image,
				parseInt(el.correct) + parseInt(el.wrong),
				el.unattempted,
				el.correct,
				el.correct_score,
			];
		});

		// ['Sr Number,Roll No,Form No,	Post, CName,CMiddel,CLast,Date Of Birth,Mobile,	Photo,Attempted,Uttempted,Correct,Total Marks Gain'],

		let file_name = `${_testDetails[0].post_name}${_testDetails[0].test_name}${_testDetails[0].test_date}_Result`;

		file_name = file_name.replace(/[ _-\s]/, '_');

		// [
		//   {
		//     post_name: 'All',
		//     test_name: 'Omkar DEMO 1',
		//     test_date: '2024-08-02'
		//   }
		// ]

		let workbook = new excel.Workbook();
		let workSheet = workbook.addWorksheet('Sheet_1');
		let e1 = workSheet.getCell('E1');
		let e2 = workSheet.getCell('E2');
		let e3 = workSheet.getCell('E3');
		let e4 = workSheet.getCell('E4');
		e1.value = `Test Name:- ${_testDetails[0].test_name} `;
		e2.value = `Test Date:- ${_testDetails[0].test_date} `;
		e3.value = `Total Students:- ${_testReportsForExcel.length} `;
		e4.value = `Test for post:- ${_testDetails[0].post_name} `;

		// // workSheet.columns = [
		// // 	{ header: 'Sr Number', width: 10 },
		// // 	{ header: 'Roll No', width: 10 },
		// // 	{ header: 'Form No', width: 10 },
		// // 	{ header: 'Form No', width: 10 },
		// // ];

		// const b7 = workSheet.getCell('B7');
		// const c7 = workSheet.getCell('C7');
		// const d7 = workSheet.getCell('D7');
		// const e7 = workSheet.getCell('E7');
		// b7.value = 'Sr number';
		// c7.value = 'Roll No';
		// d7.value = 'Form no';
		// e7.value = 'Post';

		workSheet.insertRow(7, [
			'Sr Number',
			'Roll No',
			'Form No',
			'Post',
			'CName',
			'CMiddel',
			'CLast',
			'Date Of Birth',
			'Mobile',
			'Photo',
			'Attempted',
			'Uttempted',
			'Correct',
			'Total Marks Gain',
		]);

		const insertedRow = workSheet.insertRows(8, _excelData);

		// workSheet.addRows(res_data);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'valid-candidate-list.xlsx');
		return workbook.xlsx.write(res);

		// // return res.status(200).json({ _testReportsForExcel });

		// console.log(_testDetails, _testReportsForExcel, '==_testDetails, _testReportsForExcel==');
	}),
};

export default reportsController;
