import React from 'react';
import CButton from '../../UI/CButton.js';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.js';
import { FaPlus } from 'react-icons/fa';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';

function PostListDropdown({ isShowAddNewBtn = true }) {
	const dispatch = useDispatch();
	const {
		data: _formData,
		postsList,
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

	const handlePostAddModal = () => {
		dispatch(ModalActions.toggleModal('add-post-modal'));
	};

	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Post</label>
			<div className="flex">
				{isShowAddNewBtn && (
					<CButton onClick={handlePostAddModal} icon={<FaPlus />} />
				)}
				<select
					id="post-id"
					className="input-el grow w-48"
					name="post_id"
					onChange={handleChange}>
					<option value="" className="" name="">
						-- Select --
					</option>
					{postsList.length >= 1 &&
						postsList?.map((subject, i) => (
							<option
								key={i}
								value={subject.id}
								selected={subject.id == _formData.post_id}>
								{subject.mtl_test_name}
							</option>
						))}
				</select>
			</div>
			{errors.post_id && <div className=" error">{errors.post_id}</div>}
		</div>
	);
}

export default PostListDropdown;
