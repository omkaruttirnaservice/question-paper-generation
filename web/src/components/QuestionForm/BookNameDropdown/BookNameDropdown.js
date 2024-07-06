import React from 'react';
import CButton from '../../UI/CButton.js';
import { FaPlus } from 'react-icons/fa';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';
import { ModalActions } from '../../../Store/modal-slice.js';
import { useDispatch, useSelector } from 'react-redux';

function BookNameDropdown() {
	const dispatch = useDispatch();
	const {
		data: _formData,
		errors,
		bookNamesList,
	} = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	const handleAddBookModal = () => {
		dispatch(ModalActions.toggleModal('add-book-modal'));
	};

	return (
		<div className="flex flex-col gap-1 relative ">
			<label htmlFor="pub-name">Book Name</label>

			<div className="flex">
				<CButton onClick={handleAddBookModal} icon={<FaPlus />} />
				<select
					className="input-el grow"
					type="text"
					onChange={handleChange}
					name="book_name"
					value={_formData.book_name}>
					<option value="">-- Select --</option>
					{bookNamesList.length >= 1 &&
						bookNamesList.map((el) => {
							return (
								<option value={el.msq_book_name}>{el.msq_book_name}</option>
							);
						})}
				</select>
			</div>
			{errors.book_name && <div className=" error">{errors.book_name}</div>}
		</div>
	);
}

export default BookNameDropdown;
