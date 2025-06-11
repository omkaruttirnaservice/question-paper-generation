import React from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import Input from '../UI/Input.jsx';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { ModalActions } from '../../Store/modal-slice.jsx';

function AddTestFormAuto() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { test, errors } = useSelector((state) => state.tests);

	const createTestFormAutoSchema = Yup.object().shape({
		test_name: Yup.string('Enter test name').required('Test name required'),
		test_duration: Yup.string('Enter test duration').required('Test duration required'),
		marks_per_question: Yup.string('Enter marks per que.').required('Marks per que. required'),
		test_passing_mark: Yup.string('Enter passing marks').required('Passing marks required.'),

		is_negative_marking: Yup.string(),
		negative_mark: Yup.string('Enter negative marks').when('is_negative_marking', {
			is: () => '1',
			then: () => Yup.string().required('Negative marks required'),
			otherwise: Yup.string('Enter negative marks').notRequired(),
		}),
	});

	const inputChangeHandler = (e) => {
		let { name, value } = e.target;

		dispatch(testsSliceActions.setTestDetails({ key: name, value }));

		createTestFormAutoSchema
			.validateAt(name, { [name]: value })
			.then(() => {
				dispatch(testsSliceActions.setErrors({ ...errors, [name]: null }));
			})
			.catch((error) => {
				dispatch(testsSliceActions.setErrors({ ...errors, [name]: error.message }));
			});

		if (name === 'is_negative_marking') {
			value = value === '1' ? '1' : '0';

			if (value == '0') {
				let _newErrors = { ...errors };
				_newErrors.negative_mark = null;
				_newErrors.is_negative_marking = null;
				console.log(_newErrors);
				setTimeout(() => {
					dispatch(testsSliceActions.setErrors(_newErrors));
				}, 1);
			}
		}
	};

	const createTestSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			await createTestFormAutoSchema.validate({ ...test }, { abortEarly: false });

			dispatch(ModalActions.toggleModal('create-test-modal-auto'));

			dispatch(testsSliceActions.setTestDetailsFilled(true));
		} catch (error) {
			let __err = {};
			error.inner.forEach((el) => {
				__err[el.path] = el.message;
			});

			dispatch(testsSliceActions.setErrors(__err));

			dispatch(testsSliceActions.setTestDetailsFilled(false));
		}
	};

	return (
		<div>
			<CModal id="create-test-modal-auto" title={'Create New Test (Auto)'}>
				<form action="" id="create-test-form-auto" onSubmit={createTestSubmitHandler}>
					<div className="grid grid-cols-3 gap-6 mb-5">
						<div className="relative">
							<Input
								value={test.test_name}
								label={'Test name'}
								name="test_name"
								error={errors.test_name ? true : false}
								onChange={inputChangeHandler}></Input>
							{errors.test_name && <span className="error">{errors.test_name}</span>}
						</div>

						<div className="relative">
							<Input
								value={test.test_duration}
								label={'Test duration'}
								name="test_duration"
								error={errors.test_duration ? true : false}
								onChange={inputChangeHandler}></Input>

							{errors.test_duration && <span className="error">{errors.test_duration}</span>}
						</div>

						<div className="relative">
							<Input
								value={test.marks_per_question}
								label={'Marks per question'}
								name="marks_per_question"
								error={errors.marks_per_question}
								onChange={inputChangeHandler}></Input>

							{errors.marks_per_question && <span className="error">{errors.marks_per_question}</span>}
						</div>

						<div className="relative">
							<label htmlFor="" className="transition-all duration-300 text-gray-700 !mb-1  block">
								Negative Marking
							</label>
							<select
								name="is_negative_marking"
								id=""
								value={test.is_negative_marking}
								onChange={inputChangeHandler}
								className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300">
								<option value="0">No</option>
								<option value="1">Yes</option>
							</select>

							{errors.is_negative_marking && <span className="error">{errors.is_negative_marking}</span>}
						</div>

						<div className="relative">
							<Input
								label={'Negative Marks'}
								onChange={inputChangeHandler}
								name={'negative_mark'}
								value={test.is_negative_marking == 1 ? test.negative_mark : 0}
								disabled={test.is_negative_marking != 1 ? true : false}
							/>

							{errors.negative_mark && <span className="error">{errors.negative_mark}</span>}
						</div>

						<div className="relative">
							<Input
								value={test.test_passing_mark}
								label={'Passing marks'}
								name="test_passing_mark"
								error={errors.test_passing_mark ? true : false}
								onChange={inputChangeHandler}></Input>

							{errors.test_passing_mark && <span className="error">{errors.test_passing_mark}</span>}
						</div>
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
