import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../Store/question-form-slice.js';
import CButton from '../UI/CButton.js';

function EditOptionsInput({ showNewInputField, setShowNewInputField }) {
	const {
		data: _formData,
		errors,
		questionNumber,
	} = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();
	// useEffect(() => {
	// 	/**
	// 	 * Replace function replaces the textarea element with ck editor instance
	// 	 * */
	// 	let questionContentInstance = window.CKEDITOR.instances['question_content'];
	// 	let optionAInstance = window.CKEDITOR.instances['option_A'];
	// 	let optionBInstance = window.CKEDITOR.instances['option_B'];
	// 	let optionCInstance = window.CKEDITOR.instances['option_C'];
	// 	let optionDInstance = window.CKEDITOR.instances['option_D'];

	// 	console.log(optionAInstance, '-herer===');

	// 	if (questionContentInstance) {
	// 		questionContentInstance.destroy(true);
	// 	}
	// 	if (optionAInstance) {
	// 		optionAInstance.destroy(true);
	// 	}

	// 	if (optionBInstance) {
	// 		optionBInstance.destroy(true);
	// 	}

	// 	if (optionCInstance) {
	// 		optionCInstance.destroy(true);
	// 	}

	// 	if (optionDInstance) {
	// 		optionDInstance.destroy(true);
	// 	}

	// 	window.CKEDITOR.replace(`question_content`, {
	// 		height: 100,
	// 	});

	// 	window.CKEDITOR.replace(`option_A`, {
	// 		height: 100,
	// 	});

	// 	window.CKEDITOR.replace(`option_B`, {
	// 		height: 100,
	// 	});
	// 	window.CKEDITOR.replace(`option_C`, {
	// 		height: 100,
	// 	});

	// 	window.CKEDITOR.replace(`option_D`, {
	// 		height: 100,
	// 	});

	// 	/**
	// 	 * Get value of the editor by listening to change event
	// 	 * Value is available by calling .getData() function
	// 	 * */
	// 	window.CKEDITOR.instances[`question_content`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `question_content`,
	// 				value: window.CKEDITOR.instances[`question_content`].getData(),
	// 			})
	// 		);
	// 	});

	// 	window.CKEDITOR.instances[`option_A`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `option_A`,
	// 				value: window.CKEDITOR.instances[`option_A`].getData(),
	// 			})
	// 		);
	// 	});

	// 	window.CKEDITOR.instances[`option_B`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `option_B`,
	// 				value: window.CKEDITOR.instances[`option_B`].getData(),
	// 			})
	// 		);
	// 	});

	// 	window.CKEDITOR.instances[`option_C`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `option_C`,
	// 				value: window.CKEDITOR.instances[`option_C`].getData(),
	// 			})
	// 		);
	// 	});
	// 	window.CKEDITOR.instances[`option_D`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `option_D`,
	// 				value: window.CKEDITOR.instances[`option_D`].getData(),
	// 			})
	// 		);
	// 	});
	// }, []);
	const destroyEditorInstances = () => {
		if (window.CKEDITOR.instances['question_content']) {
			window.CKEDITOR.instances['question_content'].destroy(true);
		}
		if (window.CKEDITOR.instances['option_A']) {
			window.CKEDITOR.instances['option_A'].destroy(true);
		}
		if (window.CKEDITOR.instances['option_B']) {
			window.CKEDITOR.instances['option_B'].destroy(true);
		}
		if (window.CKEDITOR.instances['option_C']) {
			window.CKEDITOR.instances['option_C'].destroy(true);
		}
		if (window.CKEDITOR.instances['option_D']) {
			window.CKEDITOR.instances['option_D'].destroy(true);
		}
		if (window.CKEDITOR.instances['option_E']) {
			window.CKEDITOR.instances['option_E'].destroy(true);
		}
	};

	const handleEditorChange = (editorKey) => {
		return function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: editorKey,
					value: window.CKEDITOR.instances[editorKey].getData(),
				})
			);
		};
	};

	useEffect(() => {
		destroyEditorInstances();

		if (!window.CKEDITOR.instances['question_content']) {
			window.CKEDITOR.replace('question_content', {
				height: 100,
			});

			window.CKEDITOR.instances['question_content'].on(
				'change',
				handleEditorChange('question_content')
			);
		}
		if (!window.CKEDITOR.instances['option_A']) {
			window.CKEDITOR.replace('option_A', {
				height: 100,
			});

			window.CKEDITOR.instances['option_A'].on(
				'change',
				handleEditorChange('option_A')
			);
		}
		if (!window.CKEDITOR.instances['option_B']) {
			window.CKEDITOR.replace('option_B', {
				height: 100,
			});
			window.CKEDITOR.instances['option_B'].on(
				'change',
				handleEditorChange('option_B')
			);
		}
		if (!window.CKEDITOR.instances['option_C']) {
			window.CKEDITOR.replace('option_C', {
				height: 100,
			});
			window.CKEDITOR.instances['option_C'].on(
				'change',
				handleEditorChange('option_C')
			);
		}
		if (!window.CKEDITOR.instances['option_D']) {
			window.CKEDITOR.replace('option_D', {
				height: 100,
			});
			window.CKEDITOR.instances['option_D'].on(
				'change',
				handleEditorChange('option_D')
			);
		}

		return () => {
			destroyEditorInstances();
		};
	}, []);

	// useEffect(() => {
	// 	if (!window.CKEDITOR.instances['option_E'] && !showNewInputField) {
	// 		return;
	// 	}

	// 	if (window.CKEDITOR.instances['option_E']) {
	// 		window.CKEDITOR.instances['option_E'].destroy(true);
	// 		return;
	// 	}

	// 	window.CKEDITOR.replace(`option_E`, {
	// 		height: 100,
	// 	});

	// 	window.CKEDITOR.instances[`option_E`].on('change', function () {
	// 		dispatch(
	// 			QuestionFormActions.handleInputChange({
	// 				key: `option_E`,
	// 				value: window.CKEDITOR.instances[`option_E`].getData(),
	// 			})
	// 		);
	// 	});

	// 	return () => {
	// 		if (window.CKEDITOR.instances['option_E']) {
	// 			window.CKEDITOR.instances['option_E'].destroy(true);
	// 		}
	// 	};
	// }, [showNewInputField]);

	return (
		<>
			<div className="flex flex-col gap-3 relative">
				<div className="flex gap-2">
					<label
						htmlFor="question_content"
						className="question-option !top-[-3rem] !rounded-sm">
						Question&nbsp;
					</label>

					<span className="bg-purple-200 text-gray-700 px-2 py-1 font-bold">
						{_formData.id}
					</span>
				</div>

				<textarea
					name={`question_content`}
					id={`question_content`}
					value={_formData.question_content}
					className="top-10"></textarea>
				{errors.question_content && (
					<div className="error">{errors.question_content}</div>
				)}
				<ImageInputComp label="Question image" inputFor="question_content" />
			</div>

			<hr />

			<div className="flex flex-col gap-3 relative">
				<div className="flex items-center gap-2">
					<label htmlFor="option_A" className="question-option !top-[-3rem]">
						Option A
					</label>
					<AnswerOptionRadioBox value={'A'} />
				</div>
				<textarea
					name={`option_A`}
					id={`option_A`}
					value={_formData.option_A}
					className="top-10"></textarea>
				{errors.option_A && <div className=" error">{errors.option_A}</div>}
				<ImageInputComp label="Option A image" inputFor="option_A" />
			</div>

			<hr />

			<div className="flex flex-col gap-3 relative">
				<div className="flex items-center gap-2">
					<label htmlFor="option_B" className="question-option !top-[-3rem]">
						Option B
					</label>

					<AnswerOptionRadioBox value={'B'} />
				</div>
				<textarea
					name={`option_B`}
					id={`option_B`}
					value={_formData.option_B}
					className="top-10"></textarea>
				{errors.option_B && <div className=" error">{errors.option_B}</div>}
				<ImageInputComp label="Option B image" inputFor="option_B" />
			</div>

			<hr />

			<div className="flex flex-col gap-3 relative">
				<div className="flex items-center gap-2">
					<label htmlFor="option_C" className="question-option !top-[-3rem]">
						Option C
					</label>

					<AnswerOptionRadioBox value={'C'} />
				</div>
				<textarea
					name={`option_C`}
					id={`option_C`}
					value={_formData.option_C}
					className="top-10"></textarea>
				{errors.option_C && <div className=" error">{errors.option_C}</div>}
				<ImageInputComp label="Option C image" inputFor="option_C" />
			</div>

			<hr />

			<div className="flex flex-col gap-3 relative">
				<div className="flex items-center gap-2">
					<label htmlFor="option_D" className="question-option !top-[-3rem]">
						Option D
					</label>

					<AnswerOptionRadioBox value={'D'} />
				</div>
				<textarea
					name={`option_D`}
					id={`option_D`}
					value={_formData.option_D}
					className="top-10"></textarea>
				{errors.option_D && <div className=" error">{errors.option_D}</div>}
				<ImageInputComp label="Option D image" inputFor="option_D" />
			</div>

			<hr />

			{showNewInputField ? (
				<>
					<div className="flex flex-col gap-3 relative">
						<div className="flex gap-2 items-center">
							<label
								htmlFor="option_E"
								className="question-option !top-[-3rem]">
								Option E
							</label>

							<AnswerOptionRadioBox value={'E'} />
						</div>
						<textarea
							name={`option_E`}
							id={`option_E`}
							value={_formData.option_E}
							className="top-10"></textarea>
						{errors.option_E && (
							<div className="!top-[1rem]">{errors.option_E}</div>
						)}
						<ImageInputComp label="Option E image" inputFor="option_E" />
					</div>

					<CButton
						className="btn--danger w-fit"
						id=""
						onClick={() => {
							window.CKEDITOR?.instances['option_E'].destroy(true);
							dispatch(
								QuestionFormActions.handleInputChange({
									key: 'option_E',
									value: null,
								})
							);
							setShowNewInputField(!showNewInputField);
						}}>
						Remove
					</CButton>

					<hr />
				</>
			) : (
				<CButton
					className="btn--success w-fit"
					id=""
					onClick={() => setShowNewInputField(!showNewInputField)}>
					Add option
				</CButton>
			)}
		</>
	);
}

function ImageInputComp({ label, inputFor }) {
	const { data: _formData } = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();

	const handleImagePaste = (e) => {
		let pasteImageFor = e.currentTarget.attributes['data-image-for'].value;
		let pastedFile = e.clipboardData?.items[0].getAsFile();
		if (!pastedFile) {
			e.preventDefault();
			return false;
		}

		let reader = new FileReader();
		reader.onloadend = function () {
			let _fileB64 = reader.result;
			switch (pasteImageFor) {
				case 'question_content':
					appendImage('question_content', _fileB64);
					break;
				case 'option_A':
					appendImage('option_A', _fileB64);
					break;

				case 'option_B':
					appendImage('option_B', _fileB64);
					break;

				case 'option_C':
					appendImage('option_C', _fileB64);
					break;

				case 'option_D':
					appendImage('option_D', _fileB64);
					break;

				case 'option_E':
					appendImage('option_E', _fileB64);
					break;
			}
		};

		reader.readAsDataURL(pastedFile);
	};

	function appendImage(appendFor, _file) {
		let oldValue = _formData[`${appendFor}`];
		if (!oldValue) {
			oldValue = '';
		}
		dispatch(
			QuestionFormActions.handleInputChange({
				key: `${appendFor}`,
				value: oldValue + ` <p><img src='${_file}'/></p>`,
			})
		);
		setTimeout(() => {
			window.CKEDITOR.instances[`${appendFor}`].setData(_formData.appendFor);
		}, 1);
	}

	return (
		<div className="flex flex-col mt-2 absolute bottom-0 left-0">
			<input
				onPaste={handleImagePaste}
				type="text"
				data-image-for={inputFor}
				className="input-el !w-[15rem]"
				placeholder={`${label} paste image`}
			/>
		</div>
	);
}

function AnswerOptionRadioBox({ value, className }) {
	const dispatch = useDispatch();
	const { data: _formData } = useSelector((state) => state.questionForm);
	const handleOptionChange = (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	return (
		<input
			className={`w-6 h-6 ${className}`}
			type="radio"
			name="correct_option"
			value={value}
			checked={_formData.correct_option == value ? true : false}
			onChange={handleOptionChange}
		/>
	);
}

export default EditOptionsInput;
