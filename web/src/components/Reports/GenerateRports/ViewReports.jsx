import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import {
	getCustomResultExcel,
	getExamDates,
	getResultBatchesList,
	getResultViewData,
	singleCandiatePaper,
} from './gen-reports-api.jsx';
import { InputSelect } from '../../UI/Input.jsx';

const RESULT_BY_BATCH = 'Batch';
const RESULT_BY_POST = 'Post';

function ViewReports() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { testDetails, singleStudentViewReport } = useSelector(
		(state) => state.reports
	);

	const [viewResultBy, setViewResultBy] = useState(RESULT_BY_POST);
	const [resultData, setResultData] = useState([]);
	const [postsList, setPostList] = useState([]);
	const [selectedPost, setSelectedPost] = useState('');

	const [examDates, setExamDates] = useState([]);
	const [selectedExamDate, setSelectedExamDate] = useState('');

	const _getExamDatesList = useQuery({
		queryKey: ['get exam dates'],
		queryFn: () => getExamDates(),

		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: false,
	});

	const _getResultBatchesList = useQuery({
		queryKey: ['get result batches list'],
		queryFn: () => getResultBatchesList(),

		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: false,
	});

	useEffect(() => {
		if (viewResultBy === RESULT_BY_POST) {
			_getResultBatchesList.refetch();
		}
		if (viewResultBy === RESULT_BY_BATCH) {
			_getExamDatesList.refetch();
		}
	}, [viewResultBy]);

	useEffect(() => {
		if (_getResultBatchesList?.data) {
			console.log(1, '==1==');
			setPostList(_getResultBatchesList.data.data);
		}
		if (_getExamDatesList?.data) {
			console.log(2, '==2==');
			console.log(_getExamDatesList.data.data, '==_getExamDatesList.data==');
			setExamDates(_getExamDatesList.data.data);
		}
	}, [_getResultBatchesList, _getExamDatesList]);

	const columns = [
		{
			sortable: true,
			name: '#',
			cell: (row, idx) => <p>{idx + 1}</p>,
			width: '6%',
		},
		{
			sortable: true,
			name: 'Student name',
			selector: (row) => row['full_name'],
			width: '20%',
		},
		{
			sortable: true,
			name: 'Roll No',
			selector: (row) => row.sfrs_student_roll_no,
		},
		{
			sortable: true,
			name: 'Unattempted',
			selector: (row) => row.sfrs_unattempted,
		},
		{
			sortable: true,
			name: 'Attempt',
			selector: (row) => testDetails?.mt_passing_out_of || '-',
		},
		{ sortable: true, name: 'Wrong', selector: (row) => row.sfrs_wrong },
		{ sortable: true, name: 'Correct', selector: (row) => row.sfrs_correct },
		{
			sortable: true,
			name: 'Marks Score',
			selector: (row) => row.sfrs_marks_gain + '/' + row.sfrc_total_marks,
		},
		{
			sortable: true,
			name: '% Got',
			selector: (row) =>
				((row.sfrs_marks_gain / row.sfrc_total_marks) * 100).toFixed(2) + '%',
		},
		{
			sortable: true,
			name: 'Result',
			cell: (row) =>
				+row.sfrs_marks_gain >= +testDetails.mt_passing_out_of ? (
					<span className="bg-green-400 px-2 py-1  text-white font-semibold tracking-widest">
						PASS
					</span>
				) : (
					<span className="bg-red-400 px-2 py-1 text-white font-semibold tracking-widest">
						FAIL
					</span>
				),
		},
		{
			sortable: true,
			name: 'Action',
			cell: (row) => (
				<CButton
					className="text-xs"
					onClick={handleCandidateViewReport.bind(null, row)}
					isLoading={candidateReportViewLoading}
				>
					View Report
				</CButton>
			),
		},
	];

	const {
		mutate: _singleCandidatePaper,
		isPending: candidateReportViewLoading,
	} = useMutation({
		mutationFn: (data) => singleCandiatePaper(data),
		onSuccess: (data) => {
			console.log(data, '==data22==');
			toast.success(data?.message || 'Successful.');

			dispatch(reportsAction.setSingleStudentViewReport(data.data));
		},
		onError: (err) => {
			console.log(err, '==err==');
			toast.error(err?.message || 'Server error');
		},
	});

	useEffect(() => {
		if (
			singleStudentViewReport?.quePaper?.length >= 1 &&
			singleStudentViewReport?.studExam
		) {
			navigate('/single-student-report');
		}
	}, [singleStudentViewReport]);

	const handleCandidateViewReport = async (data) => {
		_singleCandidatePaper({
			studentRollNumber: data.sfrs_student_id,
			publishedTestId: data.sfrs_publish_id,
		});
	};

	const handleResultViewType = (e) => {
		setViewResultBy(e.target.value);
	};

	const _getResultViewDataMutation = useMutation({
		mutationFn: (type) => {
			return getResultViewData(type);
		},
		onSuccess: (data) => {
			toast.success(data?.message || 'Successful.');
			setResultData(data.data);
		},
		onError: (error) => {
			console.log(error, '==error==');
			toast.error(error?.message || 'Server error');
		},
	});

	const handleGetResultData = () => {
		const _data = {};
		if (viewResultBy === RESULT_BY_POST) {
			_data.viewResultBy = RESULT_BY_POST;
			_data.postName = selectedPost;
		}

		if (viewResultBy === RESULT_BY_BATCH) {
			_data.viewResultBy = RESULT_BY_BATCH;
			_data.postName = selectedPost;
			_data.examDate = selectedExamDate;
		}

		_getResultViewDataMutation.mutate(_data);
	};

	const handlePostChange = (e) => setSelectedPost(e.target.value);
	const handleDateChange = (e) => setSelectedExamDate(e.target.value);

	const _getResultExel = useMutation({
		mutationFn: (data) => {
			return getCustomResultExcel(data);
		},
		onSuccess: (data) => {
			console.log(data, '==data==');
			toast.success('Successfully downloaded result excel.');
		},
		onError: (error) => {
			console.log(error.message, '==error==');
			toast.error(error?.message || 'Server error');
		},
	});

	const handleGetExcelBtn = () => {
		const _data = {};
		if (viewResultBy === RESULT_BY_POST) {
			_data.viewResultBy = RESULT_BY_POST;
			_data.postName = selectedPost;
		}

		if (viewResultBy === RESULT_BY_BATCH) {
			_data.viewResultBy = RESULT_BY_BATCH;
			_data.postName = selectedPost;
			_data.examDate = selectedExamDate;
		}
		_getResultExel.mutate(_data);
	};

	return (
		<>
			<section className="grid grid-cols-4 mt-6 mb-2 gap-2">
				<div>
					<InputSelect
						label="View Result By"
						className={'w-full'}
						value={viewResultBy}
						onChange={handleResultViewType}
					>
						<option value={RESULT_BY_BATCH}>{RESULT_BY_BATCH}</option>
						<option value={RESULT_BY_POST}>{RESULT_BY_POST}</option>
					</InputSelect>
				</div>

				{viewResultBy === RESULT_BY_BATCH && (
					<div>
						<InputSelect
							label="Exam Dates"
							className={'w-full'}
							value={selectedExamDate}
							onChange={handleDateChange}
						>
							<option value="">--Select Exam Date--</option>
							{examDates.length > 0 &&
								examDates.map((date) => {
									return (
										<option value={date.sl_exam_date}>
											{date.sl_exam_date}
										</option>
									);
								})}
						</InputSelect>
					</div>
				)}

				<div>
					<InputSelect
						label="Posts"
						className={'w-full'}
						value={selectedPost}
						onChange={handlePostChange}
					>
						<option value="">--Select Post--</option>
						{postsList.length > 0 &&
							postsList.map((post) => {
								return <option value={post.sl_post}>{post.sl_post}</option>;
							})}
					</InputSelect>
				</div>

				<div className="self-end">
					<div className="flex gap-2">
						<CButton
							onClick={handleGetResultData}
							isLoading={_getResultViewDataMutation.isPending}
						>
							View Result
						</CButton>

						<CButton
							varient={'btn--warning'}
							onClick={handleGetExcelBtn}
							isLoading={_getResultExel.isPending}
						>
							Excel
						</CButton>
					</div>
				</div>
			</section>

			<p className="text-red-500 text-sm pb-3">
				Note: The negative marking is only calculated for wrong answered
				questions.
			</p>

			<DataTable
				columns={columns}
				data={resultData}
				pagination
				highlightOnHover
			/>
		</>
	);
}

export default ViewReports;

{
	/* <div className="flex gap-3 justify-center py-4">
				<div className="text-xs border p-1">
					Total Questions:{' '}
					<span className="font-semibold">
						{' '}
						{testDetails.test_total_question}{' '}
					</span>
				</div>
				<div className="text-xs border p-1">
					Duration :{' '}
					<span className="font-semibold">
						{' '}
						{testDetails.test_duration} Min{' '}
					</span>
				</div>
				<div className="text-xs border p-1">
					Marks per question :{' '}
					<span className="font-semibold">
						{' '}
						{testDetails.mt_mark_per_question} M{' '}
					</span>
				</div>
				<div className="text-xs border p-1">
					Test Marks :{' '}
					<span className="font-semibold">
						{' '}
						{testDetails.mt_total_marks} M{' '}
					</span>
				</div>
				<div className="text-xs border p-1">
					Passing Marks :{' '}
					<span className="font-semibold">
						{' '}
						{testDetails.mt_passing_out_of} M{' '}
					</span>
				</div>
				<div className="text-xs border p-1">
					Negative Marking:{' '}
					<span className="font-semibold"> {testDetails.test_negative} M </span>
				</div>

				<div className="text-xs border p-1">
					Total candidates:{' '}
					<span className="font-semibold"> {resultData.length} </span>
				</div>
			</div> */
}
