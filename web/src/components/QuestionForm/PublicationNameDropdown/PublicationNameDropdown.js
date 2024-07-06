import React from 'react';
import CButton from '../../UI/CButton.js';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';
import { ModalActions } from '../../../Store/modal-slice.js';

function PublicationNameDropdown() {
	const dispatch = useDispatch();
	const {
		data: _formData,
		errors,
		publicationsList,
	} = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	const handleAddPulicationModal = () => {
		dispatch(ModalActions.toggleModal('add-publication-modal'));
	};

	return (
		<div className="flex flex-col gap-1 relative ">
			<label htmlFor="pub-name">Publication Name</label>

			<div className="flex">
				<CButton onClick={handleAddPulicationModal} icon={<FaPlus />} />
				<select
					className="input-el grow"
					type="text"
					onChange={handleChange}
					name="pub_name"
					value={_formData.pub_name}>
					<option value="">-- Select --</option>
					{publicationsList.length >= 1 &&
						publicationsList.map((el) => {
							return (
								<option value={el.msq_publication_name}>
									{el.msq_publication_name}
								</option>
							);
						})}
				</select>
			</div>
			{errors.pub_name && <div className=" error">{errors.pub_name}</div>}
		</div>
	);
}

export default PublicationNameDropdown;
