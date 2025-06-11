import React from 'react';
import { FaRegThumbsUp } from 'react-icons/fa';
import { FaRegThumbsDown } from 'react-icons/fa6';

function StudQuestionPaper({ el, idx }) {
	let isAnsCorrect = el.q_ans == el.sqp_ans;
	return (
		<div className={`columns-2 py-3 px-4 text-start ${isAnsCorrect ? 'bg-green-200' : 'bg-red-200'} border border-b relative mb-3`}>
			<div className="py-3">
				<p className="font-bold text-[#555] mb-4 block text-start">Q. {idx + 1} </p>
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

			{el.q_e && (
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
				<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">{el?.q_ans?.toUpperCase() || '-'}</span>
			</div>

			<div className="py-3">
				<span className="font-bold text-[#555] mb-4 me-3">Student Option</span>
				<span className="mb-6 bg-blue-200 px-2 py-1 w-fit">{el?.sqp_ans?.toUpperCase() || '-'}</span>
			</div>

			{isAnsCorrect ? <FaRegThumbsUp className='absolute top-2 right-2 !text-4xl'/> : <FaRegThumbsDown className='absolute top-2 right-2 !text-4xl'/>}

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
		</div>
	);
}

export default StudQuestionPaper;
