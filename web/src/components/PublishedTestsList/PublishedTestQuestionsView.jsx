import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../Hooks/use-http.jsx';
let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;

import { H2, H3 } from '../UI/Headings.jsx';
import { useEffect, useLayoutEffect } from 'react';
import Swal from 'sweetalert2';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaBackspace } from 'react-icons/fa';
import CButton from '../UI/CButton.jsx';
import { GoPencil } from 'react-icons/go';
import EditQuestionView from '../TestsList/EditQuestionView.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import { EDIT_QUESTION_OF_PUBLISHED_TEST } from '../Utils/Constants.jsx';

function PublishedTestQuestionsView() {
	const { previewPublishedTestDetails, publishedTestQuestionsList } = useSelector((state) => state.tests);

	useLayoutEffect(() => {
		if (!previewPublishedTestDetails.testId) {
			navigate('/published-test');
		}
	}, []);

	const { sendRequest } = useHttp();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (publishedTestQuestionsList.length == 0) {
			let reqData = {
				url: SERVER_IP + '/api/test/questions',
				method: 'POST',
				body: JSON.stringify({ testId: previewPublishedTestDetails.test_id }),
			};
			sendRequest(reqData, ({ success, data }) => {
				if (data.length == 0) {
					Swal.fire({
						title: 'Warning!',
						text: 'No questions found for the test!',
					});

					navigate('/published-test');
					return false;
				}

				dispatch(testsSliceActions.setPublishedTestQuestionsList(data));
			});
		}
	}, [publishedTestQuestionsList]);

	useEffect(() => {
		return () => {
			dispatch(testsSliceActions.cleanupPublishedTestDetails());
		};
	}, []);

	const handleEditQuestion = (el) => {
		dispatch(
			EditQuestionFormActions.setEditQuestionDetails({
				el,
				edit_for: EDIT_QUESTION_OF_PUBLISHED_TEST,
			})
		);
		dispatch(ModalActions.toggleModal('edit-que-modal'));
	};

	let lastMainName = '';
	let lastSub = '';

	const renderTopicHeader = (mainTopicName, subTopicSection) => {
		let header = null;

		if (subTopicSection !== lastSub) {
			lastSub = subTopicSection;
			header = (
				<p className="topicDisplay">
					{mainTopicName} :: {subTopicSection}
				</p>
			);
		}

		if (mainTopicName !== lastMainName) {
			lastMainName = mainTopicName;
		}

		return header;
	};

	return (
		<>
			<EditQuestionView />
			<div className="container mx-auto text-center my-6 relative">
				<Link className="bg-blue-200 inline-block absolute left-0 top-0 p-2" to={'/published-test'}>
					<FaBackspace />
				</Link>
				<H2>{previewPublishedTestDetails.test_name}</H2>
			</div>
			<div className="container mx-auto grid grid-cols-3 gap-2 mb-6 border-b border-b-gray-500">
				<PreviewTestDetails title={'Test Duration'} value={previewPublishedTestDetails.test_name} />

				<PreviewTestDetails title={'Marks per question'} value={previewPublishedTestDetails.marks_per_question} />

				<PreviewTestDetails title={'Total questions'} value={previewPublishedTestDetails.total_questions} />

				<PreviewTestDetails title={'Is negative marking'} value={previewPublishedTestDetails.is_negative_marking == 0 ? 'No' : 'Yes'} />

				<PreviewTestDetails title={'Negative marks'} value={previewPublishedTestDetails.negative_mark} />
				<PreviewTestDetails title={'Passing marks'} value={previewPublishedTestDetails.test_passing_mark} />

				<PreviewTestDetails
					title={'Test created date'}
					value={`
					${previewPublishedTestDetails?.test_created_on.split('-')[2]}-
					${previewPublishedTestDetails?.test_created_on.split('-')[1]}-
					${previewPublishedTestDetails?.test_created_on.split('-')[0]}`}
				/>

				<PreviewTestDetails title={'Todays date'} value={previewPublishedTestDetails.todays_date} />
			</div>

			<div className="container mx-auto columns-2">
				{publishedTestQuestionsList.length >= 1 &&
					publishedTestQuestionsList.map((el, idx) => {
						const topicHeader = renderTopicHeader(el.main_topic_name, el.sub_topic_section);
						return (
							<>
								{topicHeader && <div className="border p-2 text-center bg-green-300">{topicHeader}</div>}
								<div className={`border transition-all duration-300 mb-5 shadow-sm bg-gray-100 relative que-container`} key={idx}>
									<CButton icon={<GoPencil />} onClick={handleEditQuestion.bind(null, el)} className={'absolute top-0 right-0 edit-que-btn'}>
										Edit
									</CButton>
									<div className="py-3 px-4 text-start">
										<div className="py-3">
											<p className="font-bold text-[#555] mb-4 block text-start">Q. {idx + 1})</p>
											<p
												className="text-start"
												dangerouslySetInnerHTML={{
													__html: el.q,
												}}></p>
										</div>

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block text-start">Option A</span>

											<p
												dangerouslySetInnerHTML={{
													__html: el.q_a,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block text-start">Option B</span>

											<p
												dangerouslySetInnerHTML={{
													__html: el.q_b,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block text-start">Option C</span>
											<p
												dangerouslySetInnerHTML={{
													__html: el.q_c,
												}}></p>
										</div>

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 block text-start">Option D</span>
											<p
												dangerouslySetInnerHTML={{
													__html: el.q_d,
												}}></p>
										</div>

										<hr />

										{el.mqs_opt_five && (
											<div className="py-3">
												<span className="font-bold text-[#555] mb-4 block text-start">Option E</span>
												<p
													dangerouslySetInnerHTML={{
														__html: el.q_e,
													}}></p>
											</div>
										)}

										<hr />

										<div className="py-3">
											<span className="font-bold text-[#555] mb-4 me-3">Correct Option</span>
											<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">{el.q_ans}</span>
										</div>

										<hr />

										{el.q_sol && (
											<div className="py-3">
												<span className="font-bold text-[#555] my-4 block text-start">Solution</span>
												<p
													className="text-start"
													dangerouslySetInnerHTML={{
														__html: el.q_sol,
													}}></p>
											</div>
										)}

										<hr />
										<div className=" bg-gray-300 p-3 ">
											<H3>Publication Info</H3>

											<table className="w-full">
												<tr>
													<th className="border px-2 py-1">Pub. Name</th>
													<th className="border px-2 py-1">Book Name</th>
													<th className="border px-2 py-1">Pg No</th>
												</tr>
												<tr className="text-center">
													<td className="border px-2 py-1">{el.pub_name ? el.pub_name : 'NA'}</td>
													<td className="border px-2 py-1">{el.book_name ? el.book_name : 'NA'}</td>
													<td className="border px-2 py-1">{el.page_name ? el.page_name : 'NA'}</td>
												</tr>
											</table>
										</div>
									</div>
								</div>
							</>
						);
					})}
			</div>
		</>
	);
}

function PreviewTestDetails({ title, value }) {
	return (
		<div className="flex gap-2 items-center">
			<span className="font-semibold">{title} :</span>
			<span>{value}</span>
		</div>
	);
}

export default PublishedTestQuestionsView;
