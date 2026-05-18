import excel from 'exceljs';
import { Worker } from 'worker_threads';
import db from '../../config/db.connect.js';
import reportsModel, { DATES_LIST, POST_LIST } from '../../model/reportsModel.js';
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
        const { type = 'ALL' } = req.query;
        let _tests = await reportsModel.getPublishedTests(type);
        return res.status(200).json(new ApiResponse(200, _tests));
    }),

    generateResult: async (req, res, next) => {
        const transact = await db.transaction();
        try {
            console.log(req.body, '==req.body==');
            let { b64PublishedTestId } = req.body;
            let publishedTestId = atob(b64PublishedTestId);

            // generate student result
            let [_resultGeneratedRes] = await reportsModel.generateResult(
                publishedTestId,
                transact,
            );
            console.log(_resultGeneratedRes, '==_resultGeneratedRes==');
            if (_resultGeneratedRes.length == 0)
                throw new ApiError(404, 'Could not find the students to generate result');

            // update that result has been declared
            let _updateResultDeclaredRes = await db.tm_publish_test_list.update(
                {
                    is_test_generated: 1,
                },
                {
                    where: {
                        id: publishedTestId,
                    },
                    transaction: transact,
                },
            );

            console.log(_resultGeneratedRes, '==_resultGeneratedRes==');
            // save result to tm_student_final_result_set
            let [_saveResultRes] = await db.tm_student_final_result_set.bulkCreate(
                _resultGeneratedRes,
                { transaction: transact },
            );

            console.log(_saveResultRes, '==_saveResultRes==');

            await transact.commit();

            const _studentsList = await db.tm_student_final_result_set.findAll({
                attributes: ['sfrs_student_id', 'srfs_percentile'],
                where: {
                    sfrs_publish_id: publishedTestId,
                },
                order: [['sfrs_marks_gain', 'DESC']],
                raw: true,
            });

            console.log(_studentsList, '==_studentsList==');
            if (_studentsList.length === 0) {
                throw new ApiError(404, 'No students found for this test');
            }

            // calculate percentile result
            const totalStudents = _studentsList.length;

            _studentsList.forEach((_student, idx) => {
                const rank = idx + 1;

                let percentile = ((totalStudents - rank) / (totalStudents - 1)) * 100;
                console.log(_student, '==_student==');
                console.log(percentile, '==percentile==');
                _student['srfs_percentile'] = percentile.toFixed(2);
            });

            // update percentile result
            const _updateResponse = await reportsModel.updatePercentileResult(_studentsList);

            // delete result data
            let deleteResultRes = await reportsModel.deleteResultsData();
            console.log(deleteResultRes, '==deleteResultRes==');

            return res.status(201).json(new ApiResponse(201, {}, 'Successfully generated result'));
        } catch (error) {
            await transact.rollback();
            next(error);
        }
    },

    getExamDatesList: asyncHandler(async (_, res) => {
        const [_examDates] = await reportsModel.getReportForType(DATES_LIST);
        console.log(_examDates, '==_examDates==');

        if (_examDates.length === 0) {
            throw new ApiError(400, 'Batches list not found.');
        }
        return res
            .status(200)
            .json(new ApiResponse(200, _examDates, 'Successfully fetched batches list'));
    }),

    getResultBatchesList: asyncHandler(async (_, res) => {
        const [_batchesList] = await reportsModel.getReportForType(POST_LIST);
        console.log(_batchesList, '==_batchesList==');
        if (_batchesList.length === 0) {
            throw new ApiError(400, 'Batches list not found.');
        }
        return res
            .status(200)
            .json(new ApiResponse(200, _batchesList, 'Successfully fetched batches list'));
    }),

    getResultViewData: asyncHandler(async (req, res) => {
        let data = req.body;
        // Sample req.body { viewResultBy: 'Post', postName: 'वाहन चालक', page: 1, limit: 10 }

        data.page = data?.page || 1;
        data.limit = data?.limit || 10;
        data.offset = (data.page - 1) * data.limit;
        data.type = 'REPORT';

        const [_resultDetailsRes] = await reportsModel.getResultData(data);

        if (_resultDetailsRes.length === 0) {
            throw new ApiError(400, 'No students found.');
        }

        return res.status(200).json(new ApiResponse(200, _resultDetailsRes, 'Result details list'));
    }),

    getResultExcel: asyncHandler(async (req, res) => {
        const { testId } = req.body;
        if (!testId) throw new ApiError(400, 'Invalid test ID');

        let [_testDetails] = await reportsModel.getTestDetails(atob(testId));

        console.log({ _testDetails });

        if (!_testDetails || _testDetails.length == 0)
            throw new ApiError(404, 'No test details found');

        let [_testReportsForExcel] = await reportsModel.getTestReportsForExcel(atob(testId));

        if (!_testReportsForExcel || _testReportsForExcel.length == 0)
            throw new ApiError(404, 'No student found for this test');

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
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'valid-candidate-list.xlsx');
        return workbook.xlsx.write(res);

        // // return res.status(200).json({ _testReportsForExcel });

        // console.log(_testDetails, _testReportsForExcel, '==_testDetails, _testReportsForExcel==');
    }),

    getCustomResultExcel: asyncHandler(async (req, res) => {
        const data = req.body;
        console.log(data, 'data');
        data.type = 'EXCEL';

        const [_resultDetailsRes] = await reportsModel.getResultData(data);

        if (_resultDetailsRes.length === 0) {
            throw new ApiError(400, 'No students list found.');
        }

        // prettier-ignore

        let file_name = `${data?.postName || ''}_result`;
        file_name = file_name.replace(/[ _-\s]/, '_');

        const worker = new Worker(
            './application/controllers/ReportsControllers/customExcelReportWorker.js',
            {
                workerData: {
                    _resultDetailsRes,
                    resultType: data.resultType,
                },
            },
        );

        worker.on('message', (data) => {
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );

            res.setHeader('Access-Control-Expose-Headers', 'x-file-name');
            res.setHeader('x-file-name', `${encodeURIComponent(file_name)}.xlsx`);
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + `${encodeURIComponent(file_name)}.xlsx`,
            );

            res.end(data);
        });

        // return workbook.xlsx.write(res);
    }),

    getActivityLogs: asyncHandler(async (req, res) => {
        const filters = {
            searchBy: req.query.searchBy, // 'roll_no' or 'name'
            searchValue: req.query.searchValue,
            batch: req.query.batch,
            exam_name: req.query.exam_name,
            date: req.query.date
        };

        const [_logs] = await reportsModel.getStudentActivityLogs(filters);

        return res.status(200).json(new ApiResponse(200, _logs, 'Successfully fetched activity logs'));
    }),

    getActivityLogsFilters: asyncHandler(async (req, res) => {
        const filtersData = await reportsModel.getActivityLogFilters();
        return res.status(200).json(new ApiResponse(200, filtersData, 'Successfully fetched filters'));
    }),
};

export default reportsController;
