import { useEffect, useLayoutEffect, useState } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

import './QuestionsListAutoTest.css';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
	getPostListThunk,
	getSubjectsListThunk,
	QuestionFormActions,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';

function QuestionsListAutoTest() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useHttp();

	const { test } = useSelector((state) => state.tests);
	const { isLoading } = useSelector((state) => state.loader);
	const [topicList, setTopicList] = useState([]);

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
		setTopicList([]);
	}, [_formData.post_id]);

	useEffect(() => {
		setTopicList([]);

		getTopicAndQuestionCount(_formData.subject_id);

		let selectedSubject = subjectsList.filter(
			(el) => el.id == _formData.subject_id
		);
		if (selectedSubject.length !== 0) {
			dispatch(QuestionFormActions.setSubjectName(selectedSubject[0].mtl_name));
		}
	}, [_formData.subject_id]);

	function getTopicAndQuestionCount(subjectId) {
		let reqData = {
			url: '/api/get-topic-list-and-question-count',
			method: 'POST',
			body: JSON.stringify({
				subjectId,
			}),
		};
		sendRequest(reqData, ({ data }) => {
			setTopicList(data);
		});
	}

	const topicListCheckboxHandler = (e) => {
		const isChecked = e.target.checked;
		const topicId = parseInt(e.target.dataset.id);

		const updatedList = topicList.map((topic) => {
			if (topic.id === topicId) {
				return {
					...topic,
					isChecked: isChecked,
					selectedCount: isChecked ? topic.selectedCount : 0,
				};
			}
			return topic;
		});

		setTopicList(updatedList);
	};

	const questionCountChangeHandler = (e) => {
		const { value, name } = e.target;

		if (isNaN(value)) {
			e.target.value = '';
			return false;
		}

		const topicIdx = topicList.findIndex((el) => +el.id === +name);
		if (topicIdx === -1) return false;

		const maxQuestionCount = topicList[topicIdx].question_count;

		if (+value > maxQuestionCount) {
			e.target.value = maxQuestionCount.toString();
		}

		topicList[topicIdx].selectedCount = parseInt(e.target.value);

		setTopicList([...topicList]);
	};

	const finalTestSubmitHandler = () => {
		let isValid = validateQuestionsSelection();
		if (!isValid) return false;

		let requestData = {
			url: '/api/test/create-auto',
			method: 'POST',
			body: JSON.stringify({
				test,
				topicList: topicList.filter((el) => el?.selectedCount >= 1),
			}),
		};

		sendRequest(requestData, ({ success, data }) => {
			if (success) {
				Swal.fire({
					title: 'Success!',
					text: data,
					icon: 'success',
				});
				navigate('/dashboard');

				// dispatch(ModalActions.toggleModal('create-exam-preview-modal'));
			}
		});
	};

	const validateQuestionsSelection = (cb) => {
		let isValid = false;
		let checkedCount = 0;

		for (let i = 0; i < topicList.length; i++) {
			let el = topicList[i];
			if (el.isChecked) {
				checkedCount += 1;

				if (el.selectedCount == 0 || !el.selectedCount) {
					Swal.fire({
						title: 'Oops!',
						text: 'Please enter total questions',
						icon: 'warning',
					});
					return false;
				}
				isValid = true;
			}
			el = null;
		}

		if (checkedCount == 0) {
			Swal.fire({
				title: 'Oops!',
				text: 'Please select question',
				icon: 'warning',
			});
			isValid = false;
		}

		return isValid;
	};

	return (
		<>
			{/* <CreatePreSubmitView
				test={test}
				finalTestSubmitHandler={finalTestSubmitHandler}
			/> */}
			<div className="container mx-auto mt-6">
				<div className="bg-cyan-100  border-t-sky-700 border-t-4 p-3">
					<div className="grid grid-cols-5 items-center gap-3">
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
					</div>
				</div>
			</div>

			<div className="container mx-auto mt-6">
				<form action="">
					<table className="w-full" id="questions-list-table">
						<thead>
							<tr className="bg-blue-300">
								<td className="p-2 text-center">#</td>
								<td className="p-2">Check/Unckeck</td>
								<td className="p-2">Section Name</td>
								<td className="p-2">Select Question</td>
								<td className="p-2">Question</td>
							</tr>
						</thead>
						<tbody>
							{topicList.length >= 1 &&
								topicList.map((el, idx) => {
									return (
										<tr className="border-b hover:bg-gray-100">
											<td className="p-2 text-center">{idx + 1}</td>
											<td className="p-2 text-center" width={'5%'}>
												<input
													type="checkbox"
													name={el.id}
													value=""
													data-id={el.id}
													onChange={topicListCheckboxHandler}
												/>
											</td>
											<td className="p-2">{el.topic_name}</td>
											<td className="p-2">{el.question_count}</td>
											<td>
												<input
													type=""
													className="border w-16 p-1"
													name={el.id}
													value={el.selectedCount ? el.selectedCount : 0}
													onChange={questionCountChangeHandler}
													disabled={!el.isChecked}
												/>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
					{_formData.subject_id && (
						<CButton
							className={'btn--success mt-6'}
							onClick={finalTestSubmitHandler}
							isLoading={isLoading}>
							Create Exam
						</CButton>
					)}
				</form>

				{isLoading && (
					<AiOutlineLoading3Quarters className="animate-spin text-2xl m-3 mx-auto" />
				)}
				{!isLoading && topicList.length === 0 && (
					<p className="text-center text-[#555]">Woops! no questions found!</p>
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

export default QuestionsListAutoTest;

{
	/* <Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
					{topicList.length >= 1 &&
						topicList.map((el, idx) => {
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
