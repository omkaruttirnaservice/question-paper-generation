import { useLayoutEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import QuestionPreview from './QuestionPreview/QuestionPreview.js';

import { toast } from 'react-toastify';
import { QuestionFormActions } from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http.js';
import CButton from '../UI/CButton.js';
import ExplanationInput from './ExplanationInput.js';

import { FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa6';
import EditOptionsInput from './EditOptionsInput.js';
import editQuestionFormSchema from './editQuestionFormSchema.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditQuestionForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useHttp();
	let { data: _formData, isEdit } = useSelector((state) => state.questionForm);

	const [showNewInputField, setShowNewInputField] = useState(false);

	useLayoutEffect(() => {
		if (!isEdit) {
			navigate('/questions-list');
		}
	}, [isEdit]);

	const handleUpdateQuestion = async (e) => {
		e.preventDefault();
		try {
			await editQuestionFormSchema.validate(_formData, { abortEarly: false });
			postQuestionData();

			dispatch(QuestionFormActions.setErrors({}));
		} catch (error) {
			const errorsObj = {};
			error.inner.forEach((el) => {
				errorsObj[el.path] = el.message;
			});
			dispatch(QuestionFormActions.setErrors(errorsObj));
		}
	};

	async function postQuestionData() {
		let reqData = {
			url: '/questions/update-question',
			method: 'PUT',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				Swal.fire({
					title: 'Success!',
					text: 'Question has been updated.',
					icon: 'success',
				});
				// dispatch(QuestionFormActions.resetFormData());
				setTimeout(() => {
					dispatch(QuestionFormActions.setEditingFalse());
				}, 1);
			}
		});
	}

	return (
		<>
			<div className="container mx-auto sticky top-0 bg-white z-50">
				<div className="flex items-center py-3 gap-3">
					<p>Edit data for</p>
					<FaAngleRight />
					<span className="underline">Post Name</span>
					<FaAngleDoubleRight />
					<span className="underline">{_formData.subject_name}</span>
					<FaAngleDoubleRight />
					<span className="underline">{_formData.topic_name}</span>
				</div>

				<div className="flex justify-end py-3 items-center gap-3">
					[<span>{_formData.pub_name}</span>] [
					<span>{_formData.book_name}</span>] [
					<span>Pg. No. {_formData.pg_no}</span>]
				</div>
			</div>

			<div className="container mx-auto mt-6 pb-10 ">
				<form
					id="add-question-form"
					className="grid gap-10"
					onSubmit={handleUpdateQuestion}>
					<hr />

					<div className="flex flex-col gap-10">
						<EditOptionsInput
							showNewInputField={showNewInputField}
							setShowNewInputField={setShowNewInputField}
						/>
					</div>

					<hr />

					<ExplanationInput />

					<CButton
						className="w-[10%] flex justify-center items-center"
						type="submit"
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Save
					</CButton>
				</form>
			</div>
			<QuestionPreview />
		</>
	);
};

export default EditQuestionForm;
