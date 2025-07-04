import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { loaderActions } from '../../../Store/loader-slice.jsx';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import CModal from '../../UI/CModal.jsx';
import { toast } from 'react-toastify';

function AddBookModal() {
	const bookNameRef = useRef();
	let { bookNamesList } = useSelector((state) => state.questionForm);

	const [error, setError] = useState({});
	const dispatch = useDispatch();

	const addBookNameSchema = Yup.object().shape({
		book_name: Yup.string('Book name should be in string').required(
			'Book name requied'
		),
	});
	async function handleInputChange(e) {
		let { name: book_name, value } = e.target;
		try {
			await addBookNameSchema.validateAt(book_name, { book_name: value });
			setError({ ...error, book_name: null });
		} catch (error) {
			console.log(error.message);
			setError({ ...error, book_name: error.message });
		}
	}

	const handleBookAdd = async () => {
		let bookName = bookNameRef.current.value;
		dispatch(loaderActions.showLoader());
		if (!bookName) {
			toast('Please enter book name');
			dispatch(loaderActions.hideLoader());
			return;
		}
		try {
			await addBookNameSchema.validate({ book_name: bookName });
			setError({ ...error, book_name: null });
			let newBookNamesList = [...bookNamesList, { msq_book_name: bookName }];
			dispatch(EditQuestionFormActions.setBooksList(newBookNamesList));
			dispatch(ModalActions.toggleModal('add-book-modal'));
			dispatch(loaderActions.hideLoader());
		} catch (error) {
			dispatch(loaderActions.hideLoader());
			setError({ ...error, book_name: error.message });
		}
	};

	return (
		<div>
			<CModal id={'add-book-modal'} title={'Add Book'}>
				<div className="flex flex-col relative mb-9">
					<label htmlFor="" className="mb-1">
						Book Name
					</label>
					<input
						type="text"
						name="book_name"
						className="input-el"
						onChange={handleInputChange}
						ref={bookNameRef}
					/>

					{error.book_name && <span className="error">{error.book_name}</span>}
				</div>

				<CButton
					className="w-[30%] flex justify-center mx-auto"
					onClick={handleBookAdd}
					isLoading={useSelector((state) => state.loader.isLoading)}>
					Submit
				</CButton>
			</CModal>
		</div>
	);
}

export default AddBookModal;
