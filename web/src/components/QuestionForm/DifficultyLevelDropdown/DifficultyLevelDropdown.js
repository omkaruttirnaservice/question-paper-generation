import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';

function DifficultyLevelDropdown() {
	const dispatch = useDispatch();
	const { data: _formData, errors } = useSelector(
		(state) => state.questionForm
	);
	const handleChange = async (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	return (
		<div className="flex flex-col gap-1 relative">
			<label htmlFor="">Difficulty</label>
			<div className="flex">
				<select
					className="input-el grow w-48"
					name="difficulty"
					onChange={handleChange}>
					<option value="" className="">
						-- Select --
					</option>
					<option value="1">Easy</option>
					<option value="2">Medium</option>
					<option value="3">Hard</option>
				</select>
			</div>

			{errors.difficulty && <div className=" error">{errors.difficulty}</div>}
		</div>
	);
}

export default DifficultyLevelDropdown;
