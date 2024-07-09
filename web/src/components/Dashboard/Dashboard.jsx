import React from 'react';
import { IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.jsx';
import AddTestForm from '../AddTestForm/AddTestForm.jsx';
import CButton from '../UI/CButton.jsx';

function Dashboard() {
	const dispatch = useDispatch();

	const createTestHandler = () => {
		dispatch(ModalActions.toggleModal('create-test-modal'));
	};

	return (
		<div className="container mx-auto mt-6">
			<CButton onClick={createTestHandler} icon={<IoCreateOutline />}>
				Create Test
			</CButton>

			<AddTestForm />
		</div>
	);
}

export default Dashboard;
