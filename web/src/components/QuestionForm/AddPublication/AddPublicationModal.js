import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { loaderActions } from '../../../Store/loader-slice.js';
import { ModalActions } from '../../../Store/modal-slice.js';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';
import CButton from '../../UI/CButton.js';
import CModal from '../../UI/CModal.js';

import { toast } from 'react-toastify';

function AddPublicationModal() {
	const publicationName = useRef();
	let { publicationsList } = useSelector((state) => state.questionForm);

	const [error, setError] = useState({});
	const dispatch = useDispatch();

	const addPublicationNameSchema = Yup.object().shape({
		pub_name: Yup.string('Publication name should be in string').required(
			'Publication name requied'
		),
	});
	async function handleInputChange(e) {
		let { name: pub_name, value } = e.target;
		try {
			await addPublicationNameSchema.validateAt(pub_name, { pub_name: value });
			setError({ ...error, pub_name: null });
		} catch (error) {
			console.log(error.message);
			setError({ ...error, pub_name: error.message });
		}
	}

	const handlePublicationAdd = async () => {
		let pubName = publicationName.current.value;
		dispatch(loaderActions.showLoader());
		if (!pubName) {
			toast('Please enter publication name');

			dispatch(loaderActions.hideLoader());
			return;
		}
		try {
			await addPublicationNameSchema.validate({ pub_name: pubName });
			setError({ ...error, subject_name: null });
			let newPublicationsList = [
				...publicationsList,
				{ msq_publication_name: pubName },
			];

			dispatch(QuestionFormActions.setPublicationsList(newPublicationsList));
			dispatch(ModalActions.toggleModal('add-publication-modal'));
			dispatch(loaderActions.hideLoader());
		} catch (error) {
			dispatch(loaderActions.hideLoader());
			console.log(error.message);
			setError({ ...error, subject_name: error.message });
		}
	};

	return (
		<div>
			<CModal id={'add-publication-modal'} title={'Add Publication'}>
				<div className="flex flex-col relative mb-9">
					<label htmlFor="" className="mb-1">
						Publication Name
					</label>
					<input
						type="text"
						name="pub_name"
						className="input-el"
						onChange={handleInputChange}
						ref={publicationName}
					/>

					{error.pub_name && <span className="error">{error.pub_name}</span>}
				</div>

				<CButton
					className="w-[30%] flex justify-center mx-auto"
					onClick={handlePublicationAdd}
					isLoading={useSelector((state) => state.loader.isLoading)}>
					Submit
				</CButton>
			</CModal>
		</div>
	);
}

export default AddPublicationModal;
