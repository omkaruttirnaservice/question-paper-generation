import React from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import Input from '../UI/Input.jsx';
import { useNavigate } from 'react-router-dom';

function AddTestFormAuto() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { test } = useSelector((state) => state.tests);
	const inputChangeHandler = (e) => {
		let { name, value } = e.target;
		dispatch(testsSliceActions.setTestDetails({ key: name, value }));
	};

	const createTestSubmitHandler = (e) => {
		navigate('/create-test/auto');
	};

	return (
		<div>
			<CModal id="create-test-modal-auto" title={'Create New Test (Auto)'}>
				<form
					action=""
					id="create-test-form-auto"
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

						<div>
							<label
								htmlFor=""
								className="transition-all duration-300 text-gray-700 !mb-1  block">
								Negative Marking
							</label>
							<select
								name="is_negative_marking"
								id=""
								value={test.is_negative_marking}
								onChange={inputChangeHandler}
								className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300">
								<option value="">-- Select -- </option>
								<option value="1">Yes</option>
								<option value="0">No</option>
							</select>
						</div>

						<Input
							label={'Negative Marks'}
							onChange={inputChangeHandler}
							name={'negative_mark'}
							value={test.negative_mark}
							disabled={test.is_negative_marking != 1 ? true : false}
						/>

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

export default AddTestFormAuto;
