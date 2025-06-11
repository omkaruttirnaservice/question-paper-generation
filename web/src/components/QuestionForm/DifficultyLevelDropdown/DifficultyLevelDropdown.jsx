import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';

function DifficultyLevelDropdown() {
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
			<label htmlFor="">Difficulty</label>
			<div className="flex">
				<select
					className="input-el grow w-48"
					name="difficulty"
					onChange={handleChange}>
					<option value="" className="">
						-- Select --
					</option>
					<option value="1" selected={_formData.difficulty == 1 ? true : false}>
						Easy
					</option>
					<option value="2" selected={_formData.difficulty == 2 ? true : false}>
						Medium
					</option>
					<option value="3" selected={_formData.difficulty == 3 ? true : false}>
						Hard
					</option>
				</select>
			</div>

			{errors.difficulty && <div className=" error">{errors.difficulty}</div>}
		</div>
	);
}

export default DifficultyLevelDropdown;
