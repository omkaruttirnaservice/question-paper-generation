import React, { useEffect, useState } from 'react';
import { FaAngleDoubleRight, FaEyeSlash } from 'react-icons/fa';
import { FaAngleRight, FaEye } from 'react-icons/fa6';

import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.js';
import CButton from '../../UI/CButton.js';

function QuestionPreview() {
	const dispatch = useDispatch();

	const [dataEntryFor, setDataEntryFor] = useState({
		postName: null,
		subjectName: null,
		topicName: null,
	});

	const {
		data: _formData,
		isQuestionPreview,
		postsList,
		subjectsList,
		topicsList,
		questionNumber,
	} = useSelector((state) => state.questionForm);

	useEffect(() => {
		if (isQuestionPreview) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isQuestionPreview]);

	useEffect(() => {
		if (_formData.post_id) {
			let postDetails = postsList.find((post) => post.id == _formData.post_id);
			let subjectDetails = subjectsList.find(
				(sub) => sub.id == _formData.subject_id
			);
			let topicDetails = topicsList.find(
				(topic) => topic.id == _formData.topic_id
			);

			setDataEntryFor({
				postName: postDetails?.mtl_test_name || '',
				subjectName: subjectDetails?.mtl_name || '',
				topicName: topicDetails?.topic_name || '',
			});
		}
	}, [_formData.post_id, _formData.subject_id, _formData.topic_id]);

	const handleKeyPress = (e) => {
		let key = e.key;
		if (e.altKey && key.toLowerCase() == 'p') {
			dispatch(QuestionFormActions.toggleQuestionPreview());
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	return (
		<>
			{isQuestionPreview && (
				<span
					className="bg-gray-600/50 blur fixed  inset-0 z-[90]"
					onClick={() => {
						dispatch(QuestionFormActions.toggleQuestionPreview());
					}}></span>
			)}
			<div
				className={`text-gray-600 pt-6 pb-10 px-5 w-[90%] overflow-auto h-[100svh] bg-gray-100 transition-all duration-200 fixed top-0  z-[100] ${
					isQuestionPreview ? 'left-0' : 'left-[-100%]'
				}`}>
				{/* <div className="flex items-center py-3 gap-3">
					<p>Data entry for</p>
					<FaAngleRight />
					<span className="underline">{dataEntryFor.postName}</span>
					<FaAngleDoubleRight />
					<span className="underline">{dataEntryFor.subjectName}</span>
					<FaAngleDoubleRight />
					<span className="underline">{dataEntryFor.topicName}</span>
				</div>

				<hr />

				<div className="flex justify-end py-3 items-center gap-3">
					[<span>{_formData.pub_name}</span>] [
					<span>{_formData.book_name}</span>] [
					<span>Pg. No. {_formData.pg_no}</span>]
				</div> */}

				<div className="flex flex-col gap-6">
					<p className="font-bold">
						Question <span>{questionNumber}</span>
					</p>
					<div
						dangerouslySetInnerHTML={{
							__html: _formData.question_content,
						}}
						className="mb-2 bg-gray-50 p-3"></div>
					<p className="font-bold">Option A</p>
					<div
						className="mb-2 bg-gray-50 p-3"
						dangerouslySetInnerHTML={{ __html: _formData.option_A }}></div>

					<p className="font-bold">Option B</p>
					<div
						className="mb-2 bg-gray-50 p-3"
						dangerouslySetInnerHTML={{ __html: _formData.option_B }}></div>

					<p className="font-bold">Option C</p>
					<div
						className="mb-2 bg-gray-50 p-3"
						dangerouslySetInnerHTML={{ __html: _formData.option_C }}></div>

					<p className="font-bold">Option D</p>
					<div
						className="mb-2 bg-gray-50 p-3"
						dangerouslySetInnerHTML={{ __html: _formData.option_D }}></div>

					{_formData.option_E && (
						<>
							<p className="font-bold">Option E</p>
							<div
								className="mb-2 bg-gray-50 p-3"
								dangerouslySetInnerHTML={{ __html: _formData.option_E }}></div>
						</>
					)}

					<p className="font-bold">
						Correct Option&nbsp;&nbsp;
						<span className="bg-blue-300 py-2 px-3 font-bold">
							{_formData.correct_option}
						</span>
					</p>

					<p className="font-bold">Explanation</p>
					<div
						className="mb-2 bg-gray-50 p-3"
						dangerouslySetInnerHTML={{ __html: _formData.explanation }}></div>
				</div>
			</div>

			<CButton
				className="fixed right-2 bottom-16 z-[100]"
				icon={
					isQuestionPreview ? (
						<FaEyeSlash className="text-2xl" />
					) : (
						<FaEye className="text-2xl" />
					)
				}
				varient="btn--warning"
				onClick={() => {
					dispatch(QuestionFormActions.toggleQuestionPreview());
				}}
			/>
		</>
	);
}

export default QuestionPreview;
