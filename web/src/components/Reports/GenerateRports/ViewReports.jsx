import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import { singleCandiatePaper } from './gen-reports-api.jsx';

function ViewReports() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { viewTestReportDetails, resultsList, testDetails, singleStudentViewReport } = useSelector((state) => state.reports);

	useEffect(() => {
		if (viewTestReportDetails.length == 0) {
			navigate('/gen-reports');
		}
	}, [viewTestReportDetails]);

	const columns = [
		{ sortable: true, name: '#', cell: (row, idx) => <p>{idx + 1}</p>, width: '6%' },
		{ sortable: true, name: 'Student name', selector: (row) => row['tn_student_list.full_name'], width: '20%' },
		{ sortable: true, name: 'Roll No', selector: (row) => row.sfrs_student_roll_no },
		{ sortable: true, name: 'Unattempted', selector: (row) => row.sfrs_unattempted },
		{ sortable: true, name: 'Attempt', selector: (row) => testDetails.mt_passing_out_of },
		{ sortable: true, name: 'Wrong', selector: (row) => row.sfrs_wrong },
		{ sortable: true, name: 'Correct', selector: (row) => row.sfrs_correct },
		{ sortable: true, name: 'Marks Score', selector: (row) => row.sfrs_marks_gain + '/' + row.sfrc_total_marks },
		{ sortable: true, name: 'Percentage Got', selector: (row) => ((row.sfrs_marks_gain / row.sfrc_total_marks) * 100).toFixed(2) + '%' },
		{
			sortable: true,
			name: 'Result',
			cell: (row) =>
				+row.sfrs_marks_gain >= +testDetails.mt_passing_out_of ? (
					<span className="bg-green-400 px-2 py-1  text-white font-semibold tracking-widest">PASS</span>
				) : (
					<span className="bg-red-400 px-2 py-1 text-white font-semibold tracking-widest">FAIL</span>
				),
		},
		{
			sortable: true,
			name: 'Action',
			cell: (row) => (
				<CButton className="text-xs" onClick={handleCandidateViewReport.bind(null, row)} isLoading={candidateReportViewLoading}>
					View Report
				</CButton>
			),
		},
	];

	const { mutate: _singleCandidatePaper, isPending: candidateReportViewLoading } = useMutation({
		mutationFn: singleCandiatePaper,
		onSuccess: (data) => {
			console.log(data, '==data22==');
			dispatch(reportsAction.setSingleStudentViewReport(data.data));
		},
		onError: (err) => {
			console.log(err, '==err==');
			alert(err.message);
		},
	});

	useEffect(() => {
		if (singleStudentViewReport?.quePaper?.length >= 1 && singleStudentViewReport?.studExam) {
			navigate('/single-student-report');
		}
	}, [singleStudentViewReport]);

	const handleCandidateViewReport = async (data) => {
		await _singleCandidatePaper({ studentRollNumber: data.sfrs_student_id, publishedTestId: testDetails.id });
	};

	return (
		<>
			<div className="flex gap-3 justify-center py-4">
				<div className="text-xs border p-1">
					Total Questions: <span className="font-semibold"> {testDetails.test_total_question} </span>
				</div>
				<div className="text-xs border p-1">
					Duration : <span className="font-semibold"> {testDetails.test_duration} Min </span>
				</div>
				<div className="text-xs border p-1">
					Marks per question : <span className="font-semibold"> {testDetails.mt_mark_per_question} M </span>
				</div>
				<div className="text-xs border p-1">
					Test Marks : <span className="font-semibold"> {testDetails.mt_total_marks} M </span>
				</div>
				<div className="text-xs border p-1">
					Passing Marks : <span className="font-semibold"> {testDetails.mt_passing_out_of} M </span>
				</div>
				<div className="text-xs border p-1">
					Negative Marking: <span className="font-semibold"> {testDetails.test_negative} M </span>
				</div>

				<div className="text-xs border p-1">
					Total candidates: <span className="font-semibold"> {resultsList.length} </span>
				</div>
			</div>

			<p className="text-red-500 text-sm pb-3">Note: The negative marking is only calculated for wrong answered questions.</p>
			<DataTable columns={columns} data={resultsList} pagination highlightOnHover />
		</>
	);
}

export default ViewReports;
