import React from 'react';
import CButton from '../../UI/CButton.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice.js';
import { FaPlus } from 'react-icons/fa';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';

function SubjectListDropdown({ isShowAddNewBtn = true }) {
	const dispatch = useDispatch();
	const {
		data: _formData,
		subjectsList,
		errors,
	} = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	const handleSubjectAddModal = () => {
		if (
			_formData.post_id === '-1' ||
			_formData.post_id === null ||
			_formData.post_id == ''
		) {
			toast('Please select post.');
			return;
		}
		dispatch(ModalActions.toggleModal('add-subject-modal'));
	};
	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Subject</label>
			<div className="flex">
				{isShowAddNewBtn && (
					<CButton onClick={handleSubjectAddModal} icon={<FaPlus />} />
				)}
				<select
					id="subject-id"
					className="input-el grow w-48"
					name="subject_id"
					onChange={handleChange}>
					<option value="" className="" name="subject_id">
						-- Select --
					</option>
					{subjectsList.length >= 1 &&
						subjectsList?.map((subject, i) => (
							<option
								key={i}
								value={subject.id}
								selected={subject.id == _formData.subject_id}>
								{subject.mtl_name}
							</option>
						))}
				</select>
			</div>
			{errors.subject_id && <div className=" error">{errors.subject_id}</div>}
		</div>
	);
}

export default SubjectListDropdown;
