import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AddNewTestForm.css';

function AddNewTestForm() {
    const [formStep, setFormStep] = useState(1);
    const navigate = useNavigate();
    const formSteps = [
        { stepNumber: '1', stepName: 'Create Test', stepIcon: 'fa-solid fa-pen-to-square' },
        { stepNumber: '2', stepName: 'Add Question', stepIcon: 'fa-solid fa-file-circle-plus' },
    ];

    function handleFormStep(current) {
        if (formStep === 2 && current === 1) return;
        if (formStep === 2) {
            setFormStep(1);
            return;
        }
        setFormStep(2);
    }

    return (
        <>
            <div className="container bg-white p-5 add-new-test-form-container">
                {/* STEPS */}
                <div>
                    <ul className="list-unstyled bg-light d-flex">
                        {formSteps.map((el) => {
                            return (
                                <li className="d-flex">
                                    <i className={el.stepIcon}></i>
                                    <div className="d-flex flex-column">
                                        <span>Step {el.stepNumber}</span>
                                        <span>{el.stepName}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {formStep === 1 && (
                    <form action="" id="create-test-form">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label htmlFor="" className="form-label">
                                    Test Name
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="" className="form-label">
                                    Test Code
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="" className="form-label">
                                    Test Duration
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="" className="form-label">
                                    Total Questions
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="" className="form-label">
                                    Total Marks
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            <div className="col-md-2">
                                <label htmlFor="" className="form-label">
                                    Difficulty Level
                                </label>
                                <select name="" id="" className="form-control">
                                    <option value="1">Easy</option>
                                    <option value="2">Medium</option>
                                    <option value="3">Hard</option>
                                </select>
                            </div>
                        </div>
                    </form>
                )}

                {formStep === 2 && (
                    <div>
                        <button className="btn btn-primary me-3">
                            <i className="fa-solid fa-file-excel"></i>
                            <span>Excel Import</span>
                        </button>

                        <button
                            onClick={() => navigate('/question-form')}
                            className="btn btn-primary">
                            <i className="fa-solid fa-plus"></i>
                            <span>Add Questions</span>
                        </button>
                    </div>
                )}

                <div className="step-buttons-container">
                    {formStep === 2 && (
                        <button onClick={handleFormStep} className="btn btn-success me-3">
                            Previous
                        </button>
                    )}

                    <button onClick={handleFormStep.bind(null, 1)} className="btn btn-primary">
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddNewTestForm;
