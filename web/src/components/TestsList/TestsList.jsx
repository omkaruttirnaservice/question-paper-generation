import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H1 } from '../UI/Headings.jsx';
import './TestsList.css';

function TestsList() {
	const [batchCount, setBatchCount] = useState([]);

	useEffect(() => {
		let _bList = [];
		for (let i = 1; i <= 50; i++) {
			_bList.push(i);
		}
		setBatchCount(_bList);
	}, []);

	const { sendRequest } = useHttp();
	const dispatch = useDispatch();
	const [testsList, setTestsList] = useState([]);
	useEffect(() => {
		getExamsList();
	}, []);

	function getExamsList() {
		const reqData = {
			url: '/api/test/list',
		};
		sendRequest(reqData, ({ data }) => {
			if (data.length >= 1) {
				setTestsList(data);
			}
			console.log(data, '==data==');
		});
	}

	const handlePublishExam = (id) => {
		dispatch(ModalActions.toggleModal('publish-exam-modal'));
	};
	return (
		<>
			<CModal id="publish-exam-modal" title={'Publish Exam'}>
				<div className="grid grid-cols-2 gap-3">
					<div className="">
						<label
							htmlFor=""
							className="transition-all duration-300 text-gray-700 !mb-1  block">
							Select Publish Date
						</label>
						<DatePicker
							placeholderText="select date"
							className="block !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
						/>
					</div>

					<div>
						<label
							htmlFor=""
							className="transition-all duration-300 text-gray-700 !mb-1  block">
							Batch No
						</label>
						<select
							name=""
							id=""
							className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40">
							<option value="">-- Select -- </option>

							{batchCount.map((el, idx) => {
								return <option value={idx + 1}>Batch {idx + 1}</option>;
							})}
						</select>
					</div>

					<CButton className="col-span-2">Publish</CButton>
				</div>
			</CModal>
			<div className="mt-6 px-6">
				<H1>Tests List</H1>

				<table className="w-[100%]">
					<thead>
						<tr className="bg-cyan-300 text-center cursor-pointer">
							<th className="p-2">#</th>
							<th className="p-2">Name</th>
							<th className="p-2">Duration</th>
							<th className="p-2">Total Questions</th>
							<th className="p-2">Marks Per Q.</th>
							<th className="p-2">Is -ve marking</th>
							<th className="p-2">Passing Marks</th>
							<th className="p-2">Publish Exam</th>
							<th className="p-2">View Published</th>
							<th className="p-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{testsList.length >= 1 &&
							testsList.map((el) => {
								return (
									<tr className="border-b-gray-300 border hover:bg-gray-100 text-center cursor-pointer">
										<td className="p-2">#</td>
										<td className="p-2">{el.mt_name}</td>
										<td className="p-2">{el.mt_test_time} Min</td>
										<td className="p-2">{el.mt_total_test_questions}</td>
										<td className="p-2">{el.mt_mark_per_question}</td>
										<td className="p-2">
											{el.mt_is_negative == 1 ? 'Yes' : 'No'}
										</td>
										<td className="p-2">{el.mt_passing_out_of}</td>
										<td className="p-2">
											<div className="flex justify-center">
												<CButton
													className="btn--primary"
													onClick={handlePublishExam.bind(null, el.id)}>
													Publish
												</CButton>
											</div>
										</td>
										<td className="p-2">View Published</td>
										<td className="p-2">
											<div className="flex gap-2 items-center justify-center">
												<CButton
													className="btn--danger m-0"
													onClick={handlePublishExam.bind(null, el.id)}
													icon={<FaTrash />}></CButton>
												<CButton
													className="btn--info m-0"
													onClick={handlePublishExam.bind(null, el.id)}
													icon={<FaEye />}></CButton>
											</div>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default TestsList;
