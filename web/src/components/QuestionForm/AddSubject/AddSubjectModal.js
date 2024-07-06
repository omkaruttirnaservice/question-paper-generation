import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ModalActions } from '../../../Store/modal-slice.js';
import { getSubjectsListThunk } from '../../../Store/question-form-slice.js';
import useHttp from '../../Hooks/use-http.js';
import CButton from '../../UI/CButton.js';
import CModal from '../../UI/CModal.js';
import { toast } from 'react-toastify';

function AddSubjectModal() {
	const subjectNameRef = useRef();
	const [error, setError] = useState({});
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();
	let { data: _formData, postsList } = useSelector(
		(state) => state.questionForm
	);

	const addSubjectSchema = Yup.object().shape({
		subject_name: Yup.string('Subject name should be in string').required(
			'Subject name requied'
		),
	});

	async function handleInputChange(e) {
		let { name: subject_name, value } = e.target;
		try {
			await addSubjectSchema.validateAt(subject_name, { subject_name: value });
			setError({ ...error, subject_name: null });
		} catch (error) {
			console.log(error.message);
			setError({ ...error, subject_name: error.message });
		}
	}

	const handleSubjectAdd = async () => {
		let subjectName = subjectNameRef.current.value;
		let postId = _formData.post_id;
		console.log(postId, '--');

		if (!postId) {
			toast('Please select post');
			return;
		}

		try {
			await addSubjectSchema.validate({ subject_name: subjectName });
			setError({ ...error, subject_name: null });
			postSubjectAdd(postId, subjectName);
		} catch (error) {
			console.log(error.message);
			setError({ ...error, subject_name: error.message });
		}
	};

	function postSubjectAdd(postId, subjectName) {
		const requestData = {
			url: '/add-subject',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postId: postId, subjectName: subjectName }),
		};

		sendRequest(requestData, (data) => {
			console.log(data, 'after adding subject');
			dispatch(ModalActions.toggleModal('add-subject-modal'));
			if (data.success === 1) {
				toast('Subject added successfully');
				dispatch(getSubjectsListThunk(postId, sendRequest));
			} else {
				toast('Something went wrong1');
			}
		});
	}
	return (
		<div>
			<CModal id={'add-subject-modal'} title={'Add Subject'}>
				<div className="flex flex-col gap-7">
					<div className="relative flex flex-col">
						<label htmlFor="" className="">
							Selected Post
						</label>
						<input
							type="text"
							className="input-el mt-2"
							// value={subjectsList[_formData.subject_id - 1]?.subject_name}
							value={postsList
								.map((el) => {
									if (el.id == _formData.post_id) return el.mtl_test_name;
								})
								.join('')}
							readOnly
						/>
					</div>

					<div className="relative">
						<label htmlFor="" className="">
							Subject Name
						</label>

						<input
							type="text"
							name="subject_name"
							className="input-el w-full mt-2"
							ref={subjectNameRef}
							onChange={handleInputChange}
						/>

						{error.subject_name && (
							<span className="error">{error.subject_name}</span>
						)}
					</div>

					<CButton
						className="w-[30%] flex justify-center mx-auto"
						onClick={handleSubjectAdd}
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Submit
					</CButton>
				</div>
			</CModal>
		</div>
	);
}

export default AddSubjectModal;
