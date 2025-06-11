import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useHttp from '../Hooks/use-http';
import { getBatchAndCenterList } from '../StudentArea/StudentsListByCenter/stud-list-by-center-api';
import CButton from '../UI/CButton';
import { H2 } from '../UI/Headings';
import Input, { InputSelect } from '../UI/Input';
import InputError from '../UI/InputError';
import { SERVER_IP } from '../Utils/Constants';

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

    console.log(centersList, '=centersList');

    const [formData, setFormData] = useState({
        center_code: '',
        examDate: '',
        mockName: '',
        totalQuestions: '',
        marksPerQuestion: '',
        duration: '',
        candidates: '',
        defaultPassword: '',
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

    const createMockSchema = Yup.object().shape({
        center_code: Yup.string().required('Center name is required'),
        examDate: Yup.string().required('Exam date is required'),
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
        defaultPassword: Yup.string().required('Default password is required'),
    });

    const handleMockAdd = async (e) => {
        e.preventDefault();
        try {
            await createMockSchema.validate(formData, { abortEarly: false });
            setErrors({});
            submitMock(formData);
        } catch (error) {
            let __err = {};
            error.inner.forEach((el) => {
                __err[el.path] = el.message;
            });
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
            console.log(data, '=data');
            navigate('/mock-list');
        });
    }

    return (
        <div className="mt-4">
            <H2 className={'text-center'}>Create Mock Exam</H2>

            <div className="max-w-2xl mx-auto p-6">
                <form className="grid grid-cols-2 gap-4" onSubmit={handleMockAdd}>
                    {/* Center Dropdown */}
                    <InputSelect
                        label="Center"
                        name="center_code"
                        value={formData.center_code}
                        onChange={handleChange}
                        error={errors.center_code}>
                        <option value="">Select Center</option>
                        {centersList.length > 0 &&
                            centersList.map((_el) => {
                                return (
                                    <option value={`${_el.cl_number}`}>
                                        ({_el.cl_number}){_el.cl_name}
                                    </option>
                                );
                            })}
                    </InputSelect>
                    <InputError error={errors.center_code} />

                    {/* Exam Date */}
                    <Input
                        label="Exam Date"
                        name="examDate"
                        type="date"
                        onChange={handleChange}
                        value={formData.examDate}
                        error={errors.examDate}>
                        <InputError error={errors.examDate} />
                    </Input>

                    {/* Mock Name */}
                    <Input
                        label="Mock Name"
                        name="mockName"
                        placeholder="Enter mock name"
                        onChange={handleChange}
                        value={formData.mockName}
                        error={errors.mockName}>
                        <InputError error={errors.mockName} />
                    </Input>

                    {/* Total Questions */}
                    <Input
                        label="Total Questions"
                        name="totalQuestions"
                        type="number"
                        placeholder="e.g. 50"
                        onChange={handleChange}
                        value={formData.totalQuestions}
                        error={errors.totalQuestions}>
                        <InputError error={errors.totalQuestions} />
                    </Input>

                    {/* Marks Per Questions */}
                    <Input
                        label="Marks Per Question"
                        name="marksPerQuestion"
                        type="number"
                        placeholder="e.g. 1"
                        onChange={handleChange}
                        value={formData.marksPerQuestion}
                        error={errors.marksPerQuestion}>
                        <InputError error={errors.marksPerQuestion} />
                    </Input>

                    {/* Total Duration */}
                    <Input
                        label="Total Duration (in minutes)"
                        name="duration"
                        type="number"
                        placeholder="e.g. 60"
                        onChange={handleChange}
                        value={formData.duration}
                        error={errors.duration}>
                        <InputError error={errors.duration} />
                    </Input>

                    {/* Total Candidates */}
                    <Input
                        label="Total Candidates"
                        name="candidates"
                        type="number"
                        placeholder="e.g. 100"
                        onChange={handleChange}
                        value={formData.candidates}
                        error={errors.candidates}>
                        <InputError error={errors.candidates} />
                    </Input>

                    {/* Default Password */}
                    <Input
                        label="Default Password"
                        name="defaultPassword"
                        type="text"
                        placeholder="e.g. exam2025"
                        onChange={handleChange}
                        value={formData.defaultPassword}
                        error={errors.defaultPassword}>
                        <InputError error={errors.defaultPassword} />
                    </Input>

                    {/* Submit Button */}
                    <div className="col-span-2 flex justify-center pt-4">
                        <CButton type="submit" isLoading={isLoading}>
                            Create Mock Test
                        </CButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateMockForm;
