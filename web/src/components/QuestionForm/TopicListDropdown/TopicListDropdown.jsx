import React from 'react';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import { FaPlus } from 'react-icons/fa';

function TopicListDropdown({ isShowAddNewBtn = true }) {
	const dispatch = useDispatch();
	const {
		data: _formData,
		topicsList,
		errors,
	} = useSelector((state) => state.questionForm);
	const handleChange = async (e) => {
		dispatch(
			EditQuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	const handleTopicAddModal = () => {
		if (
			_formData.subject_id === '-1' ||
			_formData.subject_id === null ||
			_formData.subject_id == ''
		) {
			toast('Please select subect.');
			return;
		}
		dispatch(ModalActions.toggleModal('add-topic-modal'));
	};
	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Topic</label>
			<div className="flex">
				{isShowAddNewBtn && (
					<CButton onClick={handleTopicAddModal} icon={<FaPlus />} />
				)}
				<select
					className="input-el grow w-48"
					name="topic_id"
					onChange={handleChange}>
					<option value="" className="">
						-- Select --
					</option>
					{topicsList?.map((topic, i) => (
						<option
							key={i}
							value={topic.id}
							selected={topic.id == _formData.topic_id}>
							{topic.topic_name}
						</option>
					))}
				</select>
			</div>

			{errors.topic_id && <div className=" error">{errors.topic_id}</div>}
		</div>
	);
}

export default TopicListDropdown;
