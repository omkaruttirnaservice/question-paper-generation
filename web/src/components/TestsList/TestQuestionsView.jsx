import { memo, useEffect, useState } from 'react';
import {
    FaArrowAltCircleLeft,
    FaArrowAltCircleRight,
    FaBackspace,
    FaEye,
    FaPrint,
} from 'react-icons/fa';
import { FaListUl, FaSpinner } from 'react-icons/fa6';
import { GoPencil } from 'react-icons/go';
import { IoGridOutline } from 'react-icons/io5';
import { MdAssignment } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EditQuestionFormActions } from '../../Store/edit-question-form-slice.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { getQuestionsListThunk } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PDFGenerator from '../Reports/GenerateRports/PDFGen.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import {
    _questionListView,
    EDIT_QUESTION_OF_GENERATED_TEST,
    EDIT_QUESTION_OF_PUBLISHED_TEST,
    TEST_LIST_MODE,
} from '../Utils/Constants.jsx';
import EditQuestionView from './EditQuestionView.jsx';
import { renderTopicHeader } from './utils.js';
// ✅ Reuse the SAME CSS as Auto Test page
import '../QuestionsListAutoTest/QuestionsListAutoTest.css';
// ✅ Reuse the mode selector style from CreateTestForm
import '../CreateTestForm.css';

function TestQuestionsView() {
    const [questionListView, setQuestionListView] = useState(_questionListView.SPLIT);
    const { questionsList, testDetails } = useSelector((state) => state.tests);
    const { sendRequest } = useHttp();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getQuestionsListThunk(testDetails.test_id, sendRequest, navigate));
    }, [testDetails.test_id]);

    const handleEditQuestion = (el) => {
        if (testDetails.mode == TEST_LIST_MODE.TEST_LIST) {
            dispatch(EditQuestionFormActions.setEditQuestionDetails({ el, edit_for: EDIT_QUESTION_OF_GENERATED_TEST }));
        }
        if (testDetails.mode == TEST_LIST_MODE.PUBLISHED_TEST_LIST) {
            dispatch(EditQuestionFormActions.setEditQuestionDetails({ el, edit_for: EDIT_QUESTION_OF_PUBLISHED_TEST }));
        }
        navigate('/tests/questions/edit');
    };

    return (
        <div className="qat-root">
            <CModal
                id={'view-pdf-modal'}
                title={
                    <div className="flex items-center gap-2">
                        <FaPrint />
                        <span>QUESTIONS PRINT LIST</span>
                    </div>
                }
                className={`min-w-[95vw]`}
                headerClass="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl mb-6 shadow-md"
            >
                <PDFGenerator questions={questionsList} testDetails={testDetails} />
            </CModal>

            {/* ✅ Same Blue Header Bar as Auto Test */}
            <div className="qat-header-bar">
                <div className="qat-header-content">
                    <MdAssignment />
                    <span>MANUAL TEST CREATION</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="qat-header-btn"
                        style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}
                        onClick={() => dispatch(ModalActions.toggleModal('view-pdf-modal'))}>
                        <FaPrint /> Print
                    </button>
                    <button className="qat-header-btn" onClick={() => navigate(-1)}>
                        <FaBackspace /> Go Back
                    </button>
                </div>
            </div>

            {/* ✅ Same Info Banner */}
            <div className="qat-info-banner">
                <div className="qat-info-stats">
                    {[
                        { label: 'Test Name', value: testDetails.test_name, color: '#2F54EB' },
                        { label: 'Duration', value: `${testDetails.test_duration}m`, color: '#10B981' },
                        { label: 'Marks/Q', value: testDetails.marks_per_question, color: '#8B5CF6' },
                        { label: 'Total Q', value: testDetails.total_questions, color: '#F59E0B' },
                        { label: 'Passing', value: testDetails.test_passing_mark, color: '#FB7185' },
                        { label: 'Neg. Mark', value: testDetails.negative_mark || 'No', color: '#64748B' },
                    ].map((s, i) => (
                        <div key={i} className="qat-info-stat">
                            <div className="qat-info-stat-dot" style={{ backgroundColor: s.color }} />
                            <div>
                                <div className="qat-info-stat-val">{s.value || '—'}</div>
                                <div className="qat-info-stat-lbl">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Toggle — same pill style as AUTO/MANUAL selector */}
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 1.25rem', padding: '0 1rem' }}>
                <div className="ctf-mode-selector">
                    <div
                        className={`ctf-mode-tab ${questionListView === _questionListView.SPLIT ? 'active-auto' : ''}`}
                        onClick={() => setQuestionListView(_questionListView.SPLIT)}>
                        <FaListUl /> LIST VIEW
                    </div>
                    <div
                        className={`ctf-mode-tab ${questionListView === _questionListView.EXAM_THEME_1 ? 'active-manual' : ''}`}
                        onClick={() => setQuestionListView(_questionListView.EXAM_THEME_1)}>
                        <IoGridOutline /> EXAM VIEW
                    </div>
                </div>
            </div>

            {/* Loading */}
            {questionsList.length === 0 && (
                <div className="qat-empty">
                    <FaSpinner className="animate-spin" style={{ fontSize: '2rem' }} />
                </div>
            )}

            {/* Questions */}
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto 3rem', padding: '0 1rem' }}>
                {questionListView === _questionListView.SPLIT && questionsList.length !== 0 && (
                    <QuestionSplitView
                        questionsList={questionsList}
                        renderTopicHeader={renderTopicHeader}
                        handleEditQuestion={handleEditQuestion}
                    />
                )}
                {questionListView === _questionListView.EXAM_THEME_1 && questionsList.length !== 0 && (
                    <ExamThemeView
                        testDetails={testDetails}
                        questionsList={questionsList}
                        renderTopicHeader={renderTopicHeader}
                        handleEditQuestion={handleEditQuestion}
                    />
                )}
            </div>
        </div>
    );
}

const QuestionSplitView = memo(({ questionsList, renderTopicHeader, handleEditQuestion }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {questionsList.map((el, idx) => {
                const topicHeader = renderTopicHeader(el.main_topic_name, el.sub_topic_section);
                return (
                    <div key={idx} className="qat-card" style={{ position: 'relative', transition: 'all 0.3s', borderRadius: '1.5rem' }}>
                        {topicHeader && (
                            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#2F54EB', background: '#F0F5FF', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', display: 'inline-block', marginBottom: '0.75rem' }}>
                                {el.main_topic_name}{el.sub_topic_section ? ` › ${el.sub_topic_section}` : ''}
                            </div>
                        )}
                        <button
                            onClick={() => handleEditQuestion(el)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#FEF9C3', color: '#854D0E', border: 'none', width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <GoPencil />
                        </button>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#2F54EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                            Q. {idx + 1}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', lineHeight: 1.6, marginBottom: '1rem' }}
                            dangerouslySetInnerHTML={{ __html: el?.q || el?.mqs_question || '-' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'A', val: el?.q_a || el?.mqs_opt_one },
                                { label: 'B', val: el?.q_b || el?.mqs_opt_two },
                                { label: 'C', val: el?.q_c || el?.mqs_opt_three },
                                { label: 'D', val: el?.q_d || el?.mqs_opt_four },
                                { label: 'E', val: el?.q_e || el?.mqs_opt_five },
                            ].filter(o => o.val).map((o, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', background: '#F8FAFC', fontSize: '0.85rem', color: '#475569' }}>
                                    <span style={{ fontWeight: 950, color: '#2F54EB', minWidth: 18 }}>{o.label}.</span>
                                    <span dangerouslySetInnerHTML={{ __html: o.val }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 800 }}>
                            Correct Answer:
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '0.2rem 0.75rem', borderRadius: '99px', fontWeight: 950 }}>
                                {el?.q_ans?.toUpperCase() || el?.mqs_ans?.toUpperCase() || '—'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export function ExamThemeView({ testDetails, questionsList, handleEditQuestion, isEdit = true }) {
    const dispatch = useDispatch();
    const [idx, setIdx] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(questionsList[idx]);

    useEffect(() => { setCurrentQuestion(questionsList[idx]); }, [idx, questionsList]);

    return (
        <>
            <div className="flex justify-center mt-8">
                <CButton icon={<FaEye size={18} />} disabled={questionsList.length === 0}
                    className="!px-8 !py-2.5 !text-sm !font-black !bg-gradient-to-r !from-blue-600 !to-blue-500 !shadow-xl !shadow-blue-200/50 !text-white transform hover:!scale-105 transition-all !rounded-xl uppercase tracking-widest"
                    onClick={() => dispatch(ModalActions.toggleModal('exam-theme-1-modal'))}>
                    <span>Launch Exam View</span>
                </CButton>
            </div>
            <CModal id="exam-theme-1-modal" title={testDetails.test_name || 'Exam View'} className="!w-[98vw] !h-[97vh] !max-w-none">
                <div className="flex flex-col h-[85vh] bg-slate-50/50 rounded-b-[2rem] overflow-hidden">
                    <div className="grid grid-cols-12 gap-6 p-6 h-full">

                        {/* LEFT: Question Area (8 columns) */}
                        <div className="col-span-8 flex flex-col h-full overflow-hidden">
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                                <div className="bg-white rounded-[1.5rem] p-6 min-h-[300px] shadow-xl border border-slate-100 relative overflow-hidden">
                                    {/* Question Indicator Pill */}
                                    <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1 rounded-br-[0.75rem] text-[8px] font-black tracking-[0.2em] uppercase shadow-md z-10">
                                        Question {idx + 1}
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-base font-bold text-slate-800 leading-relaxed mb-3"
                                            dangerouslySetInnerHTML={{ __html: currentQuestion?.q || currentQuestion?.mqs_question || '-' }} />

                                        <div className="grid grid-cols-1 gap-1">
                                            {[
                                                { label: 'A', val: currentQuestion?.q_a || currentQuestion?.mqs_opt_one },
                                                { label: 'B', val: currentQuestion?.q_b || currentQuestion?.mqs_opt_two },
                                                { label: 'C', val: currentQuestion?.q_c || currentQuestion?.mqs_opt_three },
                                                { label: 'D', val: currentQuestion?.q_d || currentQuestion?.mqs_opt_four },
                                                { label: 'E', val: currentQuestion?.q_e || currentQuestion?.mqs_opt_five },
                                            ].filter(o => o.val).map((o, i) => (
                                                <div key={i} className="flex items-center gap-3 p-1.5 rounded-lg bg-slate-50/50 border border-slate-100 hover:border-blue-400 hover:bg-blue-50/30 transition-all group cursor-pointer shadow-sm">
                                                    <span className="w-5 h-5 shrink-0 rounded-md bg-white border border-slate-200 flex items-center justify-center font-black text-[9px] text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 shadow-sm transition-all">
                                                        {o.label}
                                                    </span>
                                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800" dangerouslySetInnerHTML={{ __html: o.val }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Answer Key */}
                                    <div className="mt-4 pt-2 border-t border-dashed border-slate-200 flex items-center gap-4">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Correct Answer:</span>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black shadow-sm">
                                            Option {currentQuestion?.q_ans?.toUpperCase() || currentQuestion?.mqs_ans?.toUpperCase() || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                                <CButton 
                                    varient=""
                                    disabled={idx === 0} 
                                    className="!bg-slate-50 !text-slate-500 hover:!bg-slate-100 !px-6 !py-2.5 !rounded-xl !font-black !text-[10px] uppercase tracking-[0.15em] border border-slate-200/60 shadow-sm transition-all" 
                                    icon={<FaArrowAltCircleLeft size={13} />} 
                                    onClick={() => setIdx(p => p - 1)}
                                >
                                    Previous
                                </CButton>

                                {isEdit && (
                                    <CButton 
                                        icon={<GoPencil size={13} />} 
                                        onClick={() => handleEditQuestion(currentQuestion)} 
                                        className="!bg-gradient-to-r !from-amber-400 !to-amber-500 hover:!scale-105 !text-amber-950 !px-8 !py-2.5 !rounded-xl !font-black !text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-amber-200/50 transition-all"
                                    >
                                        Edit Question
                                    </CButton>
                                )}

                                <CButton 
                                    disabled={questionsList.length === idx + 1} 
                                    className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !text-white hover:!scale-105 !px-8 !py-2.5 !rounded-xl !font-black !text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-blue-200/50 transition-all" 
                                    icon={<FaArrowAltCircleRight size={13} />} 
                                    onClick={() => setIdx(p => p + 1)}
                                >
                                    Next Question
                                </CButton>
                            </div>
                        </div>

                        {/* RIGHT: Navigation Grid Panel (4 columns) */}
                        <div className="col-span-4 flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Questions Navigator</h3>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black tracking-widest uppercase border border-blue-100">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-slate-800 leading-none tracking-tighter">{idx + 1}</span>
                                    <span className="text-slate-300 font-light text-xl leading-none">/</span>
                                    <span className="text-base font-bold text-slate-400 leading-none">{questionsList.length}</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200">
                                <div className="grid grid-cols-6 gap-2.5">
                                    {questionsList.map((_q, _i) => (
                                        <div key={_i}
                                            className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 font-black text-xs
                                                ${idx === _i
                                                    ? 'bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-xl shadow-blue-100 scale-110 z-10'
                                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100 hover:border-slate-200'}`}
                                            onClick={() => setIdx(_i)}>
                                            {_i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CModal>
        </>
    );
}

export default TestQuestionsView;
