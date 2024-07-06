import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import {
	QuestionFormActions,
	getBooksListThunk,
	getPostListThunk,
	getPublicationsListThunk,
	getQuestionNumberThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.js';
import AddBookModal from './AddBook/AddBookModal.js';
import AddPostModal from './AddPost/AddPostModal.js';
import AddPublicationModal from './AddPublication/AddPublicationModal.js';
import AddSubjectModal from './AddSubject/AddSubjectModal.js';
import AddTopicFormModal from './AddTopic/AddTopicModal.js';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.js';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.js';
import ExplanationInput from './ExplanationInput.js';
import OptionsInput from './OptionsInput.js';
import PostListDropdown from './PostListDropdown/PostListDropdown.js';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.js';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.js';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.js';
import QuestionPreview from './QuestionPreview/QuestionPreview.js';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.js';
import SubjectListDropdown from './SubjectListDropdown/SubjectListDropdown.js';
import TopicListDropdown from './TopicListDropdown/TopicListDropdown.js';
import addQuestionFormSchema from './addQuestionFormSchema.js';

const AddQuestionForm = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();
	let { data: _formData } = useSelector((state) => state.questionForm);

	const [showNewInputField, setShowNewInputField] = useState(false);

	useEffect(() => {
		dispatch(getQuestionNumberThunk());
		dispatch(getPostListThunk());
		dispatch(getPublicationsListThunk(sendRequest));
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
	}, [_formData.subject_id]);

	useEffect(() => {
		dispatch(getBooksListThunk(_formData.pub_name, sendRequest));
	}, [_formData.pub_name]);

	const handleSaveQuestion = async (e) => {
		e.preventDefault();
		try {
			await addQuestionFormSchema.validate(_formData, { abortEarly: false });
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
			url: '/questions/add-question',
			method: 'POST',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				toast('Successfully added question');
				dispatch(QuestionFormActions.resetFormData());
			}
		});
	}

	return (
		<>
			<QuestionPreview />
			<AddPostModal />
			<AddSubjectModal />
			<AddTopicFormModal />
			<AddPublicationModal />
			<AddBookModal />
			<div className="container mx-auto mt-6 pb-10 ">
				<form
					id="add-question-form"
					className="grid gap-10"
					onSubmit={handleSaveQuestion}>
					<div className={`bg-white pb-6 sticky top-0 z-30`}>
						<div className="grid grid-cols-4 gap-6 mb-8">
							<PostListDropdown />
							<SubjectListDropdown />
							<TopicListDropdown />
							<DifficultyLevelDropdown />
						</div>
						<div className="grid grid-cols-5 gap-6 ">
							<PublicationNameDropdown />
							<BookNameDropdown />
							<QuestionPgNo />
							<QuestionMonthDropdown />
							<QuestionYearDropdown />
						</div>
					</div>

					<hr />

					<div className="flex flex-col gap-10">
						<OptionsInput
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
		</>
	);
};

export default AddQuestionForm;
