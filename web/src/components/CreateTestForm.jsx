import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    MdAssignment, MdList, MdOutlineQuiz, MdAutoAwesome, MdCheckCircle
} from 'react-icons/md';
import { testsSliceActions } from '../Store/tests-slice.jsx';
import { EditQuestionFormActions } from '../Store/edit-question-form-slice.jsx';
import Input from './UI/Input.jsx';
import { toast } from 'react-toastify';
import './CreateTestForm.css';

const TEST_MODE = { AUTO: 'auto', MANUAL: 'manual' };

function CreateTestForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const test = useSelector((state) => state.tests.testDetails);
    const [creationMode, setCreationMode] = useState(test?.test_creation_type || TEST_MODE.AUTO);

    useEffect(() => {
        // Only reset if we are NOT editing an existing test (i.e., no test_id present)
        if (!test?.test_id) {
            dispatch(testsSliceActions.resetTestDetails());
            dispatch(EditQuestionFormActions.reset());
            dispatch(testsSliceActions.setTestDetailsFilled(false));
        }
    }, [dispatch, test?.test_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(testsSliceActions.setTestDetailsOnChange({ key: name, value: value }));
    };

    const handleContinue = () => {
        if (!test.test_name || !test.test_duration || !test.marks_per_question || !test.test_passing_mark) {
            toast.error('Please fill all mandatory fields (*)');
            return;
        }
        dispatch(testsSliceActions.setTestDetailsOnChange({ key: 'test_creation_type', value: creationMode }));
        dispatch(testsSliceActions.setTestDetailsFilled(true));
        navigate(`/tests/create/${creationMode}`);
    };

    return (
        <div className="ctf-simple-wrapper">
            {/* Header Bar */}
            <div className="ctf-title-bar-manual">
                <div className="ctf-title-content">
                    <MdAssignment />
                    <span>{test?.test_id ? 'EDIT TEST' : 'CREATE NEW TEST'}</span>
                </div>
                <button className="ctf-header-btn" onClick={() => navigate('/tests/list')}>
                    <MdList className="text-2xl" /> View Test List
                </button>
            </div>

            {/* Main Form Card */}
            <div className="ctf-form-card">
                <div className="ctf-form-grid">

                    <div className="ctf-form-group full">
                        <Input
                            label={<>TEST NAME <span className="ctf-required-star">*</span></>}
                            name="test_name"
                            value={test?.test_name || ''}
                            onChange={handleChange}
                            placeholder="e.g. Monthly Unit Test - Jan 2024"
                            className="ctf-custom-input"
                        />
                    </div>

                    <div className="ctf-form-group">
                        <Input
                            label={<>TEST DURATION (MINS) <span className="ctf-required-star">*</span></>}
                            type="number"
                            name="test_duration"
                            value={test?.test_duration || ''}
                            onChange={handleChange}
                            placeholder="e.g. 90"
                            className="ctf-custom-input"
                        />
                    </div>

                    <div className="ctf-form-group">
                        <Input
                            label={<>MARKS PER QUESTION <span className="ctf-required-star">*</span></>}
                            type="number"
                            name="marks_per_question"
                            value={test?.marks_per_question || ''}
                            onChange={handleChange}
                            placeholder="e.g. 2"
                            className="ctf-custom-input"
                        />
                    </div>

                    <div className="ctf-form-group">
                        <Input
                            label={<>PASSING MARKS <span className="ctf-required-star">*</span></>}
                            type="number"
                            name="test_passing_mark"
                            value={test?.test_passing_mark || ''}
                            onChange={handleChange}
                            placeholder="e.g. 35"
                            className="ctf-custom-input"
                        />
                    </div>

                    <div className="ctf-form-group">
                        <Input
                            label="NEGATIVE MARKS"
                            type="number"
                            name="negative_mark"
                            value={test?.negative_mark || ''}
                            onChange={handleChange}
                            placeholder="e.g. 0.25"
                            className="ctf-custom-input"
                        />
                    </div>

                    <div className="ctf-form-group span-2">
                        <label className="ctf-mode-label">CREATION MODE</label>
                        <div className="ctf-mode-selector">
                            <div
                                className={`ctf-mode-tab ${creationMode === TEST_MODE.AUTO ? 'active-auto' : ''}`}
                                onClick={() => setCreationMode(TEST_MODE.AUTO)}
                            >
                                <MdAutoAwesome /> AUTO
                            </div>
                            <div
                                className={`ctf-mode-tab ${creationMode === TEST_MODE.MANUAL ? 'active-manual' : ''}`}
                                onClick={() => setCreationMode(TEST_MODE.MANUAL)}
                            >
                                <MdOutlineQuiz /> MANUAL
                            </div>
                        </div>
                    </div>

                    <div className="ctf-footer">
                        <button className="ctf-btn-primary" onClick={handleContinue}>
                            <MdCheckCircle />
                            <span>CONFIRM & CONTINUE</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CreateTestForm;
