let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1, H3 } from '../UI/Headings.jsx';
import './TestsList.css';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import DataTable from 'react-data-table-component';

function PublishedTestsList() {
	const { sendRequest } = useHttp();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.loader);

	const [publishedTestsList, setPublishedTestsList] = useState([]);
	useEffect(() => {
		getExamsList();
	}, []);

	function getExamsList() {
		const reqData = {
			url: SERVER_IP + '/api/test/list-published',
		};
		sendRequest(reqData, ({ data }) => {
			if (data.length >= 1) {
				setPublishedTestsList(data);
			}
		});
	}

	function isExamToday(date) {
		const [e_date, e_month, e_year] = date.split('-');
		let examDate = new Date(`${e_year}-${e_month}-${e_date}`);
		examDate.setHours(0, 0, 0, 0);
		let examDateTime = examDate.getTime();

		let todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);
		let todaysDateTime = todaysDate.getTime();

		if (examDateTime > todaysDateTime) return 2;
		else if (examDateTime == todaysDateTime) return 1;
		else if (examDateTime < todaysDateTime) return -1;
	}

	const handlePublishedTestQuePreview = (el) => {
		dispatch(testsSliceActions.setPreviewPublishedTestDetails(el));
		navigate('/view-published-test-questions');
	};

	const handleUnpublishExam = async (el) => {
		if (!el.id) return false;

		const isConfirm = await confirmDialouge({
			title: 'Are you sure?',
			text: 'Do you want to unpublish exam?',
		});
		if (!isConfirm) return false;

		let rD = {
			url: SERVER_IP + '/api/test/unpublish',
			method: 'DELETE',
			body: JSON.stringify({ id: el.id }),
		};
		sendRequest(rD, ({ success, data }) => {
			if (success == 1) {
				Swal.fire({
					title: 'Success',
					text: 'Unpublished the exam',
					icon: 'success',
				});
				setPublishedTestsList(publishedTestsList.filter((_el) => _el.id != el.id));
			}
		});
	};

	const columns = [
		{
			sortable: true,
			name: '#',
			selector: (row, idx) => idx + 1,
			width: '4rem',
		},
		{
			sortable: true,
			name: 'Published test id',
			selector: (row) => row.id,
		},
		{
			sortable: true,
			name: 'Test Name',
			selector: (row) => row.mt_name,
		},

		{
			sortable: true,
			name: 'Batch',
			selector: (row) => 'Batch-' + row.tm_allow_to,
		},
		{
			sortable: true,
			name: 'Duration',
			selector: (row) => row.mt_test_time,
		},
		{
			sortable: true,
			name: 'Total Questions',
			selector: (row) => row.mt_total_test_question,
		},
		{
			sortable: true,
			name: 'Test Date',
			selector: (row) => row.ptl_active_date,
		},
		{
			sortable: true,
			name: 'Scheduled',
			cell: (row) => (
				<>
					{isExamToday(row.ptl_active_date) == 1 && <span className="bg-blue-300 p-1">Today</span>}
					{isExamToday(row.ptl_active_date) == 2 && <span className="bg-green-300 p-1">Upcomming</span>}
				</>
			),
		},
		{
			sortable: true,
			name: 'Unpublish',
			cell: (row) => (
				<>{isExamToday(row.ptl_active_date) == 2 && <CButton icon={<FaXmark />} onClick={handleUnpublishExam.bind(null, row)}></CButton>}</>
			),
		},

		{
			sortable: true,
			name: 'View Questions',
			cell: (row) => (
				<>
					<CButton className="btn--info m-0" onClick={handlePublishedTestQuePreview.bind(null, row)} icon={<FaEye />}></CButton>
				</>
			),
		},
	];

	return (
		<>
			<div className="mt-6">
				<H3 className="text-center">Published Tests List</H3>

				<DataTable columns={columns} data={publishedTestsList} pagination highlightOnHover />

				{/* {publishedTestsList.length == false && (
					<table className="w-[100%]">
						<thead>
							<tr className="bg-cyan-300 text-center cursor-pointer">
								<th className="p-2">#</th>
								<th className="p-2">Published Test Id</th>
								<th className="p-2">Name</th>
								<th className="p-2">Batch</th>
								<th className="p-2">Duration</th>
								<th className="p-2">Total Questions</th>
								<th className="p-2">Test Date</th>
								<th className="p-2">Scheduled</th>
								<th className="p-2">Exam Key</th>
								<th className="p-2">Unpublished</th>
								<th className="p-2">View Question</th>
							</tr>
						</thead>
						<tbody>
							{publishedTestsList.length >= 1 &&
								publishedTestsList.map((el, idx, _array) => {
									let value = isExamToday(el.ptl_active_date);
									return (
										<tr className="border-b-gray-300 border hover:bg-gray-100 text-center cursor-pointer">
											<td className="p-2">{idx + 1}</td>
											<td className="p-2">{el.ptl_test_id}</td>
											<td className="p-2">{el.mt_name}</td>
											<td className="p-2">Batch-{el.tm_allow_to}</td>
											<td className="p-2">{el.mt_test_time} Min</td>
											<td className="p-2">{el.mt_total_test_question}</td>
											<td className="p-2">{el.ptl_active_date}</td>
											<td className="p-2">
												{value == 1 && <span className="bg-blue-300 p-1">Today</span>}
												{value == 2 && <span className="bg-green-300 p-1">Upcomming</span>}
											</td>
											<td className="p-2">{el.ptl_link}</td>

											<td className="p-2">
												<div className="flex gap-2 items-center justify-center">
													{value == 2 && <CButton icon={<FaXmark />} onClick={handleUnpublishExam.bind(null, el)}></CButton>}
												</div>
											</td>
											<td className="p-2">
												<div className="flex gap-2 items-center justify-center">
													<CButton className="btn--info m-0" onClick={handlePublishedTestQuePreview.bind(null, el)} icon={<FaEye />}></CButton>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				)} */}

				{/* {publishedTestsList.length == 0 && !isLoading && (
					<div className="text-center mt-6 flex justify-center">
						<span>Woops! no test list found.&nbsp;&nbsp;</span>
						<Link className="underline font-semibold flex items-center gap-2 " to={'/tests-list'}>
							Publish Test <FaPlus className="inline-block" />
						</Link>
					</div>
				)}

				{isLoading && (
					<div className="flex justify-center mt-6">
						<AiOutlineLoading3Quarters className="animate-spin text-2xl font-semibold" />{' '}
					</div>
				)} */}
			</div>
		</>
	);
}

export default PublishedTestsList;
