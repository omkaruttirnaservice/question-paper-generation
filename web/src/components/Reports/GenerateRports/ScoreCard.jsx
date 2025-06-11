import React, { useEffect, useLayoutEffect } from 'react';
import { H3 } from '../../UI/Headings.jsx';
import { useNavigate } from 'react-router-dom';

function ScoreCard({ studExam, testDetails }) {
	if (!studExam) {
		return <>No data</>;
	}
	return (
		<>
			<H3>Score Card</H3>
			<div className="grid grid-cols-3">
				<div className="flex flex-col gap-3 justify-center py-4">
					<div className="text-xs ">
						Total marks in test: <span className="font-semibold"> {testDetails.mt_total_marks} </span>
					</div>
					<div className="text-xs ">
						Total questions in test : <span className="font-semibold"> {testDetails.test_total_question} </span>
					</div>
					<div className="text-xs ">
						Total time alloted : <span className="font-semibold"> {testDetails.mt_test_time}&nbsp;Min </span>
					</div>
					<div className="text-xs ">
						Test date : <span className="font-semibold"> {studExam.mt_added_date} </span>
					</div>
					<div className="text-xs ">
						Passing Marks : <span className="font-semibold">{testDetails.passing_out_of}&nbsp;M</span>
					</div>
					<div className="text-xs ">
						Marks Per Question: <span className="font-semibold"> {testDetails.mt_mark_per_question}&nbsp;M </span>
					</div>

					<div className="text-xs ">
						Is negative marking: <span className="font-semibold"> {testDetails.mt_negativ_mark == 0 ? 'Yes' : 'No'} </span>
					</div>
				</div>

				<div className="flex flex-col gap-3 justify-center py-4">
					<div className="text-xs ">
						Correct ans questions: <span className="font-semibold"> {studExam.sfrs_correct}</span>
					</div>
					<div className="text-xs ">
						Incorrect ans questions : <span className="font-semibold"> {studExam.sfrs_wrong} </span>
					</div>
					<div className="text-xs ">
						Unattempted questions : <span className="font-semibold"> {studExam.sfrs_unattempted} </span>
					</div>
					<div className="text-xs ">
						Total questions solved : <span className="font-semibold"> {+studExam.sfrs_correct + +studExam.sfrs_wrong} </span>
					</div>
					<div className="text-xs ">
						Time taken : <span className="font-semibold"> M </span>
					</div>
				</div>

				<div className="flex flex-col gap-3 justify-center py-4">
					<div className="text-xs ">
						Correct ans marks: <span className="font-semibold"> {+studExam.sfrs_correct * +testDetails.mt_mark_per_question} </span>
					</div>
					<div className="text-xs ">
						Negative marks obtained : <span className="font-semibold"> 0 </span>
					</div>
					<div className="text-xs ">
						Final score : <span className="font-semibold"> {studExam.sfrs_marks_gain + '/' + studExam.sfrc_total_marks} </span>
					</div>
					<div className="text-xs ">
						Gain % : <span className="font-semibold"> {((studExam.sfrs_marks_gain / studExam.sfrc_total_marks) * 100).toFixed(2) + '%'} </span>
					</div>
					<div className="text-xs ">
						Test Summary :
						<span className="font-semibold">
							{+testDetails.sfrs_marks_gain >= +testDetails.mt_passing_out_of ? (
								<span className="bg-green-400 px-2 py-1  text-white font-semibold tracking-widest">PASS</span>
							) : (
								<span className="bg-red-400 px-2 py-1 text-white font-semibold tracking-widest">FAIL</span>
							)}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}

export default ScoreCard;
