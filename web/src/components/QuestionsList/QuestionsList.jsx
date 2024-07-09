import { useEffect, useLayoutEffect, useState } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
	getPostListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import CButton from '../UI/CButton.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import CModal from '../UI/CModal.jsx';
import { FaFloppyDisk } from 'react-icons/fa6';
import { testsSliceActions } from '../../Store/tests-slice.jsx';

const ALL_QUESTION = 'all-question';
const SELECTED_QUESTION = 'selected-question';

function QuestionsList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { test } = useSelector((state) => state.tests);

	const [questionList, setQuestionList] = useState([]);
	const [filteredQuestionList, setFilteredQuestionList] = useState([]);
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
		isEdit,
	} = useSelector((state) => state.questionForm);

	useEffect(() => {
		if (postsList.length === 0) {
			dispatch(getPostListThunk());
		}
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
		setQuestionList([]);
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
		setQuestionList([]);
	}, [_formData.subject_id]);

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
			setQuestionList(data.data);
		});
	}

	useEffect(() => {
		if (!_formData.topic_id && !_formData.subject_id && !_formData.topic_id) {
			return;
		}
		getQuestions();
	}, [_formData.topic_id]);

	const handleAddQuestionToList = (id) => {
		const questionIdx = questionList.findIndex((el) => el.id === id);

		if (questionIdx !== -1) {
			questionList[questionIdx].isAdded = questionList[questionIdx].isAdded
				? 0
				: 1;
		}

		setQuestionList([...questionList]);
		console.log(questionList);
	};

	useEffect(() => {
		let count = 0;
		questionList.forEach((el) => {
			if (el.isAdded == 1) {
				count++;
			}
		});
		dispatch(testsSliceActions.updateTotalQuestionsCount(count));
	}, [questionList]);

	const viewQuestionListChangeHandler = (type) => {
		setShowList(type);
	};

	const createExamHandler = () => {
		dispatch(ModalActions.toggleModal('create-exam-preview-modal'));
	};

	const finalTestSubmitHandler = () => {
		console.log('hereerererer');
		let testQuestions = questionList.filter((el) => el.isAdded);

		let requestData = {
			url: '/api/test/create',
			method: 'POST',
			body: JSON.stringify({
				test,
				testQuestions,
			}),
		};

		sendRequest(requestData, (data) => {
			console.log(data);
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
					<div className="grid grid-cols-5 items-center gap-3">
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

					<div className="grid grid-cols-5 items-center py-3 gap-3">
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

			<div className="container mx-auto flex justify-center gap-4 mt-5">
				<CButton
					className={''}
					onClick={viewQuestionListChangeHandler.bind(null, ALL_QUESTION)}>
					All Questions
				</CButton>
				<CButton
					className={'btn--danger'}
					onClick={viewQuestionListChangeHandler.bind(null, SELECTED_QUESTION)}>
					Question Paper ( {test.total_questions} )
				</CButton>
			</div>

			<div className="container mx-auto mt-6">
				<div>
					{questionList.length >= 1 &&
						showList == ALL_QUESTION &&
						questionList.map((el, idx) => {
							return (
								<AllQuestionsPreview
									el={el}
									idx={idx}
									handleAddQuestionToList={handleAddQuestionToList}
								/>
							);
						})}

					{showList == SELECTED_QUESTION &&
						questionList.map((el, idx) => {
							return (
								el.isAdded == 1 && (
									<SelectedQuestionPreview
										el={el}
										idx={idx}
										handleAddQuestionToList={handleAddQuestionToList}
									/>
								)
							);
						})}
				</div>

				{isLoading && (
					<AiOutlineLoading3Quarters className="animate-spin text-2xl m-3 mx-auto" />
				)}
				{!isLoading && questionList.length === 0 && (
					<p className="text-center text-[#555]">Woops! no questions found!</p>
				)}
			</div>
		</>
	);
}

function CreatePreSubmitView({ test, finalTestSubmitHandler }) {
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
				<CButton onClick={finalTestSubmitHandler}>Submit</CButton>
			</div>
		</CModal>
	);
}

function AllQuestionsPreview({ el, idx, handleAddQuestionToList }) {
	return (
		<div
			className={`border mb-2 h-[10rem] hover:h-full transition-all duration-300 ${
				!el.isAdded ? 'hover:bg-green-400' : ''
			} overflow-y-scroll ${el.isAdded ? 'bg-green-400 ' : 'bg-gray-200 '}`}
			onClick={handleAddQuestionToList.bind(null, el.id)}
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

function SelectedQuestionPreview({ el, idx, handleAddQuestionToList }) {
	return (
		<div
			className={`border mb-2 h-[10rem] hover:h-full transition-all duration-300  overflow-y-scroll `}
			onClick={handleAddQuestionToList.bind(null, el.id)}
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

{
	/* <Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
					{questionList.length >= 1 &&
						questionList.map((el, idx) => {
							return (
								<AccordionItem className="border  mb-1" key={idx} uuid={idx}>
									<AccordionItemHeading
										className={`border-b py-3 bg-gray-200 px-4 ${
											expandedItem == idx ? 'bg-cyan-500' : ''
										}`}>
										<AccordionItemButton>
											<span className="">Question: {el.id}</span>
										</AccordionItemButton>
									</AccordionItemHeading>
									<AccordionItemPanel className="py-3 px-4 text-start">
										<div className="py-3">
											<p className="font-bold text-[#555] mb-4 block text-start">
												Question
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
											<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">
												{el.mqs_ans}
											</span>
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
									</AccordionItemPanel>
								</AccordionItem>
							);
						})}
				</Accordion> */
}
