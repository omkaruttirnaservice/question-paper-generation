import { FaPencilAlt, FaRegClipboard, FaTrash, FaUpload } from 'react-icons/fa';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import Input, { InputSelect } from '../../UI/Input.jsx';
import {
	deleteServerIP,
	getCentersList,
	getPublishedTestList,
	getQuestionPaper,
	getServerIP,
	getStudentsList,
	postServerIP,
	updateServerIP,
	uploadPublishedTestToFormFilling,
} from './api.jsx';
import CModal from '../../UI/CModal.jsx';
import modalSlice, { ModalActions } from '../../../Store/modal-slice.jsx';

function AddNewStudent() {
	const [formFillingIpInputValue, setFormFillingIpInputValue] = useState('');

	const [ipDetails, setIpDetails] = useState({});

	const { formFillingIP } = useSelector((state) => state.studentArea);
	const dispatch = useDispatch();

	const {
		data: serverIP,
		error: getServerIPErr,
		isLoading: getServerIPLoading,
		isError,
		refetch: refetchServerIPList,
	} = useQuery({
		queryKey: ['getServerIP'],
		queryFn: getServerIP,
		refetchOnWindowFocus: false,
		refetchInterval: false,
		retry: false,
	});

	useEffect(() => {
		toast.warn(getServerIPErr?.message);
	}, [isError, getServerIPErr]);

	useEffect(() => {
		if (serverIP) {
			dispatch(StudentAreaActions.setFormFillingIP(serverIP.data));
		}
	}, [serverIP]);

	const handleServerIpSubmit = (e) => {
		e.preventDefault();

		if (!ipDetails?.form_filling_server_ip)
			return toast.warn('Please enter Form Filling Server IP');
		if (!ipDetails?.exam_panel_server_ip)
			return toast.warn('Please enter Exam Panel IP');

		saveServerIP(ipDetails);
	};

	const {
		mutate: saveServerIP,
		isError: saveIpError,
		isPending: saveIpPending,
	} = useMutation({
		mutationFn: postServerIP,
		onSuccess: (data, variables) => {
			refetchServerIPList();
			toast.success('Successfully added form filling IP.');
			setIpDetails({});
			dispatch(ModalActions.toggleModal('add-process-url-modal'));
		},
		onError: (data) => {
			const er = data?.response?.data?.message || 'Server errror';
			toast.warn(er);
		},
	});

	const handleServerIpUpdate = (e) => {
		e.preventDefault();

		if (!ipDetails?.form_filling_server_ip)
			return toast.warn('Please enter Form Filling Server IP');
		if (!ipDetails?.exam_panel_server_ip)
			return toast.warn('Please enter Exam Panel IP');

		if (!ipDetails?.id) return toast.warn('Edit id not set.');

		updateServerIpMutation.mutate(ipDetails);
	};

	const updateServerIpMutation = useMutation({
		mutationFn: updateServerIP,
		onSuccess: (data, variables) => {
			refetchServerIPList();
			toast.success('Successfully updated form filling IP.');

			setIpDetails({});
			dispatch(ModalActions.toggleModal('edit-process-url-modal'));
		},
		onError: (data) => {
			const er = data?.response?.data?.message || 'Server errror';
			toast.warn(er);
		},
	});

	// delete server ip
	function handleDeleteFormFillingIP(deleteId) {
		if (!deleteId) {
			toast.warn('No delete id found.');
			return false;
		}
		deleteFormFillingIPMutation.mutate(deleteId);
	}

	const deleteFormFillingIPMutation = useMutation({
		mutationFn: deleteServerIP,
		onSuccess: (data) => {
			refetchServerIPList();
			toast.success(data?.data?.message || 'Successful.');
		},
		onError: (data) => {
			const er = data?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});

	const getStudetListMutation = useMutation({
		mutationFn: getStudentsList,
		onSuccess: (data, variables) => {
			Swal.fire('Success', 'Downloaded students list');
		},
		onError: (error, variables) => {
			const er = error?.response?.data?.message || 'Server error.';
			if (er == 'Validation error') {
				Swal.fire('Error', 'Student data already present');
				return false;
			} else {
				toast.warn(er);
			}
		},
	});

	const handleGetStudentsList = (form_filling_server_ip) => {
		getStudetListMutation.mutate(form_filling_server_ip);
	};

	const getCenterListMutation = useMutation({
		mutationFn: getCentersList,
		onSuccess: (data, variables) => {
			Swal.fire('Success', 'Downloaded centers list');
			toast.success(data?.data?.success || 'Successful.');
		},
		onError: (error, variables) => {
			const er = error?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});

	const handleGetCentersList = (form_filling_server_ip) => {
		getCenterListMutation.mutate(form_filling_server_ip);
	};

	const getQuestionPaperMutation = useMutation({
		mutationFn: getQuestionPaper,
		onSuccess: (data, variables) => {
			toast.success(data?.data?.message || 'Successful.');
		},
		onError: (error, variables) => {
			const er = error?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});

	function handleGetStudentsQuestionPaper(exam_panel_server_ip) {
		if (!exam_panel_server_ip) {
			toast.warn('Exam panel server IP not selected.');
			return false;
		}
		getQuestionPaperMutation.mutate(exam_panel_server_ip);
	}

	return (
		<>
			<div className="mt-5 flex flex-col gap-4">
				<div className="">
					<table className="w-[100%]">
						<thead>
							<tr>
								<th className="border p-2">Form Filling IP</th>
								<th className="border p-2">Exam Panel IP</th>
								<th className="border p-2">Action</th>
							</tr>
						</thead>
						<tbody>
							{formFillingIP &&
								formFillingIP.map((_el, idx) => {
									return (
										<tr>
											<td className="border p-2">
												<CButton
													varient=""
													className={`!bg-transparent !shadow-none !text-md !p-1 !inline-block !text-gray-500`}
													icon={<FaRegClipboard />}
													onClick={() => {
														navigator.clipboard.writeText(
															_el.form_filling_server_ip
														);

														toast.success('Copied to clipbaord.');
													}}
												></CButton>
												<span>{_el.form_filling_server_ip}</span>
											</td>
											<td className="border p-2">
												<CButton
													varient=""
													className={`!bg-transparent !shadow-none !text-md !p-1 !inline-block !text-gray-500`}
													icon={<FaRegClipboard />}
													onClick={() => {
														navigator.clipboard.writeText(
															_el.exam_panel_server_ip
														);

														toast.success('Copied to clipbaord.');
													}}
												></CButton>
												<span>{_el.exam_panel_server_ip}</span>
											</td>
											<td className="border p-2">
												<div className="flex gap-2">
													<CButton
														icon={<FaTrash />}
														onClick={handleDeleteFormFillingIP.bind(
															null,
															_el.id
														)}
														className={'btn--danger self-end'}
													/>

													<CButton
														icon={<FaPencilAlt />}
														onClick={() => {
															dispatch(
																ModalActions.toggleModal(
																	'edit-process-url-modal'
																)
															);
															setIpDetails({
																id: _el.id,
																form_filling_server_ip:
																	_el.form_filling_server_ip,
																exam_panel_server_ip: _el.exam_panel_server_ip,
															});
														}}
														className={'btn--primary self-end'}
													/>

													<CButton
														type="button"
														onClick={handleGetCentersList.bind(
															null,
															_el.form_filling_server_ip
														)}
														className={'w-fit'}
														isLoading={getCenterListMutation.isPending}
													>
														Get All Centers List
													</CButton>

													<CButton
														type="button"
														onClick={handleGetStudentsList.bind(
															null,
															_el.form_filling_server_ip
														)}
														className={'w-fit'}
														isLoading={getStudetListMutation.isPending}
													>
														Get All Stuents List
													</CButton>

													<CButton
														type="button"
														onClick={handleGetStudentsQuestionPaper.bind(
															null,
															_el.exam_panel_server_ip
														)}
														className={'w-fit'}
														isLoading={false}
													>
														Get Student Question Paper
													</CButton>

													<UploadQuestionPaperToFormFilling _el={_el} />
												</div>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>

					<CButton
						icon={<FaPlus />}
						onClick={() => {
							dispatch(ModalActions.toggleModal('add-process-url-modal'));
						}}
						className={'btn--primary self-end'}
					>
						Add New IP
					</CButton>
				</div>
			</div>

			{/* add process url */}
			<CModal id="add-process-url-modal" title={'Add Process Url'}>
				<form
					action=""
					className="flex items-center gap-2"
					onSubmit={handleServerIpSubmit}
				>
					<Input
						type="url"
						label={'Set Form Filling Server IP'}
						name={'form_filling_server_ip'}
						value={ipDetails.form_filling_server_ip}
						onChange={(e) => {
							setIpDetails((prev) => {
								return {
									...prev,
									[e.target.name]: e.target.value,
								};
							});
						}}
					></Input>
					<Input
						type="url"
						label={'Set Exam Panel Server IP'}
						name={'exam_panel_server_ip'}
						value={ipDetails.exam_panel_server_ip}
						onChange={(e) => {
							setIpDetails((prev) => {
								return {
									...prev,
									[e.target.name]: e.target.value,
								};
							});
						}}
					></Input>
					<CButton
						type="submit"
						className={'btn--danger self-end'}
						isLoading={saveIpPending}
					>
						Save
					</CButton>
				</form>
			</CModal>

			{/* update process url */}
			<CModal id="edit-process-url-modal" title={'Update Process Url'}>
				<form
					action=""
					className="flex items-center gap-2"
					onSubmit={handleServerIpUpdate}
				>
					<Input
						type="hidden"
						// label={'edit id'}
						name={'edit_id'}
						value={ipDetails?.id}
					></Input>

					<Input
						type="url"
						label={'Set Form Filling Server IP'}
						name={'form_filling_server_ip'}
						value={ipDetails.form_filling_server_ip}
						onChange={(e) => {
							setIpDetails((prev) => {
								return {
									...prev,
									[e.target.name]: e.target.value,
								};
							});
						}}
					></Input>
					<Input
						type="url"
						label={'Set Exam Panel Server IP'}
						name={'exam_panel_server_ip'}
						value={ipDetails.exam_panel_server_ip}
						onChange={(e) => {
							setIpDetails((prev) => {
								return {
									...prev,
									[e.target.name]: e.target.value,
								};
							});
						}}
					></Input>
					<CButton
						type="submit"
						className={'btn--danger self-end'}
						isLoading={saveIpPending}
					>
						Update
					</CButton>
				</form>
			</CModal>
		</>
	);
}

function UploadQuestionPaperToFormFilling({ _el }) {
	const dispatch = useDispatch();

	const [publishedTestList, setPublishedTestList] = useState();

	const handleUploadQuestionPaperToFormFilling = () => {
		dispatch(ModalActions.toggleModal('published-test-list-modal'));
		getPublishedTestListQuery.refetch();
	};

	const getPublishedTestListQuery = useQuery({
		queryKey: ['Get Published Test List'],
		queryFn: getPublishedTestList,
		retry: false,
		refetchInterval: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	useEffect(() => {
		if (getPublishedTestListQuery?.data) {
			const list = getPublishedTestListQuery?.data?.data?.data || [];
			setPublishedTestList(list);
		}
	}, [getPublishedTestListQuery?.data]);

	const uploadPublishedTestToFormFillingMutation = useMutation({
		mutationFn: uploadPublishedTestToFormFilling,
		onSuccess: (data) => {
			console.log(data?.data?.message || 'Successful.', '==data==')
			toast.success(data?.data?.message || 'Successful.')
		},
		onError: (error) => {
			const er = error?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});

	const handleUploadToFormFilling = ({ published_test_id, ip_details }) => {
		if (!published_test_id) {
			toast.warn('Invalid published test id.');
			return;
		}
		if (!ip_details) {
			toast.warn('Invalid ip details.');
			return;
		}
		uploadPublishedTestToFormFillingMutation.mutate({
			_published_test_id: published_test_id,
			_ip_details: ip_details
		});
	};

	return (
		<>
			<CButton
				type="button"
				onClick={handleUploadQuestionPaperToFormFilling.bind(
					null,
					_el.exam_panel_server_ip
				)}
				className={'w-fit'}
				isLoading={false}
			>
				Upload Question Paper To FF
			</CButton>

			<CModal
				className={`!w-[90vw]`}
				id="published-test-list-modal"
				title={"Published Test's List"}
			>
				<table className="">
					<thead>
						<tr>
							<th>Published Test ID</th>
							<th>Test Name</th>
							<th>Batch</th>
							<th>Duration</th>
							<th>Total Questions</th>
							<th>Test Date</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{publishedTestList &&
							publishedTestList.map((_publishedTest) => {
								return (
									<>
										<tr>
											<td>{_publishedTest.id}</td>

											<td>{_publishedTest.mt_name}</td>
											<td>{_publishedTest.tm_allow_to}</td>
											<td>{_publishedTest.mt_test_time}</td>
											<td>{_publishedTest.mt_total_test_question}</td>
											<td>{_publishedTest.ptl_active_date}</td>
											<td>
												<CButton
													icon={<FaUpload />}
													isLoading={uploadPublishedTestToFormFillingMutation.isPending}
													onClick={handleUploadToFormFilling.bind(null, {
														published_test_id: _publishedTest.id,
														ip_details: _el,
													})}
												>
													Upload To Form Filling
												</CButton>
											</td>
										</tr>
									</>
								);
							})}
					</tbody>
				</table>
			</CModal>
		</>
	);
}

export default AddNewStudent;
