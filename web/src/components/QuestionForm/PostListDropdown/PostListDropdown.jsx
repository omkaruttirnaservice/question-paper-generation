import React from 'react';
import CButton from '../../UI/CButton.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import { FaPlus } from 'react-icons/fa';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';

function PostListDropdown({ isShowAddNewBtn = true, disabled = false }) {
	const dispatch = useDispatch();
	const { data: _formData, postsList, errors } = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			EditQuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);

		console.log(postsList, '==postsList==');
		let selectedPost = postsList.filter((el) => el.id == e.target.value);
		console.log(selectedPost, '==selectedPost==');

		if (selectedPost.length >= 0) {
			dispatch(EditQuestionFormActions.setPostName(selectedPost[0].mtl_test_name));
		} else {
			dispatch(EditQuestionFormActions.setPostName(null));
		}
	};

	const handlePostAddModal = () => {
		dispatch(ModalActions.toggleModal('add-post-modal'));
	};

	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Post</label>
			<div className="flex">
				{isShowAddNewBtn && <CButton onClick={handlePostAddModal} icon={<FaPlus />} />}
				<select id="post-id" className="input-el grow w-48" name="post_id" disabled={disabled} onChange={handleChange}>
					<option value="" className="" name="">
						-- Select --
					</option>
					{postsList.length >= 1 &&
						postsList?.map((post, i) => (
							<option key={i} value={post.id} selected={post.id == _formData.post_id}>
								{post.mtl_test_name}
							</option>
						))}
				</select>
			</div>
			{errors.post_id && <div className=" error">{errors.post_id}</div>}
		</div>
	);
}

export default PostListDropdown;
