import React from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import Input from '../UI/Input.jsx';
import { useNavigate } from 'react-router-dom';

function AddTestForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { test } = useSelector((state) => state.tests);
	const inputChangeHandler = (e) => {
		let { name, value } = e.target;
		dispatch(testsSliceActions.setTestDetails({ key: name, value }));
	};

	const createTestSubmitHandler = (e) => {
		navigate('/questions-list');
	};
	return (
		<div>
			<CModal id="create-test-modal" title={'Create New Test'}>
				<form
					action=""
					id="create-test-form"
					onSubmit={createTestSubmitHandler}>
					<div className="grid grid-cols-3 gap-3 mb-5">
						<Input
							value={test.test_name}
							label={'Test name'}
							name="test_name"
							onChange={inputChangeHandler}></Input>

						<Input
							value={test.test_duration}
							label={'Test duration'}
							name="test_duration"
							onChange={inputChangeHandler}></Input>
						<Input
							value={test.marks_per_question}
							label={'Marks per question'}
							name="marks_per_question"
							onChange={inputChangeHandler}></Input>

						<Input
							value={test.test_passing_mark}
							label={'Passing marks'}
							name="test_passing_mark"
							onChange={inputChangeHandler}></Input>
					</div>

					<div className="flex justify-center">
						<CButton type="submit" icon={<FaFloppyDisk />}>
							Save
						</CButton>
					</div>
				</form>
			</CModal>
		</div>
	);
}

export default AddTestForm;
