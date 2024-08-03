import React from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';

function ViewReports() {
	const { viewTestReportDetails, resultsList } = useSelector((state) => state.reports);
	let [testDetails] = JSON.parse(viewTestReportDetails.ptl_test_info);
	console.log(testDetails, '==testDetails==');

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
		{ sortable: true, name: 'Result', selector: (row) => (row.sfrs_marks_gain >= testDetails.mt_passing_out_of ? 'PASS' : 'FAIL') },
	];

	return (
		<div>
			<div className="flex gap-3 justify-center py-4">
				<div className="text-xs">
					Total Questions: <span className="font-semibold"> {testDetails.test_total_question} </span>
				</div>
				<div className="text-xs">
					Duration : <span className="font-semibold"> {testDetails.test_duration} Min </span>
				</div>
				<div className="text-xs">
					Marks per question : <span className="font-semibold"> {testDetails.mt_mark_per_question} M </span>
				</div>
				<div className="text-xs">
					Test Marks : <span className="font-semibold"> {testDetails.mt_total_marks} M </span>
				</div>
				<div className="text-xs">
					Passing Marks : <span className="font-semibold"> {testDetails.mt_passing_out_of} M </span>
				</div>
				<div className="text-xs">
					Negative Marking: <span className="font-semibold"> {testDetails.test_negative} M </span>
				</div>

				<div className="text-xs">
					Total candidates: <span className="font-semibold"> {resultsList.length} </span>
				</div>
			</div>

			<p className="text-red-500 text-sm pb-3">Note: The negative marking is only calculated for wrong answered questions.</p>
			<DataTable columns={columns} data={resultsList} pagination highlightOnHover />
		</div>
	);
}

export default ViewReports;
