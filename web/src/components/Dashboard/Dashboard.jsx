import React from 'react';
import { IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import AddTestForm from '../AddTestForm/AddTestForm.jsx';
import AddTestFormAuto from '../AddTestFormAuto/AddTestFormAuto.jsx';
import CButton from '../UI/CButton.jsx';
import { AUTO_TEST, MANUAL_TEST } from '../Utils/Constants.jsx';

function Dashboard() {
	const dispatch = useDispatch();

	const createTestHandler = () => {
		dispatch(ModalActions.toggleModal('create-test-modal'));

		dispatch(testsSliceActions.setTestCreationType(MANUAL_TEST));
	};

	const createTestHandlerAuto = () => {
		dispatch(ModalActions.toggleModal('create-test-modal-auto'));
		dispatch(testsSliceActions.setTestCreationType(AUTO_TEST));
	};

	return (
		<div className="container mx-auto mt-6 flex gap-6">
			<CButton onClick={createTestHandler} icon={<IoCreateOutline />}>
				Create Test (Manual)
			</CButton>

			<CButton
				className={'btn--success'}
				onClick={createTestHandlerAuto}
				icon={<IoCreateOutline />}>
				Create Test (Auto)
			</CButton>

			<AddTestForm />
			<AddTestFormAuto />
		</div>
	);
}

export default Dashboard;
