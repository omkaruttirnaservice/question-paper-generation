import { useEffect, useState } from 'react';
import { BiReset } from 'react-icons/bi';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaGripLinesVertical } from 'react-icons/fa';

import { FaTrash } from 'react-icons/fa';

import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
	getPostListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http.js';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.js';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.js';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.js';

import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from 'react-accessible-accordion';
import Swal from 'sweetalert2';
function TrashQuestionsList() {
	const dispatch = useDispatch();

	const {
		data: _formData,
		postsList,
		subjectsList,
		topicsList,
	} = useSelector((state) => state.questionForm);
	const { isLoading } = useSelector((state) => state.loader);

	const { sendRequest } = useHttp();

	useEffect(() => {
		if (postsList.length === 0) {
			dispatch(getPostListThunk());
		}
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
	}, [_formData.subject_id]);

	const [questionList, setQuestionList] = useState([]);

	async function getQuestions() {
		let reqData = {
			url: '/questions/list-trash',
			method: 'POST',
			body: JSON.stringify({
				post_id: _formData.post_id,
				subject_id: _formData.subject_id,
				topic_id: _formData.topic_id,
			}),
		};
		sendRequest(reqData, (data) => {
			setQuestionList(data.data);
			console.log(data, '---');
		});
	}

	useEffect(() => {
		if (!_formData.topic_id && !_formData.subject_id && !_formData.topic_id) {
			return;
		}
		getQuestions();
	}, [_formData.topic_id]);

	const handleDeleteQuestion = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'This question will delete permently!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
		}).then((result) => {
			if (result.isConfirmed) {
				confirmDeleteQuestionPermenant(id);
			}
		});
	};

	const confirmDeleteQuestionPermenant = (id) => {
		let reqData = {
			url: '/questions/delete-permenant',
			method: 'DELETE',
			body: JSON.stringify({ questionId: id }),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				setQuestionList(questionList.filter((el) => el.id != id));
				Swal.fire({
					title: 'Deleted!',
					text: 'Question has been removed permenantly.',
					icon: 'success',
				});
			}
		});
	};

	const handleRestoreQuestion = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'Question will restored!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
		}).then((result) => {
			if (result.isConfirmed) {
				confirmRestoreQuestion(id);
			}
		});
	};

	const confirmRestoreQuestion = (id) => {
		let reqData = {
			url: '/questions/restore',
			method: 'DELETE',
			body: JSON.stringify({ questionId: id }),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				setQuestionList(questionList.filter((el) => el.id != id));
				Swal.fire({
					title: 'Successful!',
					text: 'Question has been restored.',
					icon: 'success',
				});
			}
		});
	};

	const [expandedItem, setExpandedItem] = useState(null);
	const handleAccordionChange = (e) => {
		if (e == expandedItem) {
			setExpandedItem(null);
		} else {
			setExpandedItem(e);
		}
	};

	return (
		<>
			<div className="container mx-auto mt-6">
				<div className="grid grid-cols-5 gap-3 mb-6">
					<PostListDropdown isShowAddNewBtn={false} />
					<SubjectListDropdown isShowAddNewBtn={false} />
					<TopicListDropdown isShowAddNewBtn={false} />
				</div>

				<div className="bg-cyan-100 px-4">
					<div className="flex items-center py-3 gap-3">
						<p>Total posts</p>
						<FaAngleRight />
						<span className="underline">{postsList.length}</span>

						<FaGripLinesVertical />
						<p>Total Subjets</p>
						<FaAngleRight />
						<span className="underline">{subjectsList.length}</span>

						<FaGripLinesVertical />
						<p>Total Topics</p>
						<FaAngleRight />
						<span className="underline">{topicsList.length}</span>
					</div>
				</div>
			</div>

			<div className="container mx-auto mt-6">
				{isLoading && (
					<AiOutlineLoading3Quarters className="animate-spin text-2xl m-3 mx-auto" />
				)}
				{!isLoading && questionList.length === 0 && (
					<p className="text-center text-[#555]">Woops! no questions found!</p>
				)}
				<Accordion allowZeroExpanded={true} onChange={handleAccordionChange}>
					{questionList.length >= 1 &&
						questionList.map((el, idx) => {
							return (
								<AccordionItem className="border  mb-1" key={idx} uuid={idx}>
									<AccordionItemHeading
										className={`border-b py-3 bg-gray-200 px-4 ${
											expandedItem == idx ? 'bg-cyan-500' : ''
										}`}>
										<AccordionItemButton>
											<div className="flex justify-between items-center">
												<span>Question: {el.id}</span>

												<div className="flex items-center gap-5">
													<BiReset
														className="text-green-800 text-xl hover:scale-[1.2] transition-all duration-300"
														onClick={handleRestoreQuestion.bind(null, el.id)}
													/>

													<FaTrash
														className="text-red-800 hover:scale-[1.2] transition-all duration-300"
														onClick={handleDeleteQuestion.bind(null, el.id)}
													/>
												</div>
											</div>
										</AccordionItemButton>
									</AccordionItemHeading>
									<AccordionItemPanel className="py-3 px-4">
										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block">
												Question
											</span>
											<p
												dangerouslySetInnerHTML={{
													__html: el.mqs_question,
												}}></p>
										</div>

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block">
												Option A
											</span>

											<p
												dangerouslySetInnerHTML={{
													__html: el.mqs_opt_one,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block">
												Option B
											</span>

											<p
												dangerouslySetInnerHTML={{
													__html: el.mqs_opt_two,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block">
												Option C
											</span>
											<p
												dangerouslySetInnerHTML={{
													__html: el.mqs_opt_three,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block">
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
												<span className="font-bold text-[#555] mb-4 block">
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
												<span className="font-bold text-[#555] my-4 block">
													Solution
												</span>
												<p
													dangerouslySetInnerHTML={{
														__html: el.mqs_solution,
													}}></p>
											</div>
										)}
									</AccordionItemPanel>
								</AccordionItem>
							);
						})}
				</Accordion>
			</div>

			{/* <div className="container mx-auto mt-6">
				<h3 className="heading-3__dark ">Post List</h3>
				<div class="relative overflow-x-auto">
					<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr className="bg-blue-200">
								<th scope="col" class="px-6 py-3">
									#
								</th>
								<th scope="col" class="px-6 py-3">
									Post Name
								</th>
								<th scope="col" class="px-6 py-3 text-center">
									Topic For Post
								</th>

								<th scope="col" class="px-6 py-3">
									View
								</th>
							</tr>
						</thead>
						<tbody>
							{postsList.length >= 1 &&
								postsList.map((el, i) => {
									return (
										<tr class="border-b dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 bg-gray-100 hover:bg-white">
											<td
												width={'4%'}
												scope="row"
												class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
												{i + 1}
											</td>
											<td
												scope="row"
												class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
												{el.mtl_test_name}
											</td>
											<td width={'15%'} class="px-6 py-2 text-center">
												{el.total_topics}
											</td>
											<td class="px-6 py-2">
												<CButton
													className=""
													icon={<FaEye className="text-2xl" />}
													varient="btn--warning"
													onClick={handleGetSubjectsList.bind(null, el.id)}
												/>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div> */}
		</>
	);
}

export default TrashQuestionsList;
