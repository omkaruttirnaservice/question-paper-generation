import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useHttp from '../Hooks/use-http';
import { getBatchAndCenterList } from '../StudentArea/StudentsListByCenter/stud-list-by-center-api';
import { MdModelTraining, MdArrowBack, MdSave, MdList } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Input, { InputSelect } from '../UI/Input';
import InputError from '../UI/InputError';
import { SERVER_IP } from '../Utils/Constants';
import { toast } from 'react-toastify';
import '../CreateTestForm.css';

function CreateMockForm() {
    const navigate = useNavigate();
    const { sendRequest, isLoading } = useHttp();

    const [centersList, setCentersList] = useState([]);

    const {
        data: _batchAndCenterList,
        isError: getBatchAndCenterListErr,
        isPending: getBatchAndCenterListLoading,
    } = useQuery({
        queryKey: ['get-batch-and-center-list'],
        queryFn: getBatchAndCenterList,
    });

    useLayoutEffect(() => {
        if (_batchAndCenterList?.data) {
            let { _batchList, _centersList } = _batchAndCenterList.data;
            setCentersList(_centersList);
        }
    }, [_batchAndCenterList]);

    const [formData, setFormData] = useState({
        center_code: '',
        examDate: '',
        examTime: '10:00 AM TO 01:00 PM',
        mockName: '',
        totalQuestions: '',
        marksPerQuestion: '',
        duration: '',
        candidates: '',
        startingRollNumber: '1001',
        defaultPassword: '1111',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => {
            return {
                ...prev,
                [name]: null,
            };
        });
    };

    const examTimeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s?TO\s?(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    const createMockSchema = Yup.object().shape({
        center_code: Yup.string().required('Center name is required'),
        examDate: Yup.string().required('Exam date is required'),
        examTime: Yup.string()
            .required('Exam time is required')
            .matches(examTimeRegex, 'Invalid format. Use: HH:MM AM TO HH:MM PM'),
        mockName: Yup.string().required('Mock name is required'),
        totalQuestions: Yup.number()
            .typeError('Total Questions must be a number')
            .required('Total questions required')
            .min(1, 'Must be at least 1'),
        marksPerQuestion: Yup.number()
            .typeError('Marks per question must be number')
            .required('Enter marks per question'),
        duration: Yup.number()
            .typeError('Duration must be a number')
            .required('Total duration required')
            .min(1, 'Duration must be greater than 0'),
        candidates: Yup.number()
            .typeError('Total candidates must be a number')
            .required('Total candidates required')
            .min(1, 'Must be at least 1'),
        startingRollNumber: Yup.number().required('Enter starting roll number'),
        defaultPassword: Yup.string().required('Default password is required'),
    });

    const handleMockAdd = async (e) => {
        e.preventDefault();
        try {
            await createMockSchema.validate(formData, { abortEarly: false });
            setErrors({});
            submitMock(formData);
        } catch (error) {
            console.error('Validation Error:', error);
            toast.error('Please fix the errors in the form before submitting.');
            let __err = {};
            if (error.inner) {
                error.inner.forEach((el) => {
                    __err[el.path] = el.message;
                });
            }
            setErrors(__err);
        }
    };

    function submitMock(formData) {
        const rD = {
            url: SERVER_IP + '/api/test/create-mock',
            method: 'POST',
            body: JSON.stringify(formData),
        };
        sendRequest(rD, (data) => {
            navigate('/mock/list');
        });
    }

    return (
        <div className="ctf-simple-wrapper">
            {/* Header Bar */}
            <div className="ctf-title-bar-manual">
                <div className="ctf-title-content">
                    <MdModelTraining />
                    <span>CREATE MOCK EXAM</span>
                </div>
                <button className="ctf-header-btn" onClick={() => navigate('/mock/list')}>
                    <MdList className="text-2xl" /> View Mock List
                </button>
            </div>

            <div className="ctf-form-card">
                <form className="ctf-form-grid" onSubmit={handleMockAdd}>
                    
                    {/* Mock Name */}
                    <div className="ctf-form-group full">
                        <Input
                            label={<>MOCK NAME <span className="ctf-required-star">*</span></>}
                            name="mockName"
                            placeholder="e.g. Maharashtra State Level Mock - 2024"
                            onChange={handleChange}
                            value={formData.mockName}
                            error={errors.mockName}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.mockName} />
                    </div>

                    {/* Center Dropdown */}
                    <div className="ctf-form-group">
                        <InputSelect
                            label={<>EXAM CENTER <span className="ctf-required-star">*</span></>}
                            name="center_code"
                            value={formData.center_code}
                            onChange={handleChange}
                            error={errors.center_code}
                            className="ctf-custom-input"
                        >
                            <option value="">Select Center</option>
                            {centersList.length > 0 &&
                                centersList.map((_el) => (
                                    <option key={_el.cl_number} value={`${_el.cl_number}`}>
                                        ({_el.cl_number}) {_el.cl_name}
                                    </option>
                                ))
                            }
                        </InputSelect>
                        <InputError error={errors.center_code} />
                    </div>

                    {/* Exam Date */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>EXAM DATE <span className="ctf-required-star">*</span></>}
                            name="examDate"
                            type="date"
                            onChange={handleChange}
                            value={formData.examDate}
                            error={errors.examDate}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.examDate} />
                    </div>

                    {/* Exam Time */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>EXAM TIME <span className="ctf-required-star">*</span></>}
                            name="examTime"
                            type="text"
                            placeholder="10:00 AM TO 01:00 PM"
                            onChange={handleChange}
                            value={formData.examTime}
                            error={errors.examTime}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.examTime} />
                    </div>

                    {/* Total Questions */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>QUESTIONS <span className="ctf-required-star">*</span></>}
                            name="totalQuestions"
                            type="number"
                            placeholder="e.g. 50"
                            onChange={handleChange}
                            value={formData.totalQuestions}
                            error={errors.totalQuestions}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.totalQuestions} />
                    </div>

                    {/* Marks Per Questions */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>MARKS / QUES <span className="ctf-required-star">*</span></>}
                            name="marksPerQuestion"
                            type="number"
                            placeholder="e.g. 1"
                            onChange={handleChange}
                            value={formData.marksPerQuestion}
                            error={errors.marksPerQuestion}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.marksPerQuestion} />
                    </div>

                    {/* Total Duration */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>DURATION (MINS) <span className="ctf-required-star">*</span></>}
                            name="duration"
                            type="number"
                            placeholder="e.g. 60"
                            onChange={handleChange}
                            value={formData.duration}
                            error={errors.duration}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.duration} />
                    </div>

                    {/* Total Candidates */}
                    <div className="ctf-form-group">
                        <Input
                            label={<>TOTAL CANDIDATES <span className="ctf-required-star">*</span></>}
                            name="candidates"
                            type="number"
                            placeholder="e.g. 100"
                            onChange={handleChange}
                            value={formData.candidates}
                            error={errors.candidates}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.candidates} />
                    </div>

                    {/* Starting Roll Number */}
                    <div className="ctf-form-group">
                        <Input
                            label="STARTING ROLL"
                            name="startingRollNumber"
                            type="text"
                            placeholder="e.g. 1001"
                            onChange={handleChange}
                            value={formData.startingRollNumber}
                            error={errors.startingRollNumber}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.startingRollNumber} />
                    </div>

                    {/* Default Password */}
                    <div className="ctf-form-group">
                        <Input
                            label="DEFAULT PASSWORD"
                            name="defaultPassword"
                            type="text"
                            placeholder="e.g. 1111"
                            onChange={handleChange}
                            value={formData.defaultPassword}
                            error={errors.defaultPassword}
                            className="ctf-custom-input"
                        />
                        <InputError error={errors.defaultPassword} />
                    </div>

                    {/* Submit Button */}
                    <div className="ctf-footer">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="ctf-btn-primary"
                        >
                            {isLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                            ) : (
                                <MdSave />
                            )}
                            <span>CONFIRM & CREATE MOCK</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateMockForm;
