import { useEffect, useLayoutEffect, useState } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
	getPostListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
	QuestionFormActions,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';

const ALL_QUESTION = 'all-question';
const SELECTED_QUESTION = 'selected-question';

function QuestionsList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { test, selectedQuestionsList } = useSelector((state) => state.tests);

	const [temp_QuestionList, set_temp_QuestionList] = useState([]);
	const [showList, setShowList] = useState(ALL_QUESTION);

	const { isLoading } = useSelector((state) => state.loader);

	const { sendRequest } = useHttp();

	useLayoutEffect(() => {
		if (!test.test_name) {
			navigate('/dashboard');
		}
	});

	const {
		data: _formData,
		postsList,
		subjectsList,
		topicsList,
	} = useSelector((state) => state.questionForm);

	useEffect(() => {
		if (postsList.length === 0) {
			dispatch(getPostListThunk());
		}
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
		set_temp_QuestionList([]);
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
		set_temp_QuestionList([]);

		let selectedSubject = subjectsList.filter(
			(el) => el.id == _formData.subject_id
		);
		if (selectedSubject.length !== 0) {
			dispatch(QuestionFormActions.setSubjectName(selectedSubject[0].mtl_name));
		}
	}, [_formData.subject_id]);

	useEffect(() => {
		if (!_formData.topic_id && !_formData.subject_id && !_formData.topic_id) {
			return;
		}

		let selectedTopic = topicsList.filter((el) => el.id == _formData.topic_id);
		if (selectedTopic.length !== 0) {
			dispatch(QuestionFormActions.setTopicName(selectedTopic[0].topic_name));
		}

		getQuestions();
	}, [_formData.topic_id]);

	async function getQuestions() {
		let reqData = {
			url: '/api/questions/list',
			method: 'POST',
			body: JSON.stringify({
				post_id: _formData.post_id,
				subject_id: _formData.subject_id,
				topic_id: _formData.topic_id,
			}),
		};
		sendRequest(reqData, (data) => {
			set_temp_QuestionList(data.data);
		});
	}

	const handleAddQuestionToList = (_addEl) => {
		let insertArray = [...selectedQuestionsList];
		let _index = insertArray.findIndex((el) => el.id == _addEl.id);

		if (_index != -1) {
			insertArray.splice(_index, 1);
		} else {
			insertArray.push(_addEl);
		}

		dispatch(testsSliceActions.setSelectedQuestionsList(insertArray));
		dispatch(testsSliceActions.updateTotalQuestionsCount());
	};

	const viewQuestionListChangeHandler = (type) => {
		setShowList(type);
	};

	const createExamHandler = () => {
		dispatch(ModalActions.toggleModal('create-exam-preview-modal'));
	};

	const finalTestSubmitHandler = () => {
		let requestData = {
			url: '/api/test/create',
			method: 'POST',
			body: JSON.stringify({
				test,
				testQuestions: selectedQuestionsList,
				_formData,
			}),
		};

		sendRequest(requestData, ({ success, data }) => {
			if (success) {
				Swal.fire({
					title: 'Success!',
					text: data,
					icon: 'success',
				});

				dispatch(ModalActions.toggleModal('create-exam-preview-modal'));
				navigate('/dashboard');
			}
		});
	};

	return (
		<>
			<CreatePreSubmitView
				test={test}
				finalTestSubmitHandler={finalTestSubmitHandler}
			/>
			<div className="container mx-auto mt-6">
				<div className="bg-cyan-100  border-t-sky-700 border-t-4 p-3">
					<div className="grid grid-cols-4 items-center gap-1">
						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Test Type</p>
							<FaAngleRight />
							<span className="underline">{test.test_creation_type}</span>
						</div>

						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Test Name</p>
							<FaAngleRight />
							<span className="underline">{test.test_name}</span>
						</div>

						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Test Duration</p>
							<FaAngleRight />
							<span className="underline">{test.test_duration}</span>
						</div>

						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Marks Per Question</p>
							<FaAngleRight />
							<span className="underline">{test.marks_per_question}</span>
						</div>
					</div>

					<div className="grid grid-cols-4 items-center py-3 gap-1">
						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Total posts</p>
							<FaAngleRight />
							<span className="underline">{postsList.length}</span>
						</div>

						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Total Subjets</p>
							<FaAngleRight />
							<span className="underline">{subjectsList.length}</span>
						</div>

						<div className="flex items-center gap-1">
							<FaGripLinesVertical />
							<p>Total Topics</p>
							<FaAngleRight />
							<span className="underline">{topicsList.length}</span>
						</div>
					</div>

					<div className="grid grid-cols-5 gap-3 ">
						<PostListDropdown isShowAddNewBtn={false} />
						<SubjectListDropdown isShowAddNewBtn={false} />
						<TopicListDropdown isShowAddNewBtn={false} />

						{test.total_questions >= 1 && (
							<CButton
								className={'btn--success w-fit h-fit self-end'}
								onClick={createExamHandler}>
								Create Exam
							</CButton>
						)}
					</div>
				</div>
			</div>

			{temp_QuestionList.length >= 1 && (
				<div className="container mx-auto flex justify-center gap-4 mt-5">
					<CButton
						className={''}
						onClick={viewQuestionListChangeHandler.bind(null, ALL_QUESTION)}>
						All Questions
					</CButton>
					<CButton
						className={'btn--danger'}
						onClick={viewQuestionListChangeHandler.bind(
							null,
							SELECTED_QUESTION
						)}>
						Question Paper ( {selectedQuestionsList.length} )
					</CButton>
				</div>
			)}

			<div className="container mx-auto mt-6">
				<div>
					{temp_QuestionList.length >= 1 &&
						showList == ALL_QUESTION &&
						temp_QuestionList.map((el, idx) => {
							return (
								<AllQuestionsPreview
									el={el}
									idx={idx}
									handleAddQuestionToList={handleAddQuestionToList}
								/>
							);
						})}

					{showList == SELECTED_QUESTION &&
						selectedQuestionsList.map((el, idx) => {
							return <SelectedQuestionPreview el={el} idx={idx} />;
						})}
				</div>

				{isLoading && (
					<AiOutlineLoading3Quarters className="animate-spin text-2xl m-3 mx-auto" />
				)}
				{!isLoading && temp_QuestionList.length === 0 && (
					<p className="text-center text-[#555]">Woops! no questions found!</p>
				)}

				{!isLoading &&
					selectedQuestionsList.length === 0 &&
					showList == SELECTED_QUESTION && (
						<p className="text-center text-[#555] cursor-pointer">
							Woops! no questions found!{' '}
							<span
								className="underline text-blue-500"
								onClick={() => {
									setShowList(ALL_QUESTION);
								}}>
								Add Question
							</span>
						</p>
					)}
			</div>
		</>
	);
}

function CreatePreSubmitView({ test, finalTestSubmitHandler }) {
	const { isLoading } = useSelector((state) => state.loader);
	return (
		<CModal id="create-exam-preview-modal" title="Create Exam">
			<table className="w-full">
				<tbody>
					<tr>
						<td className="border p-2" width="50%">
							Name of exam
						</td>
						<td className="border p-2" width="50%">
							{test.test_name}
						</td>
					</tr>
					<tr>
						<td className="border p-2" width="50%">
							Exam duration
						</td>
						<td className="border p-2" width="50%">
							{test.test_duration}
						</td>
					</tr>

					<tr>
						<td className="border p-2" width="50%">
							Marks per question
						</td>
						<td className="border p-2" width="50%">
							{test.marks_per_question}
						</td>
					</tr>

					<tr>
						<td className="border p-2" width="50%">
							Total questions
						</td>
						<td className="border p-2" width="50%">
							{test.total_questions}
						</td>
					</tr>
				</tbody>
			</table>
			<div className="flex justify-center mt-4">
				<CButton isLoading={isLoading} onClick={finalTestSubmitHandler}>
					Submit
				</CButton>
			</div>
		</CModal>
	);
}

function AllQuestionsPreview({ el, idx, handleAddQuestionToList }) {
	const { selectedQuestionsList } = useSelector((state) => state.tests);
	const isAdded = (id) => {
		return selectedQuestionsList.findIndex((el) => el.id == id);
	};
	return (
		<div
			className={`border mb-2 h-[10rem] hover:h-full hover:bg-green-300 transition-all duration-300 overflow-y-scroll ${
				isAdded(el.id) != -1 ? 'bg-green-300' : ''
			}`}
			onClick={handleAddQuestionToList.bind(null, el)}
			key={idx}>
			<div className="py-3 px-4 text-start">
				<div className="py-3">
					<p className="font-bold text-[#555] mb-4 block text-start">
						Q. {el.id})
					</p>
					<p
						className="text-start"
						dangerouslySetInnerHTML={{
							__html: el.mqs_question,
						}}></p>
				</div>

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option A
					</span>

					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_one,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option B
					</span>

					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_two,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option C
					</span>
					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_three,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option D
					</span>
					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_four,
						}}></p>
				</div>

				<hr />

				{el.mqs_opt_five && (
					<div className="py-3">
						<span className="font-bold text-[#555] mb-4 block text-start">
							Option E
						</span>
						<p
							dangerouslySetInnerHTML={{
								__html: el.mqs_opt_five,
							}}></p>
					</div>
				)}

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 me-3">
						Correct Option
					</span>
					<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">{el.mqs_ans}</span>
				</div>

				<hr />

				{el.mqs_solution && (
					<div className="py-3">
						<span className="font-bold text-[#555] my-4 block text-start">
							Solution
						</span>
						<p
							className="text-start"
							dangerouslySetInnerHTML={{
								__html: el.mqs_solution,
							}}></p>
					</div>
				)}
			</div>
		</div>
	);
}

function SelectedQuestionPreview({ el, idx }) {
	return (
		<div
			className={`border mb-2 h-[10rem] hover:h-full transition-all duration-300  overflow-y-scroll `}
			key={idx}>
			<div className="py-3 px-4 text-start">
				<div className="py-3">
					<p className="font-bold text-[#555] mb-4 block text-start">
						Q. {el.id})
					</p>
					<p
						className="text-start"
						dangerouslySetInnerHTML={{
							__html: el.mqs_question,
						}}></p>
				</div>

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option A
					</span>

					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_one,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option B
					</span>

					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_two,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option C
					</span>
					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_three,
						}}></p>
				</div>

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 block text-start">
						Option D
					</span>
					<p
						dangerouslySetInnerHTML={{
							__html: el.mqs_opt_four,
						}}></p>
				</div>

				<hr />

				{el.mqs_opt_five && (
					<div className="py-3">
						<span className="font-bold text-[#555] mb-4 block text-start">
							Option E
						</span>
						<p
							dangerouslySetInnerHTML={{
								__html: el.mqs_opt_five,
							}}></p>
					</div>
				)}

				<hr />

				<div className="py-3">
					<span className="font-bold text-[#555] mb-4 me-3">
						Correct Option
					</span>
					<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">{el.mqs_ans}</span>
				</div>

				<hr />

				{el.mqs_solution && (
					<div className="py-3">
						<span className="font-bold text-[#555] my-4 block text-start">
							Solution
						</span>
						<p
							className="text-start"
							dangerouslySetInnerHTML={{
								__html: el.mqs_solution,
							}}></p>
					</div>
				)}
			</div>
		</div>
	);
}

export default QuestionsList;
