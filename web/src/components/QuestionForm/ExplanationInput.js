import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../Store/question-form-slice.js';

function ExplanationInput({ showNewInputField, setShowNewInputField }) {
	const { data: _formData } = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();
	useEffect(() => {
		/**
		 * Replace function replaces the textarea element with ck editor instance
		 * */
		let explanationInstance = window.CKEDITOR.instances['explanation'];

		if (explanationInstance) {
			explanationInstance.destroy(true);
		}

		window.CKEDITOR.replace(`explanation`, {
			height: 100,
		});

		/**
		 * Get value of the editor by listening to change event
		 * Value is available by calling .getData() function
		 * */

		window.CKEDITOR.instances[`explanation`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `explanation`,
					value: window.CKEDITOR.instances[`explanation`].getData(),
				})
			);
		});
	}, []);

	return (
		<>
			<div className="flex flex-col gap-2">
				<label htmlFor="explanation" className="question-option !top-[-3rem]">
					Explanation
				</label>
				<textarea
					name={`explanation`}
					id={`explanation`}
					value={_formData.explanation}
					className="top-10"></textarea>
			</div>
		</>
	);
}

export default ExplanationInput;
