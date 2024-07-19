import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaTrash } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import TestListSchemaYUP from '../PublishedTestsList/TestsListSchemaYUP.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H1 } from '../UI/Headings.jsx';
import Input from '../UI/Input.jsx';
import './TestsList.css';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';

function TestsList() {
	const navigate = useNavigate();
	let initialStatePublishForm = {
		test_id_for_publish: null,
		batch: null,
		publish_date: null,
		test_key: null,
		test_details: null,
	};
	const [batchCount, setBatchCount] = useState([]);
	const [publishExamForm, setPublishExamForm] = useState(initialStatePublishForm);

	const [errors, setErrors] = useState({});

	const { testQuestionsList } = useSelector((state) => state.tests);
	const { isLoading } = useSelector((state) => state.loader);

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
		});
	}

	const handlePublishExam = (el) => {
		if (!el.id) return;
		setPublishExamForm((prev) => {
			return {
				...prev,
				test_id_for_publish: el.id,
				test_details: el,
			};
		});
		dispatch(ModalActions.toggleModal('publish-exam-modal'));
	};

	const handleDeleteTest = async (id) => {
		if (!id) return false;

		const isConfirm = await confirmDialouge({
			title: 'Are you sure!',
			text: 'Do you want to delete test?',
		});

		if (!isConfirm) return false;

		let reqData = {
			url: '/api/test/delete',
			method: 'DELETE',
			body: JSON.stringify({ deleteId: id }),
		};

		sendRequest(reqData, ({ success }) => {
			if (success == 1) {
				Swal.fire({
					title: 'Success!',
					text: 'Deleted successfully',
					icon: 'success',
				});

				let updatedTestList = testsList.filter((el) => el.id != id);
				setTestsList(updatedTestList);
			}
		});
	};

	const handleViewQuestions = (el) => {
		if (!el.id) return false;
		console.log(el, '==el==');

		dispatch(testsSliceActions.setPreviewTestDetails(el));

		navigate('/view-test-questions');
	};

	const handleChange = (e) => {
		let { name, value } = e.target;

		TestListSchemaYUP.validateAt(name, { [name]: value })
			.then(() => {
				setErrors(name, { [name]: null });
			})
			.catch((error) => {
				setErrors({ ...errors, [name]: error.message });
			});

		setPublishExamForm((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const validatePublishExam = () => {
		TestListSchemaYUP.validate(publishExamForm, { abortEarly: false })
			.then(() => {})
			.catch((error) => {
				let _err = {};
				error.inner.forEach((err) => {
					_err[err.path] = err.message;
				});
				setErrors(_err);
			});
	};

	const handleGenerateTestKey = async (e) => {
		e.preventDefault();

		await generateAndSetKey();
	};

	const generateAndSetKey = async () => {
		let testKey = await generateTestKey(publishExamForm.test_id_for_publish);

		if (!testKey) {
			await generateAndSetKey();
		} else {
			setPublishExamForm((prev) => ({
				...prev,
				test_key: testKey,
			}));
		}
	};

	const validateTestKey = async (testKey) => {
		let _req = {
			url: '/api/test/check-for-duplicate-test-key',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ testKey }),
		};

		try {
			let _res = await fetch(_req.url, {
				method: _req.method,
				headers: _req.headers,
				body: _req.body,
			});
			let _data = await _res.json();
			return _data._success !== 2;
		} catch (error) {
			if (error.message == 'Failed to fetch') {
				alert('Error in fetch validating test key', error.message);
			} else {
				alert(error.message);
			}
			return false;
		}
	};

	const generateTestKey = async (id) => {
		let _key = `${id}`;

		if (+id <= 9) {
			_key += getRamdomNumber(3);
		} else if (+id <= 99) {
			_key += getRamdomNumber(2);
		} else if (+id <= 999) {
			_key += getRamdomNumber(1);
		}

		let isValid = await validateTestKey(_key);

		console.log(isValid, 'isValid');

		if (isValid) {
			return _key;
		} else {
			return false;
		}
	};

	const getRamdomNumber = (digits) => {
		if (!digits) return false;
		const min = Math.pow(10, digits - 1);
		const max = Math.pow(10, digits) - 1;

		const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
		return randomNumber;
	};

	const handleFinalPublishExam = async () => {
		try {
			await TestListSchemaYUP.validate(publishExamForm, { abortEarly: false });
			setErrors({});

			console.log(publishExamForm, '==publishExamForm==');

			let _req = {
				url: '/api/test/publish',
				method: 'POST',
				body: JSON.stringify(publishExamForm),
			};

			sendRequest(_req, ({ success, data }) => {
				if (success == 1) {
					Swal.fire({
						title: 'Success',
						text: data.message,
						icon: 'success',
					});

					dispatch(ModalActions.toggleModal('publish-exam-modal'));
					setPublishExamForm(initialStatePublishForm);
				}
			});
		} catch (error) {
			let _err = {};
			error.inner.forEach((err) => {
				_err[err.path] = err.message;
			});
			setErrors(_err);
		}
	};

	return (
		<>
			<CModal id="publish-exam-modal" title={'Publish Exam'}>
				<div className="grid grid-cols-2 gap-6">
					<div className="relative">
						<label htmlFor="" className="transition-all duration-300 text-gray-700 !mb-1  block">
							Select Publish Date
						</label>
						<DatePicker
							autoComplete="off"
							onChange={(date) => {
								setPublishExamForm((prev) => {
									return {
										...prev,
										publish_date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
									};
								});
							}}
							placeholderText="select date"
							defaultValue
							name="publish_date"
							value={publishExamForm.publish_date}
							className="block !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
						/>
						{errors.publish_date && <span className="error">{errors.publish_date}</span>}
					</div>

					<div className="relative">
						<label htmlFor="" className="transition-all duration-300 text-gray-700 !mb-1  block">
							Batch No
						</label>
						<select
							name="batch"
							id=""
							onChange={handleChange}
							value={publishExamForm.batch}
							className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40">
							<option value="">-- Select -- </option>

							{batchCount.map((el, idx) => {
								return <option value={idx + 1}>Batch {idx + 1}</option>;
							})}
						</select>

						{errors.batch && <span className="error">{errors.batch}</span>}
					</div>

					<div className="relative">
						<Input label={'Test key'} name={'test_key'} value={publishExamForm.test_key} disabled></Input>
						{errors.test_key && <span className="error">{errors.test_key}</span>}
					</div>
					<div className="flex items-center mt-3">
						<CButton className={'btn--success'} onClick={handleGenerateTestKey}>
							Generate Test Key
						</CButton>
					</div>

					<CButton className="col-span-2 mt-3" onClick={handleFinalPublishExam}>
						Publish
					</CButton>
				</div>
			</CModal>
			<div className="mt-6 px-6">
				<H1 className="text-center">Tests List</H1>

				{testsList.length >= 1 && (
					<table className="w-[100%]">
						<thead>
							<tr className="bg-cyan-300 text-center cursor-pointer">
								<th className="p-2">#</th>

								<th className="p-2">Published Test Id</th>
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
								testsList.map((el, idx) => {
									return (
										<tr className="border-b-gray-300 border hover:bg-gray-100 text-center cursor-pointer">
											<td className="p-2">{idx + 1}</td>

											<td className="p-2">{el.id}</td>
											<td className="p-2">{el.mt_name}</td>
											<td className="p-2">{el.mt_test_time} Min</td>
											<td className="p-2">{el.mt_total_test_question}</td>
											<td className="p-2">{el.mt_mark_per_question}</td>
											<td className="p-2">{el.mt_is_negative == 1 ? 'Yes' : 'No'}</td>
											<td className="p-2">{el.mt_passing_out_of}</td>
											<td className="p-2">
												<div className="flex justify-center">
													<CButton className="btn--primary" onClick={handlePublishExam.bind(null, el)}>
														Publish
													</CButton>
												</div>
											</td>
											<td className="p-2">View Published</td>
											<td className="p-2">
												<div className="flex gap-2 items-center justify-center">
													<CButton className="btn--danger m-0" onClick={handleDeleteTest.bind(null, el.id)} icon={<FaTrash />}></CButton>
													<CButton className="btn--info m-0" onClick={handleViewQuestions.bind(null, el)} icon={<FaEye />}></CButton>
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				)}

				{testsList.length == 0 && !isLoading && (
					<div className="text-center mt-6 flex justify-center">
						<span>Woops! no test list found.&nbsp;&nbsp;</span>
						<Link className="underline font-semibold flex items-center gap-2 " to={'/dashboard'}>
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

export default TestsList;
