import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEye, FaTrash } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import TestListSchemaYUP from '../PublishedTestsList/TestsListSchemaYUP.jsx';
import { getExamsList, getServerIP } from '../StudentArea/AddNewStudent/api.jsx';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H1 } from '../UI/Headings.jsx';
import Input, { InputLabel } from '../UI/Input.jsx';
import InputError from '../UI/InputError.jsx';
import SelectPostDropdown from './SelectPostDropdown.jsx';
import './TestsList.css';
import { generateTestKey } from './utils.js';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;

let initialStatePublishForm = {
    test_id_for_publish: null,
    batch: null,
    publish_date: null,
    test_key: null,
    test_details: null,
    server_ip_address: null,
    selected_posts: null,
    is_show_exam_sections: 'YES',
    is_show_mark_for_review: 'YES',
    is_show_clear_response: 'YES',
    end_button_time: 15,
};

function TestsList() {
    const navigate = useNavigate();
    const [serverIPAddresses, setServerIPAddresses] = useState([]);
    const [batchCount, setBatchCount] = useState([]);
    // prettier-ignore
    const [publishExamForm, setPublishExamForm] = useState(initialStatePublishForm);
    const [errors, setErrors] = useState({});
    const { sendRequest } = useHttp();
    const dispatch = useDispatch();
    const [testsList, setTestsList] = useState([]);

    const getServerIPQuery = useQuery({
        queryKey: ['get server ip list'],
        queryFn: getServerIP,
        refetchOnMount: false,
        retry: false,
    });

    useEffect(() => {
        if (getServerIPQuery?.data) {
            setServerIPAddresses(getServerIPQuery?.data?.data || []);
        }
    }, [getServerIPQuery.data]);

    useEffect(() => {
        let _bList = [];
        for (let i = 1; i <= 10; i++) {
            _bList.push(i);
        }
        setBatchCount(_bList);
    }, []);

    const getExamListQuery = useQuery({
        queryFn: getExamsList,
    });

    useEffect(() => {
        if (getExamListQuery?.data) {
            setTestsList(getExamListQuery?.data?.data?.data || []);
        }
    }, [getExamListQuery?.data]);

    const handlePublishExam = (el) => {
        if (!el.id) return;
        setPublishExamForm((prev) => {
            return {
                ...prev,
                test_id_for_publish: el.id,
                test_details: el,
            };
        });
        dispatch(ModalActions.toggleModal('publish-exam-modal'));
        // after opening publish exam modal fetch the url/ip of form filling sites
        //  cause it will require to fetch post list of that particular process
        getServerIPQuery.refetch();
    };

    const handleDeleteTest = async (id) => {
        if (!id) return false;

        const isConfirm = await confirmDialouge({
            title: 'Are you sure!',
            text: 'Do you want to delete test?',
        });

        if (!isConfirm) return false;

        let reqData = {
            url: SERVER_IP + '/api/test/delete',
            method: 'DELETE',
            body: JSON.stringify({ deleteId: id }),
        };

        sendRequest(reqData, ({ success }) => {
            if (success == 1) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Deleted successfully',
                    icon: 'success',
                });

                let updatedTestList = testsList.filter((el) => el.id != id);
                setTestsList(updatedTestList);
            }
        });
    };

    const handleViewQuestions = (el) => {
        if (!el.id) return false;

        dispatch(testsSliceActions.setPreviewTestDetails(el));

        navigate('/view-test-questions');
    };

    const handleChange = (e) => {
        let { name, value, type } = e.target;

        if (type === 'radio') {
            value = e.target.value;
        }

        // TestListSchemaYUP.validateAt(name, { [name]: value })
        // 	.then(() => {
        // 		setErrors(name, { [name]: null });
        // 	})
        // 	.catch((error) => {
        // 		setErrors({ ...errors, [name]: error.message });
        // 	});

        setPublishExamForm((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const validatePublishExam = () => {
        TestListSchemaYUP.validate(publishExamForm, { abortEarly: false })
            .then(() => {})
            .catch((error) => {
                let _err = {};
                error.inner.forEach((err) => {
                    _err[err.path] = err.message;
                });
                setErrors(_err);
            });
    };

    const handleGenerateTestKey = async (e) => {
        e.preventDefault();

        await generateAndSetKey();
    };

    const generateAndSetKey = async () => {
        const testId = publishExamForm.test_id_for_publish;
        if (testId == null) return false;

        let testKey = await generateTestKey(testId);

        if (!testKey) {
            await generateAndSetKey();
        } else {
            setPublishExamForm((prev) => ({
                ...prev,
                test_key: testKey,
            }));
        }
    };

    const handleFinalPublishExam = async () => {
        console.log(publishExamForm, '==publishExamForm==');
        try {
            await TestListSchemaYUP.validate(publishExamForm, { abortEarly: false });
            setErrors({});

            let _req = {
                url: SERVER_IP + '/api/test/publish',
                method: 'POST',
                body: JSON.stringify(publishExamForm),
            };

            sendRequest(_req, ({ success, data }) => {
                if (success == 1) {
                    Swal.fire({
                        title: 'Success',
                        text: data.message,
                        icon: 'success',
                    });

                    dispatch(ModalActions.toggleModal('publish-exam-modal'));
                    dispatch(
                        testsSliceActions.setPreviewPublishedTestDetailsId(data.testDetails.id)
                    );
                    dispatch(testsSliceActions.setPreviewPublishedTestDetails(data.testDetails));
                    setTimeout(() => {
                        navigate('/view-published-test-questions');
                    }, 10);
                    setPublishExamForm(initialStatePublishForm);
                }
            });
        } catch (error) {
            console.log(error, '==error==');
            let _err = {};
            error.inner.forEach((err) => {
                _err[err.path] = err.message;
            });
            setErrors(_err);
        }
    };

    const columns = [
        {
            sortable: true,
            name: '#',
            selector: (row, idx) => idx + 1,
            width: '4rem',
        },
        {
            sortable: true,
            name: 'Test Id',
            selector: (row) => row.id,
            width: '7rem',
        },
        {
            sortable: true,
            name: 'Test Name',
            selector: (row) => row.mt_name,
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Duration',
            selector: (row) => row.mt_test_time,
            width: '7rem',
        },
        {
            sortable: true,
            name: 'Total Questions',
            selector: (row) => row.mt_total_test_question,
            width: '8rem',
        },
        {
            sortable: true,
            name: 'Marks Per Q.',
            selector: (row) => row.mt_mark_per_question,
            width: '6rem',
        },
        {
            sortable: true,
            name: 'Is -ve marking',
            selector: (row) => (row.mt_is_negative == 1 ? 'Yes' : 'No'),
            width: '8rem',
        },
        {
            sortable: true,
            name: 'Passing Marks',
            selector: (row) => row.mt_passing_out_of,
            width: '6rem',
        },
        {
            name: 'Publish Exam',
            cell: (row) => (
                <div className="flex justify-center">
                    <CButton
                        className="btn--primary text-xs"
                        onClick={handlePublishExam.bind(null, row)}>
                        Publish
                    </CButton>
                </div>
            ),
            selector: (row) => row.sl_roll_number,
            width: '8rem',
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex gap-2 items-center justify-center">
                    <CButton
                        className="btn--danger m-0"
                        onClick={handleDeleteTest.bind(null, row.id)}
                        icon={<FaTrash />}></CButton>
                    <CButton
                        className="btn--info m-0"
                        onClick={handleViewQuestions.bind(null, row)}
                        icon={<FaEye />}></CButton>
                </div>
            ),
            selector: (row) => row.sl_roll_number,
            width: '6rem',
        },
    ];

    return (
        <>
            <CModal id="publish-exam-modal" title={'Publish Exam'}>
                <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                        <InputLabel name="Select Publish Date" htmlFor={'publish_date'} />
                        <DatePicker
                            autoComplete="off"
                            onChange={(date) => {
                                setPublishExamForm((prev) => {
                                    return {
                                        ...prev,
                                        publish_date: `${date.getDate()}-${
                                            date.getMonth() + 1
                                        }-${date.getFullYear()}`,
                                    };
                                });
                            }}
                            placeholderText="select date"
                            defaultValue
                            name="publish_date"
                            id="publish_date"
                            value={publishExamForm.publish_date}
                            className="block !w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40"
                        />
                        <InputError error={errors.publish_date} />
                    </div>

                    <div className="relative">
                        <InputLabel name="Batch No" htmlFor="batch" />

                        <select
                            name="batch"
                            id="batch"
                            onChange={handleChange}
                            value={publishExamForm.batch}
                            className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40">
                            <option value="">-- Select -- </option>

                            {batchCount.map((el, idx) => {
                                return <option value={idx + 1}>Batch {idx + 1}</option>;
                            })}
                        </select>

                        <InputError error={errors.batch} />
                    </div>

                    <div className="relative col-span-2">
                        <InputLabel name="Select IP/URL" htmlFor="server_ip_address" />
                        <select
                            name="server_ip_address"
                            id="server_ip_address"
                            onChange={handleChange}
                            value={publishExamForm.server_ip_address}
                            className="!w-full px-1 py-2 border focus:ring-2 focus:outline-4 outline-none transition-all duration-300 disabled:bg-gray-400/40">
                            <option value="">-- Select -- </option>
                            {getServerIPQuery.isLoading && <option>Loading...</option>}

                            {serverIPAddresses?.length > 0 &&
                                serverIPAddresses.map((el, idx) => {
                                    return (
                                        <option value={el.id}>{el?.form_filling_server_ip}</option>
                                    );
                                })}
                        </select>

                        <InputError error={errors.server_ip_address} />
                    </div>

                    <div className="relative col-span-2">
                        <SelectPostDropdown
                            publishExamForm={publishExamForm}
                            serverIPAddresses={serverIPAddresses}
                            setPublishExamForm={setPublishExamForm}
                            errors={errors}
                        />
                    </div>

                    <div className="relative col-span-2 flex gap-2 items-center">
                        <InputLabel name="Show Sections" />
                        <div className="flex gap-3">
                            <Input
                                value="yes"
                                name="is_show_exam_sections"
                                type="radio"
                                label={'Yes'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                            <Input
                                value="no"
                                name="is_show_exam_sections"
                                type="radio"
                                label={'No'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                        </div>
                        <InputError error={errors.is_show_exam_sections} />
                    </div>

                    <div className="relative col-span-2 flex gap-2 items-center">
                        <InputLabel name="Mark For Review" className="" />
                        <div className="flex gap-3">
                            <Input
                                value="yes"
                                name="is_show_mark_for_review"
                                type="radio"
                                label={'Yes'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                            <Input
                                value="no"
                                name="is_show_mark_for_review"
                                type="radio"
                                label={'No'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                        </div>
                        <InputError error={errors.is_show_mark_for_review} />
                    </div>

                    <div className="relative col-span-2 flex gap-2 items-center">
                        <InputLabel name="Show Clear Response" className="" />
                        <div className="flex gap-3">
                            <Input
                                value="yes"
                                name="is_show_clear_response"
                                type="radio"
                                label={'Yes'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                            <Input
                                value="no"
                                name="is_show_clear_response"
                                type="radio"
                                label={'No'}
                                className={'flex items-center gap-2 flex-row-reverse'}
                                onChange={handleChange}></Input>
                        </div>
                        <InputError error={errors.is_show_clear_response} />
                    </div>

                    <div className="relative">
                        <Input
                            label={'End button time'}
                            name={'end_button_time'}
                            onChange={handleChange}
                            value={publishExamForm.end_button_time}
                        />
                        <InputError error={errors.end_button_time} />
                    </div>

                    <div className="relative">
                        <Input
                            label={'Test key'}
                            name={'test_key'}
                            value={publishExamForm.test_key}
                            disabled
                        />
                        <InputError error={errors.test_key} />
                    </div>
                    <div className="flex items-center mt-3">
                        <CButton className={'btn--success'} onClick={handleGenerateTestKey}>
                            Generate Test Key
                        </CButton>
                    </div>

                    <CButton className="col-span-2 mt-3" onClick={handleFinalPublishExam}>
                        Publish
                    </CButton>
                </div>
            </CModal>
            <div className="mt-6">
                <H1 className="text-center">Tests List</H1>

                <DataTable
                    columns={columns}
                    data={testsList}
                    pagination
                    highlightOnHover
                    width="5rem"></DataTable>
            </div>
        </>
    );
}

export default TestsList;
