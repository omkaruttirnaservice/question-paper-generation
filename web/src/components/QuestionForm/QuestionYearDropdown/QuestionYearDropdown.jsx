import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditQuestionFormActions } from '../../../Store/edit-question-form-slice.jsx';

function QuestionYearDropdown() {
	// prettier-ignore
	const [years, setYears] = useState([]);

	useState(() => {
		let _y = [];
		let _currentYear = new Date().getFullYear();
		for (let i = _currentYear; i >= 2000; i--) {
			_y.push(i);
		}
		setYears(_y);
	}, []);
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
			<label htmlFor="">Year</label>
			<div className="flex">
				<select
					className="input-el grow w-48"
					name="year"
					onChange={handleChange}>
					<option value="" className="">
						-- Select --
					</option>
					{years.length >= 1 &&
						years.map((_y) => {
							return (
								<option
									value={_y}
									selected={_formData.year == _y ? true : false}>
									{_y}
								</option>
							);
						})}
				</select>
			</div>

			{errors.month && <div className=" error">{errors.month}</div>}
		</div>
	);
}

export default QuestionYearDropdown;
