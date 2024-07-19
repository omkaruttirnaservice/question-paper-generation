import { useEffect, useLayoutEffect, useState } from 'react';
import { BiReset } from 'react-icons/bi';
import { CiViewList } from 'react-icons/ci';
import { FaEdit, FaGripLinesVertical, FaPlus, FaTrash } from 'react-icons/fa';

import './QuestionsListAutoTest.css';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import EditQuestionFormSlice, { EditQuestionFormActions, getPostListThunk, getSubjectsListThunk } from '../../Store/edit-question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import InfoContainer from '../UI/InfoContainer.jsx';
import Spinner from '../UI/Spinner.jsx';
import { H3 } from '../UI/Headings.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';

function QuestionsListAutoTest() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useHttp();

	const { test, topicList, selectedTopicList } = useSelector((state) => state.tests);

	const { data: _formData, postsList, subjectsList, topicsList } = useSelector((state) => state.questionForm);
	const { isLoading } = useSelector((state) => state.loader);

	useLayoutEffect(() => {
		if (!test.test_name) {
			navigate('/dashboard');
		}
	});

	useEffect(() => {
		if (postsList.length === 0) {
			dispatch(getPostListThunk());
		}
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
		dispatch(testsSliceActions.setTopicList([]));
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(testsSliceActions.setTopicList([]));

		getTopicAndQuestionCount(_formData.subject_id);
		let selectedSubject = subjectsList.filter((el) => el.id == _formData.subject_id);
		if (selectedSubject.length !== 0) {
			dispatch(EditQuestionFormActions.setSubjectName(selectedSubject[0].mtl_name));
		}
	}, [_formData.subject_id]);

	const getTopicAndQuestionCount = (subjectId) => {
		let reqData = {
			url: '/api/get-topic-list-and-question-count',
			method: 'POST',
			body: JSON.stringify({
				subjectId,
			}),
		};
		sendRequest(reqData, ({ data }) => {
			dispatch(testsSliceActions.setTopicList(data));
		});
	};

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

		dispatch(testsSliceActions.setTopicList(updatedList));
	};

	const questionCountChangeHandler = (e) => {
		const { value, name } = e.target;

		if (isNaN(value)) {
			e.target.value = '';
			return false;
		}

		let __topicListCopy = topicList.map((el) => el);
		const topicIdx = __topicListCopy.findIndex((el) => +el.id === +name);
		if (topicIdx === -1) return false;

		const maxQuestionCount = __topicListCopy[topicIdx].question_count;

		if (+value > maxQuestionCount) {
			e.target.value = maxQuestionCount.toString();
			__topicListCopy[topicIdx] = {
				...__topicListCopy[topicIdx],
				selectedCount: maxQuestionCount,
			};
		} else {
			__topicListCopy[topicIdx] = {
				...__topicListCopy[topicIdx],
				selectedCount: parseInt(value),
			};
		}

		dispatch(testsSliceActions.setTopicList([...__topicListCopy]));
	};

	const handleAddToTestChart = () => {
		let isValid = validateQuestionsSelection();
		if (!isValid) return false;

		let _editSubjectName = subjectsList.filter((el) => el.id == topicList[0].subject_id);
		_editSubjectName = _editSubjectName[0].mtl_name;

		let testChartAddData = {
			_postName: _formData.post_name,
			_subjectName: _editSubjectName,
			_topicsList: topicList.filter((el) => el?.selectedCount >= 1),
		};

		testChartAddData['_totalQuestionsCount'] = testChartAddData._topicsList.reduce((sum, el) => sum + el.selectedCount, 0);

		let updatedList = [...selectedTopicList];
		let isExsistsIndex = updatedList.findIndex((el) => el._subjectName == testChartAddData._subjectName);

		if (isExsistsIndex != -1) {
			updatedList.splice(isExsistsIndex, 1);
		}
		updatedList.push(testChartAddData);

		dispatch(testsSliceActions.setSelectedTopicList(updatedList));
		dispatch(testsSliceActions.setTopicList([]));

		updateTotalQuestionsCount(updatedList);
	};
	function updateTotalQuestionsCount(list) {
		console.log(list, '==list==');
		let count = 0;
		list.forEach((item1) => {
			item1._topicsList.forEach((el) => {
				count += el.selectedCount;
			});
		});
		console.log(count, '==count==');
		dispatch(testsSliceActions.updateTotalQuestionsCount_AUTO_TEST(count));
	}

	const handleRemoveFromEamChart = async ({ idx, el }) => {
		let isConfirm = await confirmDialouge({
			title: `Are you sure?`,
			text: `Do you want to delete the topic ${el._subjectName}`,
		});
		if (!isConfirm) return false;

		Swal.fire('Deleted!', '', 'success');

		let updatedList = [...selectedTopicList];

		updatedList.splice(idx, 1);

		dispatch(testsSliceActions.setSelectedTopicList(updatedList));

		updateTotalQuestionsCount(updatedList);
	};

	const handleEditFromExamChart = async ({ idx, el }) => {
		if (!el) {
			Swal.fire({
				title: 'Warning!',
				text: 'Please select topic to edit details from exam chart',
				icon: 'warning',
			});
			return false;
		}
		const subjectId = el._topicsList[0].subject_id;
		const topicsListForEdit = el._topicsList;

		let reqData = {
			url: '/api/get-topic-list-and-question-count',
			method: 'POST',
			body: JSON.stringify({
				subjectId,
			}),
		};
		sendRequest(reqData, ({ data }) => {
			let updatedTopicList = [...data];
			topicsListForEdit.forEach((item1) => {
				let index = updatedTopicList.findIndex((item2) => item2.id == item1.id);
				if (index !== -1) updatedTopicList[index] = item1;
			});

			dispatch(testsSliceActions.setTopicList(updatedTopicList));
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

	const handleResetExam = async () => {
		const isConfirm = await confirmDialouge({
			title: 'Are you sure?',
			text: 'Do you want to reset exam?',
		});

		if (!isConfirm) return false;
		dispatch(EditQuestionFormActions.reset());
		dispatch(testsSliceActions.reset());
		dispatch(ModalActions.toggleModal('create-test-modal-auto'));
	};

	const finalTestSubmitHandler = async () => {
		console.log(selectedTopicList, '==selectedTopicList==');
		const __allTopicListToCreateExam = [];

		selectedTopicList.forEach((item1) => {
			__allTopicListToCreateExam.push(...item1._topicsList);
		});

		console.log(__allTopicListToCreateExam, '==__allTopicListToCreateExam==');

		const isConfirm = await confirmDialouge({
			title: 'Are you sure?',
			text: 'Do you want to create test?',
		});
		if (!isConfirm) return false;
		let rD = {
			url: '/api/test/v2/create-auto',
			method: 'POST',
			body: JSON.stringify({
				test: test,
				topicList: __allTopicListToCreateExam,
			}),
		};
		sendRequest(rD, (data) => {
			if (data.success == 1) {
				Swal.fire('Success', 'Test has been generated!');
				dispatch(EditQuestionFormActions.reset());
				dispatch(testsSliceActions.reset());
				navigate('/tests-list');
			}
		});
	};

	useEffect(() => {
		return () => {
			dispatch(testsSliceActions.reset());
			dispatch(EditQuestionFormActions.reset());
		};
	}, []);

	return (
		<>
			<CreatePreSubmitView test={test} finalTestSubmitHandler={finalTestSubmitHandler} />
			<div className="container mx-auto mt-6 shadow-sm">
				<InfoContainer>
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
					</div>
				</InfoContainer>
			</div>

			<InfoContainer>
				<div className="grid grid-cols-2 mb-4">
					<SubjectListDropdown isShowAddNewBtn={false} className={'w-fit'} />

					{_formData.subject_id && (
						<CButton icon={<BiReset />} className={'btn--danger w-fit justify-self-end h-fit self-end mb-1'} onClick={handleResetExam}>
							Reset Exam
						</CButton>
					)}
				</div>

				{topicList.length >= 1 && (
					<div className="grid grid-cols-1 gap-2">
						<form action="" className="">
							<table className="w-full shadow-sm" id="questions-list-table">
								<thead>
									<tr className="bg-cyan-500 text-white">
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
												<tr className="border hover:bg-gray-50">
													<td className="p-2 text-center ">{idx + 1}</td>
													<td className="p-2 text-center" width={'5%'}>
														<input type="checkbox" name={el.id} value="" data-id={el.id} onChange={topicListCheckboxHandler} />
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
						</form>

						<CButton
							icon={<CiViewList />}
							className={'btn--danger h-fit w-fit justify-self-end'}
							onClick={handleAddToTestChart}
							isLoading={isLoading}>
							Add to test chart
						</CButton>
					</div>
				)}

				{isLoading && <Spinner />}
				{!isLoading && topicList.length === 0 && <p className="text-center text-[#555]">Woops! no questions found!</p>}
			</InfoContainer>

			{/* TEST chart */}
			{selectedTopicList.length >= 1 && (
				<InfoContainer>
					<div className="grid grid-cols-2 mb-4">
						<H3>Exam Chart</H3>
						{_formData.subject_id && (
							<CButton icon={<FaPlus />} className={'btn--success w-fit justify-self-end h-fit self-end mb-1'} onClick={finalTestSubmitHandler}>
								Create Exam
							</CButton>
						)}
					</div>
					<div className="grid grid-cols-1 gap-2">
						<form action="" className="">
							<table className="w-full shadow-sm" id="questions-list-table">
								<thead>
									<tr className="bg-cyan-500 text-white text-center">
										<td className="p-2 text-center">#</td>
										<td className="p-2">Test Class</td>
										<td className="p-2">Topic Name</td>
										<td className="p-2">Section For Test</td>
										<td className="p-2">Questions</td>
										<td className="p-2">Edit|Remove</td>
									</tr>
								</thead>
								<tbody>
									{selectedTopicList.map((el, idx) => {
										return (
											<tr className="border hover:bg-gray-50 text-center">
												<td className="p-2 text-center ">{idx + 1}</td>
												<td className="p-2 text-center">-</td>
												<td className="p-2">{el._subjectName}</td>
												<td className="p-2">{el._topicsList.length}</td>
												<td>{el._totalQuestionsCount}</td>
												<td>
													<div className="flex justify-center gap-2">
														<CButton
															icon={<FaEdit />}
															className={'btn--success h-fit w-fit justify-self-end'}
															onClick={handleEditFromExamChart.bind(null, { idx, el })}></CButton>
														<CButton
															icon={<FaTrash />}
															className={'btn--danger h-fit w-fit justify-self-end'}
															onClick={handleRemoveFromEamChart.bind(null, { idx, el })}></CButton>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</form>
					</div>
				</InfoContainer>
			)}
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

export default QuestionsListAutoTest;
