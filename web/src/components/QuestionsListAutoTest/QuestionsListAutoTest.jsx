let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import { useEffect, useLayoutEffect, useState } from 'react';
import { BiReset } from 'react-icons/bi';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import {
    MdAutoAwesome, MdAddChart, MdSearch, MdOutlineTableChart,
    MdOutlineDriveFileRenameOutline, MdTimer, MdStars, MdFactCheck,
    MdCheckCircle
} from 'react-icons/md';
import { FaRocket, FaLayerGroup, FaEye } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import {
    EditQuestionFormActions,
    getPostListThunk,
    getSubjectsListThunk,
    getTopicsListThunk,
} from '../../Store/edit-question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import PostListDropdown from '../QuestionForm/PostListDropdown/PostListDropdown.jsx';
import SubjectListDropdown from '../QuestionForm/SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from '../QuestionForm/TopicListDropdown/TopicListDropdown.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import CModal from '../UI/CModal.jsx';
import Spinner from '../UI/Spinner.jsx';
import { TEST_LIST_MODE } from '../Utils/Constants.jsx';
import './QuestionsListAutoTest.css';

function QuestionsListAutoTest() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();

    const { testDetails: test, topicList, selectedTopicList, isTestDetailsFilled } = useSelector((state) => state.tests);
    const { data: _formData, postsList, subjectsList } = useSelector((state) => state.questionForm);
    const { isLoading } = useSelector((state) => state.loader);
    const [previewQuestions, setPreviewQuestions] = useState([]);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    useLayoutEffect(() => {
        if (!isTestDetailsFilled) navigate('/tests/create/form');
    }, [isTestDetailsFilled]);

    useEffect(() => {
        if (postsList.length === 0) dispatch(getPostListThunk());
    }, []);

    useEffect(() => {
        if (_formData.post_id) {
            dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
            dispatch(testsSliceActions.setTopicList([]));
        }
    }, [_formData.post_id]);

    useEffect(() => {
        if (_formData.subject_id) {
            dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
            dispatch(testsSliceActions.setTopicList([]));
            getTopicAndQuestionCount(_formData.subject_id);
            let selectedSubject = subjectsList.filter((el) => el.id == _formData.subject_id);
            if (selectedSubject.length !== 0)
                dispatch(EditQuestionFormActions.setSubjectName(selectedSubject[0].mtl_name));
        }
    }, [_formData.subject_id]);

    const getTopicAndQuestionCount = (subjectId) => {
        if (!subjectId) return;
        sendRequest({
            url: SERVER_IP + '/api/topics/get-topic-list-and-question-count',
            method: 'POST',
            body: JSON.stringify({ subjectId }),
        }, ({ data }) => dispatch(testsSliceActions.setTopicList(data)));
    };

    const searchTopics = () => {
        if (!_formData?.subject_id) { Swal.fire('Warning', 'Please select subject'); return false; }
        getTopicAndQuestionCount(_formData.subject_id);
    };

    const topicListCheckboxHandler = (e) => {
        const isChecked = e.target.checked;
        const topicId = parseInt(e.target.dataset.id);
        const updatedList = topicList.map((topic) =>
            topic.id === topicId ? { ...topic, isChecked, selectedCount: isChecked ? topic.selectedCount : 0 } : topic
        );
        dispatch(testsSliceActions.setTopicList(updatedList));
    };

    const questionCountChangeHandler = (e) => {
        const { value, name } = e.target;
        if (isNaN(value)) { e.target.value = ''; return false; }
        let copy = topicList.map((el) => el);
        const idx = copy.findIndex((el) => +el.id === +name);
        if (idx === -1) return false;
        const max = copy[idx].question_count;
        if (+value > max) { e.target.value = max.toString(); copy[idx] = { ...copy[idx], selectedCount: max }; }
        else copy[idx] = { ...copy[idx], selectedCount: parseInt(value) };
        dispatch(testsSliceActions.setTopicList([...copy]));
    };

    const handleAddToTestChart = () => {
        if (!validateQuestionsSelection()) return false;
        let subjectName = subjectsList.filter((el) => el.id == topicList[0].subject_id);
        subjectName = subjectName[0].mtl_name;
        let data = {
            _postName: _formData.post_name,
            _subjectName: subjectName,
            _topicsList: topicList.filter((el) => el?.selectedCount >= 1),
        };
        data['_totalQuestionsCount'] = data._topicsList.reduce((sum, el) => sum + el.selectedCount, 0);
        let updatedList = [...selectedTopicList];
        let existIdx = updatedList.findIndex((el) => el._subjectName == data._subjectName);
        if (existIdx !== -1) updatedList.splice(existIdx, 1);
        updatedList.push(data);
        dispatch(testsSliceActions.setSelectedTopicList(updatedList));
        dispatch(testsSliceActions.setTopicList([]));
        updateTotalQuestionsCount(updatedList);
    };

    function updateTotalQuestionsCount(list) {
        let count = 0;
        list.forEach((item) => item._topicsList.forEach((el) => { count += el.selectedCount; }));
        dispatch(testsSliceActions.updateTotalQuestionsCount_AUTO_TEST(count));
    }

    const handleRemoveFromEamChart = async ({ idx, el }) => {
        let ok = await confirmDialouge({ title: 'Are you sure?', text: `Delete ${el._subjectName}?` });
        if (!ok) return false;
        let updated = [...selectedTopicList];
        updated.splice(idx, 1);
        dispatch(testsSliceActions.setSelectedTopicList(updated));
        updateTotalQuestionsCount(updated);
    };

    const handleEditFromExamChart = async ({ idx, el }) => {
        const subjectId = el._topicsList[0].subject_id;
        sendRequest({
            url: SERVER_IP + '/api/topics/get-topic-list-and-question-count',
            method: 'POST',
            body: JSON.stringify({ subjectId }),
        }, ({ data }) => {
            let updated = [...data];
            el._topicsList.forEach((item1) => {
                let i = updated.findIndex((item2) => item2.id == item1.id);
                if (i !== -1) updated[i] = item1;
            });
            dispatch(testsSliceActions.setTopicList(updated));
        });
    };

    const validateQuestionsSelection = () => {
        let isValid = false, checkedCount = 0;
        for (let i = 0; i < topicList.length; i++) {
            let el = topicList[i];
            if (el.isChecked) {
                checkedCount++;
                if (!el.selectedCount || el.selectedCount == 0) {
                    Swal.fire({ title: 'Oops!', text: 'Please enter total questions', icon: 'warning' });
                    return false;
                }
                isValid = true;
            }
        }
        if (checkedCount == 0) { Swal.fire({ title: 'Oops!', text: 'Please select question', icon: 'warning' }); return false; }
        return isValid;
    };

    const finalTestSubmitHandler = async () => {
        const allTopics = [];
        selectedTopicList.forEach((item) => allTopics.push(...item._topicsList));
        sendRequest({
            url: SERVER_IP + '/api/test/v2/create-auto',
            method: 'POST',
            body: JSON.stringify({ test, topicList: allTopics }),
        }, ({ success, data }) => {
            if (success == 1) {
                Swal.fire('Success', 'Test has been generated!');
                const updated = { ...data.testDetails, mode: TEST_LIST_MODE.TEST_LIST };
                dispatch(testsSliceActions.setTestDetails(updated));
                dispatch(testsSliceActions.setTestDetailsId(updated.id));
                setTimeout(() => navigate('/tests/list/questions'), 10);
            }
        });
    };

    const handleResetExam = async () => {
        let ok = await confirmDialouge({ title: 'Are you sure?', text: 'Reset exam?' });
        if (!ok) return false;
        dispatch(EditQuestionFormActions.reset());
        dispatch(testsSliceActions.reset());
        navigate('/tests/create/form');
    };

    const handlePreviewTopic = (topicId) => {
        setIsPreviewLoading(true);
        dispatch(ModalActions.toggleModal('topic-questions-preview-modal'));
        sendRequest({
            url: SERVER_IP + '/api/questions/list',
            method: 'POST',
            body: JSON.stringify({ post_id: _formData.post_id, subject_id: _formData.subject_id, topic_id: topicId }),
        }, (data) => {
            setPreviewQuestions(data.data.slice(0, 10));
            setIsPreviewLoading(false);
        });
    };

    const totalSelectedQ = selectedTopicList.reduce((s, el) => s + el._totalQuestionsCount, 0);

    return (
        <div className="qat-root">
            <CreatePreSubmitView test={test} finalTestSubmitHandler={finalTestSubmitHandler} totalSelectedQ={totalSelectedQ} />
            <TopicQuestionsPreviewModal questions={previewQuestions} isLoading={isPreviewLoading} />

            <div className="qat-header-bar">
                <div className="qat-header-content">
                    <MdAutoAwesome />
                    <span>GENERATE AUTO TEST</span>
                </div>
                <button className="qat-header-btn" onClick={handleResetExam}>
                    <BiReset /> Reset Exam
                </button>
            </div>

            <div className="qat-info-banner">
                <div className="qat-info-stats">
                    {[
                        { label: 'Test Name', value: test.test_name, color: '#06B6D4' },
                        { label: 'Duration', value: `${test.test_duration}m`, color: '#10B981' },
                        { label: 'Marks/Q', value: test.marks_per_question, color: '#8B5CF6' },
                        { label: 'Total Q', value: totalSelectedQ, color: '#F59E0B' },
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

            <div className="qat-layout">
                <div className="qat-main">
                    <div className="qat-card">
                        <div className="qat-filter-row">
                            <div className="qat-filter-field">
                                <PostListDropdown isShowAddNewBtn={false} />
                            </div>
                            <div className="qat-filter-field">
                                <SubjectListDropdown isShowAddNewBtn={false} />
                            </div>
                            <div className="qat-filter-field">
                                <TopicListDropdown isShowAddNewBtn={false} />
                            </div>
                            <button className="qat-search-btn" onClick={searchTopics}><MdSearch /> Search</button>
                        </div>
                    </div>

                    <div className="qat-card">
                        <div className="qat-card-header">
                            <div className="qat-card-icon" style={{ background: '#ECFEFF', color: '#0891B2' }}><FaLayerGroup /></div>
                            <h2 className="qat-card-title">Select Topics to Include</h2>
                        </div>

                        {isLoading ? <div className="qat-loading"><Spinner /></div> : (
                            topicList.length > 0 ? (
                                <div className="qat-table-wrap">
                                    <table className="qat-table">
                                        <thead>
                                            <tr>
                                                <th className="qat-th">✓</th>
                                                <th className="qat-th">TOPIC NAME</th>
                                                <th className="qat-th">AVAIL.</th>
                                                <th className="qat-th">PREVIEW</th>
                                                <th className="qat-th">COUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topicList.map((el) => (
                                                <tr key={el.id} className={`qat-tr ${el.isChecked ? 'qat-tr--checked' : ''}`}>
                                                    <td className="qat-td">
                                                        <input type="checkbox" data-id={el.id} checked={el.isChecked || false} onChange={topicListCheckboxHandler} />
                                                    </td>
                                                    <td className="qat-td"><span className="qat-topic-name">{el.topic_name}</span></td>
                                                    <td className="qat-td"><span className="qat-avail-badge">{el.question_count} Q</span></td>
                                                    <td className="qat-td">
                                                        <button className="qat-preview-btn" onClick={() => handlePreviewTopic(el.id)}><FaEye /></button>
                                                    </td>
                                                    <td className="qat-td">
                                                        <input type="number" name={el.id} value={el.selectedCount || 0} onChange={questionCountChangeHandler} disabled={!el.isChecked} className="qat-count-input" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="qat-add-row">
                                        <button className="qat-add-btn" onClick={handleAddToTestChart}><MdAddChart /> Add to Exam Chart</button>
                                    </div>
                                </div>
                            ) : <div className="qat-empty">Search to load topics</div>
                        )}
                    </div>
                </div>

                <div className="qat-sidebar">
                    <div className="qat-card">
                        <div className="qat-card-header">
                            <div className="qat-card-icon" style={{ background: '#FFF7ED', color: '#D97706' }}><MdOutlineTableChart /></div>
                            <h2 className="qat-card-title">Exam Chart</h2>
                        </div>
                        {selectedTopicList.length > 0 ? (
                            <>
                                <div className="qat-chart-list">
                                    {selectedTopicList.map((el, idx) => (
                                        <div key={idx} className="qat-chart-row">
                                            <div className="qat-chart-info">
                                                <div className="qat-chart-subject">{el._subjectName}</div>
                                                <div className="qat-chart-meta"><span>{el._topicsList.length} topics</span> • <span className="qat-chart-q">{el._totalQuestionsCount} Q</span></div>
                                            </div>
                                            <div className="qat-chart-actions">
                                                <button className="qat-chart-btn--edit" onClick={() => handleEditFromExamChart({ idx, el })}><FaEdit /></button>
                                                <button className="qat-chart-btn--del" onClick={() => handleRemoveFromEamChart({ idx, el })}><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="qat-chart-total">
                                    <span className="qat-chart-total-label">TOTAL SELECTED</span>
                                    <span className="qat-chart-total-value">{totalSelectedQ}</span>
                                </div>
                                <button className="qat-create-btn" onClick={() => dispatch(ModalActions.toggleModal('create-exam-preview-modal'))}><FaRocket /> GENERATE TEST</button>
                            </>
                        ) : (
                            <div className="qat-empty">Add topics to begin</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CreatePreSubmitView({ test, finalTestSubmitHandler, totalSelectedQ }) {
    const { isLoading } = useSelector((s) => s.loader);
    return (
        <CModal id="create-exam-preview-modal" title="Final Review" width="450px">
            <div className="qat-preview-table">
                {[
                    { label: 'Exam Name', value: test.test_name, icon: <MdOutlineDriveFileRenameOutline /> },
                    { label: 'Duration', value: `${test.test_duration}m`, icon: <MdTimer /> },
                    { label: 'Marks Per Q', value: test.marks_per_question, icon: <MdStars /> },
                    { label: 'Total Questions', value: totalSelectedQ, icon: <MdFactCheck /> },
                ].map((r, i) => (
                    <div key={i} className="qat-preview-row">
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-500 text-lg">{r.icon}</span>
                            <span className="qat-preview-label">{r.label}</span>
                        </div>
                        <span className="qat-preview-value">{r.value || '—'}</span>
                    </div>
                ))}
            </div>
            <button className="qat-create-btn qat-btn-success" onClick={finalTestSubmitHandler} disabled={isLoading}>
                <MdCheckCircle /> {isLoading ? 'Generating...' : 'Confirm & Generate Test'}
            </button>
        </CModal>
    );
}

function TopicQuestionsPreviewModal({ questions, isLoading }) {
    return (
        <CModal id="topic-questions-preview-modal" title="Topic Questions Preview" className="w-[1200px] max-w-[95vw]">
            {isLoading ? <div className="qat-loading"><Spinner /></div> : (
                <div className="qat-preview-list">
                    {questions.length > 0 ? questions.map((q, i) => (
                        <div key={i} className="qat-preview-item mb-6 border-b border-slate-100 pb-4 last:border-0">
                            <div className="qat-preview-q flex gap-2 font-bold text-slate-800">
                                <span>{i + 1}.</span>
                                <div dangerouslySetInnerHTML={{ __html: q.q }} />
                            </div>
                            <div className="qat-preview-options grid grid-cols-2 gap-4 mt-3 text-sm text-slate-600">
                                {q.q_a && <div className="flex gap-2"><strong>A:</strong> <div dangerouslySetInnerHTML={{ __html: q.q_a }} /></div>}
                                {q.q_b && <div className="flex gap-2"><strong>B:</strong> <div dangerouslySetInnerHTML={{ __html: q.q_b }} /></div>}
                                {q.q_c && <div className="flex gap-2"><strong>C:</strong> <div dangerouslySetInnerHTML={{ __html: q.q_c }} /></div>}
                                {q.q_d && <div className="flex gap-2"><strong>D:</strong> <div dangerouslySetInnerHTML={{ __html: q.q_d }} /></div>}
                                {q.q_e && <div className="flex gap-2"><strong>E:</strong> <div dangerouslySetInnerHTML={{ __html: q.q_e }} /></div>}
                            </div>
                        </div>
                    )) : <p>No questions found in this topic.</p>}
                </div>
            )}
        </CModal>
    );
}

export default QuestionsListAutoTest;
