import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import { H2, H3 } from '../../UI/Headings.jsx';
import ScoreCard from './ScoreCard.jsx';
import StudQuestionPaper from './StudQuestionPaper.jsx';
import { IoChevronBackOutline } from 'react-icons/io5';

const SCORE_TAB = 'score_card';
const QUESTION_PAPER_TAB = 'question-paper';

function StudentExamReportSingle() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [params, setParams] = useSearchParams();
	const { singleStudentViewReport, studTestDetails: testDetails } = useSelector(
		(state) => state.reports
	);
	const { studExam, quePaper } = singleStudentViewReport;
	console.log(quePaper, '==quePaper==')

	useLayoutEffect(() => {
		setParams({ tab: SCORE_TAB });
	}, []);

	useEffect(() => {
		if (
			!singleStudentViewReport?.quePaper?.length >= 1 ||
			!singleStudentViewReport?.studExam ||
			!studExam
		) {
			navigate('/view-reports');
		}
	}, [singleStudentViewReport, studExam]);

	const handleChangeTab = (tabType) => {
		setParams({ tab: tabType });
	};

	useEffect(() => {
		return () => {
			dispatch(reportsAction.setSingleStudentViewReport([]));
		};
	}, []);

	return (
		<div>
			<H2>Student Exam Report</H2>
			<div className="flex justify-between gap-3 mb-3">
				<CButton
					icon={<IoChevronBackOutline />}
					onClick={() => {
						navigate('/view-reports');
					}}
					className="btn--danger"
				></CButton>
				<div className="flex gap-3">
					<CButton
						onClick={handleChangeTab.bind(null, SCORE_TAB)}
						className={`${
							params.get('tab') == SCORE_TAB ? 'btn--success px-9' : ''
						}`}
					>
						Score Card
					</CButton>
					<CButton
						onClick={handleChangeTab.bind(null, QUESTION_PAPER_TAB)}
						className={`${
							params.get('tab') == QUESTION_PAPER_TAB ? 'btn--success px-9' : ''
						}`}
					>
						Question Paper
					</CButton>
				</div>
			</div>

			{params.get('tab') == SCORE_TAB && (
				<>
					<ScoreCard studExam={studExam} testDetails={testDetails} />
				</>
			)}

			{params.get('tab') == QUESTION_PAPER_TAB && (
				<>
					<H3>Question paper</H3>

					{quePaper?.length > 0 &&
						quePaper.map((el, idx) => {
							return <StudQuestionPaper el={el} idx={idx} />;
						})}
				</>
			)}
		</div>
	);
}

export default StudentExamReportSingle;
