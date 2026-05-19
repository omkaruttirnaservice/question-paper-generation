import { useEffect, useLayoutEffect } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import { H3 } from '../../UI/Headings.jsx';
import ScoreCard from './ScoreCard.jsx';
import StudQuestionPaper from './StudQuestionPaper.jsx';

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

    console.log(studExam);

    useLayoutEffect(() => {
        setParams({ tab: SCORE_TAB });
    }, []);

    useEffect(() => {
        if (
            !singleStudentViewReport?.quePaper?.length >= 1 ||
            !singleStudentViewReport?.studExam ||
            !studExam
        ) {
            navigate('/reports/list');
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
            {/* <H2>Student Exam Report</H2> */}
            <div className="flex justify-between gap-3 my-3">
                <CButton
                    icon={<IoChevronBackOutline />}
                    onClick={() => {
                        navigate('/reports/list');
                    }}
                    className="btn--danger"></CButton>
                <div className="flex gap-3">
                    <CButton
                        onClick={handleChangeTab.bind(null, SCORE_TAB)}
                        className={`${params.get('tab') == SCORE_TAB ? 'btn--success px-9' : ''}`}>
                        Score Card
                    </CButton>
                    <CButton
                        onClick={handleChangeTab.bind(null, QUESTION_PAPER_TAB)}
                        className={`${
                            params.get('tab') == QUESTION_PAPER_TAB ? 'btn--success px-9' : ''
                        }`}>
                        Question Paper
                    </CButton>

                    <CButton className={`btn--warning px-2 text-gray-700`}>
                        <NavLink
                            target="_blank"
                            to={`/qp-pdf/${studExam?.sfrs_student_id || 0}/${
                                studExam?.sfrs_publish_id || 0
                            }`}
                            className={`btn--warning px-9 text-gray-700`}>
                            Get Pdf
                        </NavLink>
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
                    <H3 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                        Question paper
                    </H3>

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
