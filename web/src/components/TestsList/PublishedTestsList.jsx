import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1 } from '../UI/Headings.jsx';
import './TestsList.css';

function PublishedTestsList() {
	const { sendRequest } = useHttp();
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.loader);

	const [publishedTestsList, setPublishedTestsList] = useState([]);
	useEffect(() => {
		getExamsList();
	}, []);

	function getExamsList() {
		const reqData = {
			url: '/api/test/list-published',
		};
		sendRequest(reqData, ({ data }) => {
			if (data.length >= 1) {
				console.log(data, '==data==');
				setPublishedTestsList(data);
			}
		});
	}

	function isExamToday(date) {
		console.log(date, '==date==');
		let examDateTime = new Date(date).getTime();

		let _d = new Date();
		let _month = _d.getMonth() + 1;
		if (_month <= 9) {
			_month = `0${_month}`;
		}
		let todaysDate = `${_d.getFullYear()}-${_month}-${_d.getDate()}`;
		let todaysDateTime = new Date(todaysDate).getTime();

		console.log(examDateTime == todaysDateTime);

		if (examDateTime > todaysDateTime) {
			return 2;
		} else if (examDateTime == todaysDateTime) {
			return 1;
		} else if (examDateTime < todaysDateTime) {
			return -1;
		}
	}

	return (
		<>
			<div className="mt-6 px-6">
				<H1 className="text-center">Published Tests List</H1>

				{publishedTestsList.length >= 1 && (
					<table className="w-[100%]">
						<thead>
							<tr className="bg-cyan-300 text-center cursor-pointer">
								<th className="p-2">#</th>
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
								publishedTestsList.map((el, idx) => {
									let value = isExamToday(el.ptl_active_date);
									console.log(value);
									return (
										<tr className="border-b-gray-300 border hover:bg-gray-100 text-center cursor-pointer">
											<td className="p-2">{idx + 1}</td>
											<td className="p-2">{el.mt_name}</td>
											<td className="p-2">Batch-{el.tm_allow_to}</td>
											<td className="p-2">{el.mt_test_time} Min</td>
											<td className="p-2">{el.mt_total_test_question}</td>
											<td className="p-2">{el.ptl_active_date}</td>
											<td className="p-2">
												{value == 1 && (
													<span className="bg-blue-300 p-1">Today</span>
												)}
												{value == 2 && (
													<span className="bg-green-300 p-1">Upcomming</span>
												)}
											</td>
											<td className="p-2">{el.ptl_link}</td>

											<td className="p-2">
												<div className="flex gap-2 items-center justify-center">
													{value == 2 && <CButton icon={<FaXmark />}></CButton>}
												</div>
											</td>
											<td className="p-2">
												<div className="flex gap-2 items-center justify-center">
													<CButton
														className="btn--info m-0"
														icon={<FaEye />}></CButton>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				)}

				{publishedTestsList.length == 0 && !isLoading && (
					<div className="text-center mt-6 flex justify-center">
						<span>Woops! no test list found.&nbsp;&nbsp;</span>
						<Link
							className="underline font-semibold flex items-center gap-2 "
							to={'/dashboard'}>
							Create New <FaPlus className="inline-block" />
						</Link>
					</div>
				)}

				{isLoading && (
					<div className="flex justify-center mt-6">
						<AiOutlineLoading3Quarters className="animate-spin text-2xl font-semibold" />{' '}
					</div>
				)}
			</div>
		</>
	);
}

export default PublishedTestsList;
