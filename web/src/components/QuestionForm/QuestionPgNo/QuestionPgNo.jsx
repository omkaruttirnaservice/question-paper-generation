import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';

function QuestionPgNo() {
	const dispatch = useDispatch();
	const { data: _formData, errors } = useSelector(
		(state) => state.questionForm
	);
	const handleChange = async (e) => {
		dispatch(
			EditQuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="pg_no">Page No</label>
			<input
				className="input-el grow"
				type="number"
				min="0"
				onChange={handleChange}
				name="pg_no"
				value={_formData.pg_no}
			/>
			{errors.pg_no && <div className=" error">{errors.pg_no}</div>}
		</div>
	);
}

export default QuestionPgNo;
