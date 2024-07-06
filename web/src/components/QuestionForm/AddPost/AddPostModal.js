import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.js';
import { getPostListThunk } from '../../../Store/question-form-slice.js';
import useHttp from '../../Hooks/use-http.js';
import CButton from '../../UI/CButton.js';
import CModal from '../../UI/CModal.js';
import { toast } from 'react-toastify';

function AddPostModal() {
	const postNameRef = useRef();
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();

	const handlePostAdd = async () => {
		let postName = postNameRef.current.value;
		if (!postName) {
			toast('Please enter post name');
			return;
		}

		const requestData = {
			url: 'posts/add',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postName }),
		};
		sendRequest(requestData, (data) => {
			dispatch(ModalActions.toggleModal('add-post-modal'));
			if (data.success === 1) {
				toast('Post added successfully');
				dispatch(getPostListThunk());
			} else {
				toast('Something went wrong1');
			}
		});
	};
	return (
		<div>
			<CModal id={'add-post-modal'} title={'Add Post'}>
				<div className="flex flex-col">
					<label htmlFor="" className="mb-1">
						Post Name
					</label>
					<input
						type="text"
						name="subject_name"
						className="input-el mb-6"
						ref={postNameRef}
					/>

					<CButton
						className="w-[30%] flex justify-center mx-auto"
						onClick={handlePostAdd}
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Submit
					</CButton>
				</div>
			</CModal>
		</div>
	);
}

export default AddPostModal;
