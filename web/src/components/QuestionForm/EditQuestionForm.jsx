import { useEffect, useState } from 'react';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import { useDispatch, useSelector } from 'react-redux';

import { FaAngleRight, FaGripLinesVertical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
	EditQuestionFormActions,
	getBooksListThunk,
	getPublicationsListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { getPublishedTestQuestionsListThunk, getTestQuestionsListThunk } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.jsx';
import AddBookModal from './AddBook/AddBookModal.jsx';
import AddPublicationModal from './AddPublication/AddPublicationModal.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import EditQuestionExplanationInput from './EditQuestionExplanationInput.jsx';
import EditQuestionOptionsInput from './EditQuestionFormOptions.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';
import editQuestionFormSchemaYUP from './editQuestionFormSchemaYUP.jsx';
import { EDIT_QUESTION_OF_GENERATED_TEST, EDIT_QUESTION_OF_PUBLISHED_TEST } from '../Utils/Constants.jsx';

const EditAddQuestionForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useHttp();
	let { data: _formData, edit_test_type } = useSelector((state) => state.questionForm);
	const { previewTestDetails, previewPublishedTestDetails } = useSelector((state) => state.tests);

	const [showNewInputField, setShowNewInputField] = useState(false);

	useEffect(() => {
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

	const handleUpdateQuestion = async (e) => {
		e.preventDefault();
		try {
			await editQuestionFormSchemaYUP.validate(_formData, {
				abortEarly: false,
			});
			postQuestionData();

			dispatch(EditQuestionFormActions.setErrors({}));
		} catch (error) {
			const errorsObj = {};
			error.inner.forEach((el) => {
				errorsObj[el.path] = el.message;
			});
			dispatch(EditQuestionFormActions.setErrors(errorsObj));
		}
	};

	async function postQuestionData() {
		let reqData = {
			url: SERVER_IP + '/api/test/update-test-question',
			method: 'PUT',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				toast('Successfully updated question');
				Swal.fire({
					title: 'Success',
					text: 'Updated question details',
					icon: 'success',
				});

				dispatch(ModalActions.toggleModal('edit-que-modal'));

				if (edit_test_type == EDIT_QUESTION_OF_PUBLISHED_TEST) {
					dispatch(getPublishedTestQuestionsListThunk(previewPublishedTestDetails.test_id, sendRequest, navigate));
				}

				if (edit_test_type == EDIT_QUESTION_OF_GENERATED_TEST) {
					dispatch(getTestQuestionsListThunk(previewTestDetails.test_id, sendRequest, navigate));
				}
				dispatch(EditQuestionFormActions.resetFormData());
			}
		});
	}

	return (
		<>
			<AddPublicationModal />
			<AddBookModal />
			<div className="container mx-auto">
				<form id="add-question-form" className="grid gap-6" onSubmit={handleUpdateQuestion}>
					<div className={`bg-white sticky top-0 z-30`}>
						<div className="container mx-auto mb-3">
							<div className="bg-cyan-100  border-t-sky-700 border-t-4 p-3">
								<div className="grid grid-cols-4 items-center gap-1">
									<div className="flex items-center gap-1">
										<FaGripLinesVertical />
										<p>Subject Name</p>
										<FaAngleRight />
										<span className="underline">{_formData.subject_name}</span>
									</div>

									<div className="flex items-center gap-1">
										<FaGripLinesVertical />
										<p>Topic Name</p>
										<FaAngleRight />
										<span className="underline">{_formData.topic_name}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="grid grid-cols-5 gap-3">
							<DifficultyLevelDropdown />
							<PublicationNameDropdown />
							<BookNameDropdown />
							<QuestionPgNo />
							<QuestionMonthDropdown />
							<QuestionYearDropdown />
						</div>
					</div>

					<hr />

					<div className="flex flex-col gap-3">
						<EditQuestionOptionsInput showNewInputField={showNewInputField} setShowNewInputField={setShowNewInputField} />
					</div>

					<hr />

					<EditQuestionExplanationInput />

					<CButton className="w-[10%] flex justify-center items-center" type="submit" isLoading={useSelector((state) => state.loader.isLoading)}>
						Update
					</CButton>
				</form>
			</div>
		</>
	);
};

export default EditAddQuestionForm;
