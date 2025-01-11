import { FaPencilAlt } from 'react-icons/fa';
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
	getCentersList,
	getServerIP,
	getStudentsList,
	postServerIP,
	updateServerIP,
} from './api.jsx';
import CModal from '../../UI/CModal.jsx';
import modalSlice, { ModalActions } from '../../../Store/modal-slice.jsx';

function AddNewStudent() {
	const [formFillingIpInputValue, setFormFillingIpInputValue] = useState('');
	const [editFormFillingIpInputValue, setEditFormFillingIpInputValue] =
		useState('');
	const { formFillingIP, selectedFormFillingIP } = useSelector(
		(state) => state.studentArea
	);
	const dispatch = useDispatch();

	const handleServerIpSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const ip = formData.get('form_filling_server_ip');
		if (!ip) return toast.warn('Please enter IP');
		saveServerIP(ip);
	};

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

	const {
		mutate: saveServerIP,
		isError: saveIpError,
		isPending: saveIpPending,
	} = useMutation({
		mutationFn: postServerIP,
		onSuccess: (data, variables) => {
			refetchServerIPList();
			toast.success('Successfully added form filling IP.');

			dispatch(ModalActions.toggleModal('add-process-url-modal'));
		},
		onError: (data) => {
			const er = data?.response?.data?.message || 'Server errror';
			toast.warn(er);
		},
	});

	const handleServerIpUpdate = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const ip = formData.get('form_filling_server_ip');
		const id = formData.get('edit_id');
		if (!ip) return toast.warn('Please enter IP');

		if (!id) return toast.warn('Edit id not set.');
		updateServerIpMutation.mutate({ ip, id });
	};

	const updateServerIpMutation = useMutation({
		mutationFn: updateServerIP,
		onSuccess: (data, variables) => {
			refetchServerIPList();
			toast.success('Successfully updated form filling IP.');

			dispatch(ModalActions.toggleModal('edit-process-url-modal'));
		},
		onError: (data) => {
			const er = data?.response?.data?.message || 'Server errror';
			toast.warn(er);
		},
	});

	const { mutate: getStudetList, isPending: studentDataLoading } = useMutation({
		mutationFn: getStudentsList,
		onSuccess: (data, variables) => {
			if (data.message == 'Validation error') {
				Swal.fire('Error', 'Student data already present');
				return false;
			}
			Swal.fire('Success', 'Downloaded students list');
		},
		onError: (error, variables) => {
			console.log(error, '==error==');
			const er = error?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});

	const handleGetStudentsList = () => {
		getStudetList(selectedFormFillingIP);
	};

	const { mutate: getCenterList, isPending: centersListLoading } = useMutation({
		mutationFn: getCentersList,
		onSuccess: (data, variables) => {
			console.log(data, '==data centers list==');

			Swal.fire('Success', 'Downloaded centers list');
		},
		onError: (error, variables) => {
			const er = error?.response?.data?.message || 'Server error.';
			toast.warn(er);
		},
	});
	const handleGetCentersList = () => {
		getCenterList(selectedFormFillingIP);
	};

	function onServerIPChange(e) {
		dispatch(StudentAreaActions.setSelectedFormFillingIP(e.target.value));
	}
	console.log(selectedFormFillingIP, '==selectedFormFillingIP==');
	return (
		<>
			<div className="mt-5 flex flex-col gap-4">
				<div className="flex gap-1">
					<InputSelect
						onChange={onServerIPChange}
						label={'Select Form Filling URL'}
						className={'w-[15%]'}
						value={JSON.stringify(selectedFormFillingIP)}
					>
						<option value="">-- Select --</option>
						{formFillingIP &&
							formFillingIP.map((_el, idx) => {
								return (
									<>
										<option value={JSON.stringify(_el)} key={_el.id}>
											{_el.server_ip}
										</option>
									</>
								);
							})}
					</InputSelect>

					<CButton
						icon={<FaPencilAlt />}
						onClick={() => {
							dispatch(ModalActions.toggleModal('edit-process-url-modal'));
						}}
						className={'btn--primary self-end'}
					/>

					<CButton
						icon={<FaPlus />}
						onClick={() => {
							dispatch(ModalActions.toggleModal('add-process-url-modal'));
						}}
						className={'btn--primary self-end'}
					/>
				</div>

				<CButton
					type="button"
					onClick={handleGetCentersList}
					className={'w-fit'}
					isLoading={studentDataLoading}
				>
					Get All Centers List
				</CButton>

				<CButton
					type="button"
					onClick={handleGetStudentsList}
					className={'w-fit'}
					isLoading={studentDataLoading}
				>
					Get All Stuent List
				</CButton>
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
						value={formFillingIpInputValue}
						onChange={(e) => {
							setFormFillingIpInputValue(e.target.value);
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
						value={selectedFormFillingIP?.id}
					></Input>

					<Input
						type="url"
						label={'Set Form Filling Server IP'}
						name={'form_filling_server_ip'}
						value={selectedFormFillingIP?.server_ip}
						onChange={(e) => {
							dispatch(
								StudentAreaActions.setSelectedFormFillingIP(
									JSON.stringify({
										id: selectedFormFillingIP?.id,
										server_ip: e.target.value,
									})
								)
							);
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

export default AddNewStudent;
