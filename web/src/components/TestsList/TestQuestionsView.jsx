import { FaBackspace } from 'react-icons/fa';
import { GoPencil } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../Hooks/use-http.jsx';

import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { getTestQuestionsListThunk, testsSliceActions } from '../../Store/tests-slice.jsx';
import CButton from '../UI/CButton.jsx';
import { H2, H3 } from '../UI/Headings.jsx';
import EditQuestionView from './EditQuestionView.jsx';
import { EDIT_QUESTION_OF_GENERATED_TEST } from '../Utils/Constants.jsx';

function TestQuestionsView() {
	const { testQuestionsList, previewTestDetails } = useSelector((state) => state.tests);

	const { sendRequest } = useHttp();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (testQuestionsList.length == 0) {
			dispatch(getTestQuestionsListThunk(previewTestDetails.test_id, sendRequest, navigate));
		}
	}, [testQuestionsList]);

	useEffect(() => {
		return () => {
			dispatch(testsSliceActions.cleanupPreviewTestDetails());
		};
	}, []);

	const handleEditQuestion = (el) => {
		dispatch(
			EditQuestionFormActions.setEditQuestionDetails({
				el,
				edit_for: EDIT_QUESTION_OF_GENERATED_TEST,
			})
		);
		dispatch(ModalActions.toggleModal('edit-que-modal'));
	};

	let lastMainName = '';
	let lastSub = '';

	const renderTopicHeader = (mainTopicName, subTopicSection) => {
		let header = null;

		// Render sub topic header if it changes
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
				<Link className="bg-blue-200 inline-block absolute left-0 top-0 p-2" to={'/tests-list'}>
					<FaBackspace />
				</Link>
				<H2 className="mb-0">{previewTestDetails.test_name}</H2>
			</div>
			<div className="container mx-auto grid grid-cols-3 gap-2 mb-6">
				<PreviewTestDetails title={'Test Duration'} value={previewTestDetails.test_name} />

				<PreviewTestDetails title={'Marks per question'} value={previewTestDetails.marks_per_question} />

				<PreviewTestDetails title={'Total questions'} value={previewTestDetails.total_questions} />

				<PreviewTestDetails title={'Is negative marking'} value={previewTestDetails.is_negative_marking == 0 ? 'No' : 'Yes'} />

				<PreviewTestDetails title={'Negative marks'} value={previewTestDetails.negative_mark} />
				<PreviewTestDetails title={'Passing marks'} value={previewTestDetails.test_passing_mark} />

				<PreviewTestDetails title={'Test created date'} value={previewTestDetails.test_created_on} />

				<PreviewTestDetails title={'Todays date'} value={previewTestDetails.todays_date} />
			</div>

			{testQuestionsList.length == 0 && (
				<div className="flex justify-center">
					<FaSpinner className="animate-spin text-2xl" />
				</div>
			)}

			<div className="container mx-auto columns-2">
				{testQuestionsList.length >= 1 &&
					testQuestionsList.map((el, idx) => {
						const topicHeader = renderTopicHeader(el.main_topic_name, el.sub_topic_section);
						return (
							<>
								{topicHeader && <div className="border p-2 text-center">{topicHeader}</div>}
								<div className={`border transition-all duration-300  mb-5 shadow-sm bg-gray-100 relative que-container`} key={idx}>
									<CButton icon={<GoPencil />} onClick={handleEditQuestion.bind(null, el)} className={'absolute top-0 right-0 edit-que-btn'}>
										Edit
									</CButton>
									<div className="py-3 px-4 text-start">
										<div className="py-3">
											<p className="font-bold text-[#555] mb-4 block text-start">Q. {el.id})</p>
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

export default TestQuestionsView;
