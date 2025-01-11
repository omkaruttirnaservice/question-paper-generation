import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import Input from '../../UI/Input.jsx';
import {
	getCentersList,
	getServerIP,
	getStudentsList,
	postServerIP,
} from './api.jsx';
import { toast } from 'react-toastify';

function AddNewStudent() {
	const { formFillingIP } = useSelector((state) => state.studentArea);
	const dispatch = useDispatch();

	const handleServerIpSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const ip = formData.get('form_filling_server_ip');
		if (!ip) return alert('Please enter IP');
		saveServerIP(ip);
	};

	const {
		data: serverIP,
		error: getServerIPErr,
		isLoading: getServerIPLoading,
		isError,
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
			Swal.fire('Success', 'Upated form filling IP');
		},
		onError: (data) => {
			alert('Error while saving IP', data);
		},
	});
	const handleFormFilligIPChange = (e) => {
		dispatch(StudentAreaActions.setFormFillingIP(e.target.value));
	};

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
		getStudetList(formFillingIP);
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
		getCenterList(formFillingIP);
	};
	return (
		<div className="mt-5 flex flex-col gap-4">
			<form
				action=""
				className="flex items-center gap-2"
				onSubmit={handleServerIpSubmit}
			>
				<Input
					label={'Set Form Filling Server IP'}
					name={'form_filling_server_ip'}
					value={formFillingIP}
					onChange={handleFormFilligIPChange}
				></Input>
				<CButton
					type="submit"
					className={'btn--danger self-end'}
					isLoading={saveIpPending}
				>
					Save
				</CButton>
			</form>

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
	);
}

export default AddNewStudent;
