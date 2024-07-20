import React from 'react';
import { FaListUl } from 'react-icons/fa6';
import { IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import AddTestForm from '../AddTestForm/AddTestForm.jsx';
import AddTestFormAuto from '../AddTestFormAuto/AddTestFormAuto.jsx';
import CButton from '../UI/CButton.jsx';
import { MdChecklist } from 'react-icons/md';
import { H3 } from '../UI/Headings.jsx';

export const MANUAL_TEST = 'manual';
export const AUTO_TEST = 'auto';

function Dashboard() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const createTestHandler = () => {
		dispatch(ModalActions.toggleModal('create-test-modal'));
		dispatch(testsSliceActions.setTestCreationType(MANUAL_TEST));
	};

	const createTestHandlerAuto = () => {
		dispatch(ModalActions.toggleModal('create-test-modal-auto'));
		dispatch(testsSliceActions.setTestCreationType(AUTO_TEST));
	};

	const testsListHandler = () => navigate('/tests-list');
	const publishedTestsListHandler = () => navigate('/published-test');

	return (
		<>
			<div className="container mt-6">
				<H3>Test Area</H3>
				<div className="flex gap-6">
					<CButton className={'btn--info'} onClick={testsListHandler} icon={<FaListUl />}>
						All Tests List
					</CButton>

					<CButton className={'btn--danger'} onClick={publishedTestsListHandler} icon={<MdChecklist />}>
						Published Tests List
					</CButton>

					<CButton onClick={createTestHandler} icon={<IoCreateOutline />}>
						Create Test (Manual)
					</CButton>

					<CButton className={'btn--success'} onClick={createTestHandlerAuto} icon={<IoCreateOutline />}>
						Create Test (Auto)
					</CButton>

					<AddTestForm />
					<AddTestFormAuto />
				</div>
			</div>
		</>
	);
}

export default Dashboard;
