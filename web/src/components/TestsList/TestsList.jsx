import { IoIosArrowDropdown } from 'react-icons/io';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, {
	useEffect,
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCross, FaEye, FaPlus, FaTrash, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import TestListSchemaYUP from '../PublishedTestsList/TestsListSchemaYUP.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H1 } from '../UI/Headings.jsx';
import Input from '../UI/Input.jsx';
import './TestsList.css';
import DataTable from 'react-data-table-component';
import { useQuery } from '@tanstack/react-query';
import { getPostList, getServerIP } from '../StudentArea/AddNewStudent/api.jsx';
import { toast } from 'react-toastify';

function TestsList() {
	const navigate = useNavigate();
	let initialStatePublishForm = {
		test_id_for_publish: null,
		batch: null,
		publish_date: null,
		test_key: null,
		test_details: null,
		server_ip_address: null,
		selected_posts: null,
	};

	const getServerIPQuery = useQuery({
		queryKey: ['get server ip list'],
		queryFn: getServerIP,
		refetchOnMount: false,
		retry: false,
	});

	const [serverIPAddresses, setServerIPAddresses] = useState([]);

	useEffect(() => {
		if (getServerIPQuery?.data) {
			console.log(getServerIPQuery.data, '==getServerIPQuery.data==');
			setServerIPAddresses(getServerIPQuery?.data?.data || []);
		}
	}, [getServerIPQuery.data]);

	const [batchCount, setBatchCount] = useState([]);
	const [postList, setPostList] = useState(['Jr. Clerk', 'Peon', 'IT Manager']);

	const [publishExamForm, setPublishExamForm] = useState(
		initialStatePublishForm
	);

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
			url: SERVER_IP + '/api/test/list',
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
		// after opening publish exam modal fetch the url/ip of form filling sites
		//  cause it will require to fetch post list of that particular process
		getServerIPQuery.refetch();
	};

	const handleDeleteTest = async (id) => {
		if (!id) return false;

		const isConfirm = await confirmDialouge({
			title: 'Are you sure!',
			text: 'Do you want to delete test?',
		});

		if (!isConfirm) return false;

		let reqData = {
			url: SERVER_IP + '/api/test/delete',
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

		// TestListSchemaYUP.validateAt(name, { [name]: value })
		// 	.then(() => {
		// 		setErrors(name, { [name]: null });
		// 	})
		// 	.catch((error) => {
		// 		setErrors({ ...errors, [name]: error.message });
		// 	});

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
			url: SERVER_IP + '/api/test/check-for-duplicate-test-key',
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

			// Sample body
			// {
			// 	"test_id_for_publish": null,
			// 	"batch": "1",
			// 	"publish_date": "29-1-2025",
			// 	"test_key": "null123",
			// 	"test_details": null,
			// 	"server_ip_address": "6",
			// 	"selected_posts": [
			// 		[
			// 			{
			// 				"ca_post_name": "peun",
			// 				"ca_post_id": 1
			// 			}
			// 		]
			// 	]
			// }

			let _req = {
				url: SERVER_IP + '/api/test/publish',
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
					dispatch(
						testsSliceActions.setPreviewPublishedTestDetailsId(
							data.testDetails.id
						)
					);
					dispatch(
						testsSliceActions.setPreviewPublishedTestDetails(data.testDetails)
					);
					setTimeout(() => {
						navigate('/view-published-test-questions');
					}, 10);
					setPublishExamForm(initialStatePublishForm);
				}
			});
		} catch (error) {
			let _err = {};
			error.inner.forEach((err) => {
				_err[err.path] = err.message;
			});
			setErrors(_err);
			console.log(_err, '==_err==');
		}
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
			name: 'Test Id',
			selector: (row) => row.id,
			width: '7rem',
		},
		{
			sortable: true,
			name: 'Test Name',
			selector: (row) => row.mt_name,
			width: '10rem',
		},
		{
			sortable: true,
			name: 'Duration',
			selector: (row) => row.mt_test_time,
			width: '7rem',
		},
		{
			sortable: true,
			name: 'Total Questions',
			selector: (row) => row.mt_total_test_question,
			width: '8rem',
		},
		{
			sortable: true,
			name: 'Marks Per Q.',
			selector: (row) => row.mt_mark_per_question,
			width: '6rem',
		},
		{
			sortable: true,
			name: 'Is -ve marking',
			selector: (row) => (row.mt_is_negative == 1 ? 'Yes' : 'No'),
			width: '8rem',
		},
		{
			sortable: true,
			name: 'Passing Marks',
			selector: (row) => row.mt_passing_out_of,
			width: '6rem',
		},
		{
			name: 'Publish Exam',
			cell: (row) => (
				<div className="flex justify-center">
					<CButton
						className="btn--primary text-xs"
						onClick={handlePublishExam.bind(null, row)}
					>
						Publish
					</CButton>
				</div>
			),
			selector: (row) => row.sl_roll_number,
			width: '8rem',
		},
		{
			name: 'Action',
			cell: (row) => (
				<div className="flex gap-2 items-center justify-center">
					<CButton
						className="btn--danger m-0"
						onClick={handleDeleteTest.bind(null, row.id)}
						icon={<FaTrash />}
					></CButton>
					<CButton
						className="btn--info m-0"
						onClick={handleViewQuestions.bind(null, row)}
						icon={<FaEye />}
					></CButton>
				</div>
			),
			selector: (row) => row.sl_roll_number,
			width: '6rem',
		},
	];

	return (
		<>
			<CModal id="publish-exam-modal" title={'Publish Exam'} className={''}>
				<div className="grid grid-cols-2 gap-6">
					<div className="relative">
						<label
							htmlFor=""
							className="transition-all duration-300 text-gray-700 !mb-1  block"
						>
							Select Publish Date
						</label>
						<DatePicker
							autoComplete="off"
							onChange={(date) => {
								setPublishExamForm((prev) => {
									return {
										...prev,
										publish_date: `${date.getDate()}-${
											date.getMonth() + 1
										}-${date.getFullYear()}`,
									};
								});
							}}
							placeholderText="select date"
							defaultValue
							name="publish_date"
							value={publishExamForm.publish_date}
							className="block !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
						/>
						{errors.publish_date && (
							<span className="error">{errors.publish_date}</span>
						)}
					</div>

					<div className="relative">
						<label
							htmlFor=""
							className="transition-all duration-300 text-gray-700 !mb-1  block"
						>
							Batch No
						</label>
						<select
							name="batch"
							id=""
							onChange={handleChange}
							value={publishExamForm.batch}
							className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
						>
							<option value="">-- Select -- </option>

							{batchCount.map((el, idx) => {
								return <option value={idx + 1}>Batch {idx + 1}</option>;
							})}
						</select>

						{errors.batch && <span className="error">{errors.batch}</span>}
					</div>

					<div className="relative col-span-2">
						<label
							htmlFor=""
							className="transition-all duration-300 text-gray-700 !mb-1  block"
						>
							Select IP/URL
						</label>
						<select
							name="server_ip_address"
							id=""
							onChange={handleChange}
							value={publishExamForm.server_ip_address}
							className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
						>
							<option value="">-- Select -- </option>
							{getServerIPQuery.isLoading && <option>Loading...</option>}

							{serverIPAddresses?.length > 0 &&
								serverIPAddresses.map((el, idx) => {
									return (
										<option value={el.id}>{el.form_filling_server_ip}</option>
									);
								})}
						</select>

						{errors.server_ip_address && (
							<span className="error">{errors.server_ip_address}</span>
						)}
					</div>

					<div className="relative col-span-2">
						<SelectPostDropdown
							publishExamForm={publishExamForm}
							serverIPAddresses={serverIPAddresses}
							setPublishExamForm={setPublishExamForm}
							errors={errors}
						/>
					</div>

					<div className="relative">
						<Input
							label={'Test key'}
							name={'test_key'}
							value={publishExamForm.test_key}
							disabled
						></Input>
						{errors.test_key && (
							<span className="error">{errors.test_key}</span>
						)}
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
			<div className="mt-6">
				<H1 className="text-center">Tests List</H1>

				<DataTable
					columns={columns}
					data={testsList}
					pagination
					highlightOnHover
					width="5rem"
				></DataTable>

				{/* {testsList.length == -1 && (
					<table className="w-[100%]">
						<thead>
							<tr className="bg-cyan-300 text-center cursor-pointer">
								<th className="p-2">#</th>

								<th className="p-2">Test Id</th>
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
				)} */}

				{/* {testsList.length == 0 && !isLoading && (
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
				)} */}
			</div>
		</>
	);
}

function SelectPostDropdown({
	publishExamForm,
	serverIPAddresses,
	setPublishExamForm,
	errors,
}) {
	const serverIPAddress = serverIPAddresses.find(
		(el) => el.id == publishExamForm.server_ip_address
	);

	console.log(serverIPAddress, '==serverIPAddress==');

	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null); // Ref for the dropdown menu container
	const buttonRef = useRef(null); // Ref for the button that opens the dropdown
	const [postToPublishTest, setPostToPublishTest] = useState([]);
	const [postList, setPostList] = useState([]);

	const postsListQuery = useQuery({
		queryKey: [
			'GET POST LIST FROM SERVER(FORM FILLING PANEL)',
			serverIPAddress,
		],
		queryFn: () => getPostList(serverIPAddress),
		refetchOnMount: false,
		retry: false,
		enabled: !!serverIPAddress,
	});

	useEffect(() => {
		if (postsListQuery.error) {
			console.log(postsListQuery.error, '==postsListQuery.error==');
			const error = postsListQuery.error;
			toast(error?.message || 'Unable to get posts list.');
		}
	}, [postsListQuery.error]);

	useLayoutEffect(() => {
		console.log(3, '==3==');
		if (serverIPAddress?.length > 0) {
			console.log(4, '==4==');
			setPostList([]);
			postsListQuery.refetch();
		}
	}, []);

	useEffect(() => {
		if (postsListQuery?.data) {
			console.log(postsListQuery.data, '==postsListQuery.data==');
			setPostList(JSON.parse(postsListQuery?.data?.data?.data) || []);
		}
	}, [postsListQuery.data]);

	const openDropdownHandler = () => setShowDropdown(!showDropdown);

	// Close dropdown if the click is outside of the dropdown or button
	// useEffect(() => {
	// 	const handleClickOutside = (event) => {
	// 		// Check if the click was outside the dropdown (button or menu)
	// 		if (
	// 			dropdownRef.current &&
	// 			!dropdownRef.current.contains(event.target) && // Click outside the dropdown container
	// 			!buttonRef.current.contains(event.target) // Click outside the button
	// 		) {
	// 			// setShowDropdown(false); // Close the dropdown
	// 		}
	// 	};

	// 	// Add event listener to the document
	// 	document.addEventListener('click', handleClickOutside);

	// 	// Cleanup the event listener when the component is unmounted
	// 	return () => {
	// 		document.removeEventListener('click', handleClickOutside);
	// 	};
	// }, []);

	const addPostToPublishHandler = (newPost) => {
		setPostList((prev) => {
			const filteredList = prev.filter(
				(_post) => _post.ca_post_id != newPost.ca_post_id
			);
			return filteredList;
		});

		setPostToPublishTest((prev) => {
			return [...prev, newPost];
		});
	};

	useEffect(() => {
		if (postToPublishTest?.length == 0) return;
		setPublishExamForm((prev) => {
			return {
				...prev,
				selected_posts: postToPublishTest,
			};
		});
	}, [postToPublishTest]);

	const removePostFromPublishList = (post) => {};

	return (
		<>
			<label
				htmlFor=""
				className="transition-all duration-300 text-gray-700 !mb-1 block"
			>
				Select Post
			</label>

			<div ref={dropdownRef}>
				<button
					ref={buttonRef}
					className="cursor-pointer relative !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
				>
					{postToPublishTest.length === 0 && <span>-- Select -- </span>}

					<IoIosArrowDropdown
						className="text-xl justify-self-end absolute right-2 top-[50%] translate-y-[-50%]"
						onClick={() => setShowDropdown(!showDropdown)}
					/>

					{postToPublishTest.length > 0 &&
						postToPublishTest.map((postToPublish) => {
							return (
								<p className="bg-lime-200 p-1 w-fit mx-1 inline-block">
									<div className="flex items-center gap-1">
										<span>{postToPublish.ca_post_name}</span>

										<span className="" onClick={removePostFromPublishList}>
											<FaXmark
												onClick={() => {
													const filteredList = postToPublishTest.filter(
														(post) =>
															post.ca_post_id != postToPublish.ca_post_id
													);
													setPostToPublishTest(filteredList);
													setPostList((prev) => {
														return [...prev, postToPublish];
													});
												}}
											/>
										</span>
									</div>
								</p>
							);
						})}
				</button>

				<ul
					className={`absolute transition-all duration-300 ${
						!showDropdown
							? 'h-0 p-0 overflow-hidden'
							: 'h-full p-2 overflow-y-auto'
					} left-0 z-50  bg-slate-300 w-full max-h-32 `}
				>
					{postList.map((post) => {
						return (
							<li
								className="list-item relative"
								onClick={(e) => {
									addPostToPublishHandler(post);
								}}
							>
								<label htmlFor={post.ca_post_id} className="cursor-pointer">
									{post.ca_post_name}
								</label>

								{/* <input
										id={post.ca_post_id}
										type="checkbox"
										className="cursor-pointer"
									/> */}
							</li>
						);
					})}

					{postList.length === 0 && <li>No items available.</li>}
				</ul>

				{errors.selected_posts && (
					<span className="error">{errors.selected_posts}</span>
				)}
			</div>
		</>
	);
}

export default TestsList;
