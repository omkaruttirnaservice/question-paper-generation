let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import { memo, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
    MdFormatListBulleted, MdChecklist, MdSearch, MdRocketLaunch,
    MdOutlineQuiz, MdFilterList, MdAssignment, MdFactCheck
} from 'react-icons/md';
import { HiPencilAlt } from 'react-icons/hi';
import { IoTimeOutline } from 'react-icons/io5';
import { AiOutlineStar } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    EditQuestionFormActions, getPostListThunk,
    getSubjectsListThunk, getTopicsListThunk,
} from '../../Store/edit-question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import CModal from '../UI/CModal.jsx';
import { ExamThemeView } from '../TestsList/TestQuestionsView.jsx';
import { TEST_LIST_MODE } from '../Utils/Constants.jsx';
import AllQuestionsPreview from './AllQuestionsPreview.jsx';
import SelectAllQuestionBtn from './SelectAllQuestionBtn.jsx';
import SelectRandomQuestion from './SelectRandomQuestion.jsx';
import SelectedQuestionsPreview from './SelectedQuestionsPreview.jsx';
import './QuestionsList.css';

const ALL_QUESTION = 'all-question';
const SELECTED_QUESTION = 'selected-question';

function QuestionsList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();

    const { testDetails: test, selectedQuestionsList, isTestDetailsFilled } = useSelector((s) => s.tests);
    const [temp_QuestionList, set_temp_QuestionList] = useState([]);
    const [showList, setShowList] = useState(ALL_QUESTION);
    const { isLoading } = useSelector((s) => s.loader);
    const { data: _formData, postsList, subjectsList, topicsList } = useSelector((s) => s.questionForm);

    const post_id = _formData.post_id;
    const subject_id = _formData.subject_id;
    const topic_id = _formData.topic_id;

    useLayoutEffect(() => {
        if (!isTestDetailsFilled || !test.test_name) {
            navigate('/tests/create/form');
        }
    }, [isTestDetailsFilled, test.test_name, navigate]);

    useEffect(() => {
        if (postsList.length === 0) dispatch(getPostListThunk());
    }, [dispatch, postsList.length]);

    // Fetch subjects when post changes
    useEffect(() => {
        if (post_id) {
            dispatch(getSubjectsListThunk(post_id, sendRequest));
            set_temp_QuestionList([]);
        }
    }, [post_id, dispatch, sendRequest]);

    // Fetch topics when subject changes
    useEffect(() => {
        if (subject_id) {
            dispatch(getTopicsListThunk(subject_id, sendRequest));
            set_temp_QuestionList([]);
        }
    }, [subject_id, dispatch, sendRequest]);

    // Set Subject Name in store (separate effect to avoid fetch loop)
    useEffect(() => {
        if (subject_id && subjectsList.length > 0) {
            const sel = subjectsList.find((el) => el.id == subject_id);
            if (sel) dispatch(EditQuestionFormActions.setSubjectName(sel.mtl_name));
        }
    }, [subject_id, subjectsList, dispatch]);

    // Set Topic Name in store
    useEffect(() => {
        if (topic_id && topicsList.length > 0) {
            const sel = topicsList.find((el) => el.id == topic_id);
            if (sel) dispatch(EditQuestionFormActions.setTopicName(sel.topic_name));
        }
    }, [topic_id, topicsList, dispatch]);

    const getQuestions = useCallback(async () => {
        if (!topic_id) return;
        sendRequest({
            url: SERVER_IP + '/api/questions/list',
            method: 'POST',
            body: JSON.stringify({ post_id, subject_id, topic_id }),
        }, (data) => set_temp_QuestionList(data.data));
    }, [post_id, subject_id, topic_id, sendRequest]);

    // Fetch questions when topic changes
    useEffect(() => {
        if (topic_id) {
            getQuestions();
        }
    }, [topic_id, getQuestions]);

    const handleAddQuestionToList = useCallback((_addEl) => {
        let arr = [...selectedQuestionsList];
        let idx = arr.findIndex((el) => el.q_id == _addEl.q_id);
        if (idx !== -1) arr.splice(idx, 1);
        else arr.push(_addEl);
        dispatch(testsSliceActions.setSelectedQuestionsList(arr));
    }, [selectedQuestionsList, dispatch]);

    const finalTestSubmitHandler = useCallback(() => {
        sendRequest({
            url: SERVER_IP + '/api/test/create',
            method: 'POST',
            body: JSON.stringify({ test, testQuestions: selectedQuestionsList, _formData }),
        }, ({ success, data }) => {
            if (success) {
                Swal.fire({ title: 'Success!', text: data.message, icon: 'success' });
                const updated = { ...data.testDetails, mode: TEST_LIST_MODE.TEST_LIST };
                dispatch(ModalActions.toggleModal('create-exam-preview-modal'));
                dispatch(testsSliceActions.setTestDetails(updated));
                dispatch(testsSliceActions.setTestDetailsId(updated.id));
                setTimeout(() => navigate('/tests/list/questions'), 100);
            }
        });
    }, [test, selectedQuestionsList, _formData, dispatch, navigate, sendRequest]);

    let lastSub = '';
    const renderTopicHeader = useCallback((mainTopicName, subTopicSection) => {
        let header = null;
        if (subTopicSection !== lastSub) {
            lastSub = subTopicSection;
            header = <div className="ql-topic-header">{mainTopicName} :: {subTopicSection}</div>;
        }
        return header;
    }, []);

    const statColors = ['#2F54EB', '#10B981', '#8B5CF6', '#F59E0B', '#FB7185'];

    return (
        <div className="ql-root">
            <CreatePreSubmitView test={test} finalTestSubmitHandler={finalTestSubmitHandler} />

            {/* ✅ Premium Blue Header Bar */}
            <div className="ql-header-bar">
                <div className="ql-header-content">
                    <MdAssignment />
                    <span>MANUAL TEST CREATION</span>
                </div>
            </div>

            {/* ✅ Info Banner with Colored Dots */}
            <div className="ql-info-banner">
                <div className="ql-info-orb" />
                <div className="ql-info-stats">
                    {[
                        { label: 'Mode', value: test?.test_creation_type },
                        { label: 'Test', value: test?.test_name },
                        { label: 'Time', value: `${test?.test_duration}m` },
                        { label: 'Marks/Q', value: test?.marks_per_question },
                        { label: 'Selected', value: selectedQuestionsList.length },
                    ].map((s, i) => (
                        <div key={i} className="ql-stat">
                            <div className="ql-stat-dot" style={{ background: statColors[i], boxShadow: `0 0 10px ${statColors[i]}88` }} />
                            <div>
                                <div className="ql-stat-val">{s.value ?? '—'}</div>
                                <div className="ql-stat-lbl">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ql-card">
                <div className="ql-card-header">
                    <span className="ql-card-icon"><MdFilterList /></span>
                    <div>
                        <h2 className="ql-card-title">Filter Questions</h2>
                        <p className="ql-card-sub">Select Post, Subject and Topic</p>
                    </div>
                    {selectedQuestionsList.length > 0 && (
                        <button className="ql-create-btn" onClick={() => dispatch(ModalActions.toggleModal('create-exam-preview-modal'))}>
                            <MdRocketLaunch /> Create Exam
                        </button>
                    )}
                </div>
                <div className="ql-filter-row">
                    <div className="ql-filter-field"><PostListDropdown isShowAddNewBtn={false} /></div>
                    <div className="ql-filter-field"><SubjectListDropdown isShowAddNewBtn={false} /></div>
                    <div className="ql-filter-field"><TopicListDropdown isShowAddNewBtn={false} /></div>
                    <button className="ql-search-btn" onClick={getQuestions}><MdSearch /> Search</button>
                </div>
            </div>

            <div className="ql-tabs-bar">
                <div className="ql-tabs">
                    <button className={`ql-tab ${showList === ALL_QUESTION ? 'ql-tab--active' : ''}`} onClick={() => setShowList(ALL_QUESTION)}>
                        All Questions ({temp_QuestionList.length})
                    </button>
                    <button className={`ql-tab ${showList === SELECTED_QUESTION ? 'ql-tab--active ql-tab--selected' : ''}`} onClick={() => setShowList(SELECTED_QUESTION)}>
                        Selected ({selectedQuestionsList.length})
                    </button>
                </div>
                <div className="ql-tab-actions">
                    <SelectAllQuestionBtn temp_QuestionList={temp_QuestionList} />
                    <SelectRandomQuestion temp_QuestionList={temp_QuestionList} />
                    {selectedQuestionsList.length > 0 && (
                        <button className="ql-launch-btn" onClick={() => dispatch(ModalActions.toggleModal('create-exam-preview-modal'))}>
                            <MdRocketLaunch /> Create Exam
                        </button>
                    )}
                </div>
            </div>

            <div className="ql-questions-area">
                {isLoading ? (
                    <div className="ql-loading"><AiOutlineLoading3Quarters className="animate-spin text-3xl" /></div>
                ) : showList === ALL_QUESTION ? (
                    temp_QuestionList.length > 0 ? (
                        temp_QuestionList.map((el, idx) => (
                            <AllQuestionsPreview key={el.q_id} el={el} idx={idx} handleAddQuestionToList={handleAddQuestionToList} />
                        ))
                    ) : <div className="ql-empty">Search to load questions</div>
                ) : (
                    selectedQuestionsList.length > 0 ? (
                        selectedQuestionsList.map((el, idx) => (
                            <SelectedQuestionsPreview key={el.q_id} el={el} topicHeader={renderTopicHeader(el.main_topic_name, el.sub_topic_section)} />
                        ))
                    ) : <div className="ql-empty">No questions selected</div>
                )}
            </div>
        </div>
    );
}

const CreatePreSubmitView = memo(({ test, finalTestSubmitHandler }) => {
    const { isLoading } = useSelector((s) => s.loader);
    return (
        <CModal id="create-exam-preview-modal" title="Final Review" className="!max-w-[500px]">
            <div className="ql-preview-wrap">
                <div className="ql-preview-row">
                    <div className="ql-preview-left">
                        <HiPencilAlt className="ql-preview-icon" style={{ color: '#2F54EB' }} />
                        <span className="ql-preview-label">EXAM NAME</span>
                    </div>
                    <span className="ql-preview-value">{test?.test_name}</span>
                </div>
                <div className="ql-preview-row">
                    <div className="ql-preview-left">
                        <IoTimeOutline className="ql-preview-icon" style={{ color: '#2F54EB' }} />
                        <span className="ql-preview-label">DURATION</span>
                    </div>
                    <span className="ql-preview-value">{test?.test_duration}m</span>
                </div>
                <div className="ql-preview-row">
                    <div className="ql-preview-left">
                        <AiOutlineStar className="ql-preview-icon" style={{ color: '#2F54EB' }} />
                        <span className="ql-preview-label">MARKS PER Q</span>
                    </div>
                    <span className="ql-preview-value">{test?.marks_per_question}</span>
                </div>
                <div className="ql-preview-row">
                    <div className="ql-preview-left">
                        <MdFactCheck className="ql-preview-icon" style={{ color: '#2F54EB' }} />
                        <span className="ql-preview-label">TOTAL QUESTIONS</span>
                    </div>
                    <span className="ql-preview-value">{test?.total_questions}</span>
                </div>

                <button className="ql-submit-btn" onClick={finalTestSubmitHandler} disabled={isLoading}>
                    {isLoading ? (
                        <>Creating...</>
                    ) : (
                        <>
                            <FaCheckCircle />
                            CONFIRM & GENERATE TEST
                        </>
                    )}
                </button>
            </div>
        </CModal>
    );
});

export default QuestionsList;