import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEye, FaPencil, FaTrash } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import { ModalActions } from '../../Store/modal-slice.jsx';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import TestListSchemaYUP from '../PublishedTestsList/TestsListSchemaYUP.jsx';
import { getExamsList, getServerIP } from '../StudentArea/AddNewStudent/api.jsx';
import { MdList, MdDateRange, MdNumbers, MdDns, MdTimer, MdVpnKey } from 'react-icons/md';
import CButton from '../UI/CButton.jsx';
import CModal from '../UI/CModal.jsx';
import { H1 } from '../UI/Headings.jsx';
import Input, { InputLabel } from '../UI/Input.jsx';
import InputError from '../UI/InputError.jsx';
import SelectPostDropdown from './SelectPostDropdown.jsx';
import './TestsList.css';
import { generateTestKey } from './utils.js';
import { TEST_LIST_MODE } from '../Utils/Constants.jsx';

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
    const { sendRequest, isLoading } = useHttp();
    const dispatch = useDispatch();
    const [testsList, setTestsList] = useState([]);

    const getServerIPQuery = useQuery({
        queryKey: ['get-server-ip-list'],
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
        queryKey: ['get-exams-list'],
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

    const handleEditTestDetails = (el) => {
        if (!el.id) return false;
        const _testData = { ...el };
        _testData.mode = TEST_LIST_MODE.TEST_LIST;
        dispatch(testsSliceActions.setTestDetails(_testData));
        navigate('/tests/create/form');
    };

    const handleViewQuestions = (el) => {
        if (!el.id) return false;
        const _testData = { ...el };
        _testData.mode = TEST_LIST_MODE.TEST_LIST;
        dispatch(testsSliceActions.setTestDetails(_testData));

        navigate('/tests/list/questions');
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
            .then(() => { })
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
                    // dispatch(
                    //     testsSliceActions.setPreviewPublishedTestDetailsId(data.testDetails.id)
                    // );
                    // dispatch(testsSliceActions.setPreviewPublishedTestDetails(data.testDetails));
                    dispatch(testsSliceActions.setTestDetails({ ...publishExamForm.test_details, mode: TEST_LIST_MODE.TEST_LIST }));
                    setTimeout(() => {
                        navigate('/tests/list/questions');
                    }, 10);
                    setPublishExamForm(initialStatePublishForm);
                }
            });
        } catch (error) {
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
                    <button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1.5 px-4 rounded-full text-xs shadow-md shadow-cyan-600/30 transition-all"
                        onClick={() => handlePublishExam(row)}>
                        Publish
                    </button>
                </div>
            ),
            selector: (row) => row.sl_roll_number,
            width: '8rem',
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex gap-2 items-center justify-center">
                    <button
                        className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30 transition-all"
                        onClick={() => handleDeleteTest(row.id)}
                    >
                        <FaTrash className="text-xs" />
                    </button>

                    <button
                        className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 transition-all"
                        disabled={isLoading}
                        onClick={() => handleEditTestDetails(row)}
                    >
                        <FaPencil className="text-xs" />
                    </button>
                    <button
                        className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30 transition-all"
                        onClick={() => handleViewQuestions(row)}
                    >
                        <FaEye className="text-xs" />
                    </button>
                </div>
            ),
            selector: (row) => row.sl_roll_number,
            width: '10rem',
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                borderBottomColor: '#f1f5f9',
            },
        },
        headCells: {
            style: {
                color: '#4B5563',
                fontSize: '0.8rem',
                fontWeight: '600',
            },
        },
        cells: {
            style: {
                fontSize: '0.85rem',
                color: '#374151',
            },
        },
    };

    return (
        <>
            <CModal id="publish-exam-modal" title={'Publish Exam'} className="w-[800px] max-w-[95vw]">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <InputLabel name="Select Publish Date" htmlFor={'publish_date'} className="!text-[0.725rem] font-black text-slate-500 uppercase tracking-widest mb-1.5" />
                        <div className="relative">
                            <MdDateRange className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xl pointer-events-none z-10" />
                            <DatePicker
                                autoComplete="off"
                                onChange={(date) => {
                                    setPublishExamForm((prev) => {
                                        return {
                                            ...prev,
                                            publish_date: `${date.getDate()}-${date.getMonth() + 1
                                                }-${date.getFullYear()}`,
                                        };
                                    });
                                }}
                                placeholderText="select date"
                                defaultValue
                                name="publish_date"
                                id="publish_date"
                                value={publishExamForm.publish_date}
                                className="!w-full h-12 rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 font-bold text-[0.95rem] pl-11 pr-5 focus:border-cyan-500 focus:bg-white focus:ring-[5px] focus:ring-cyan-500/10 outline-none transition-all text-slate-800 disabled:opacity-50"
                            />
                        </div>
                        <InputError error={errors.publish_date} />
                    </div>

                    <div className="relative">
                        <InputLabel name="Batch No" htmlFor="batch" className="!text-[0.725rem] font-black text-slate-500 uppercase tracking-widest mb-1.5" />

                        <div className="relative">
                            <MdNumbers className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xl pointer-events-none z-10" />
                            <select
                                name="batch"
                                id="batch"
                                onChange={handleChange}
                                value={publishExamForm.batch}
                                className="!w-full h-12 rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 font-bold text-[0.95rem] pl-11 pr-4 focus:border-cyan-500 focus:bg-white focus:ring-[5px] focus:ring-cyan-500/10 outline-none transition-all text-slate-800 appearance-none disabled:opacity-50">
                                <option value="">-- Select -- </option>

                                {batchCount.map((el, idx) => {
                                    return (
                                        <option key={idx} value={idx + 1}>
                                            Batch {idx + 1}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <InputError error={errors.batch} />
                    </div>

                    <div className="relative col-span-2">
                        <InputLabel name="Select IP/URL" htmlFor="server_ip_address" className="!text-[0.725rem] font-black text-slate-500 uppercase tracking-widest mb-1.5" />
                        <div className="relative">
                            <MdDns className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xl pointer-events-none z-10" />
                            <select
                                name="server_ip_address"
                                id="server_ip_address"
                                onChange={handleChange}
                                value={publishExamForm.server_ip_address}
                                className="!w-full h-12 rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 font-bold text-[0.95rem] pl-11 pr-4 focus:border-cyan-500 focus:bg-white focus:ring-[5px] focus:ring-cyan-500/10 outline-none transition-all text-slate-800 appearance-none disabled:opacity-50">
                                <option value="">-- Select -- </option>
                                {getServerIPQuery.isLoading && <option>Loading...</option>}

                                {serverIPAddresses?.length > 0 &&
                                    serverIPAddresses.map((el, idx) => {
                                        return (
                                            <option key={idx} value={el.id}>
                                                {el?.form_filling_server_ip}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>

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

                    <div className="col-span-2 flex justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100 mt-2">
                        <div className="flex flex-col gap-2">
                            <InputLabel name="Show Sections" className="!mb-0 !text-[11px]" />
                            <div className="flex gap-4">
                                <Input value="yes" name="is_show_exam_sections" type="radio" label={'Yes'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                                <Input value="no" name="is_show_exam_sections" type="radio" label={'No'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                            </div>
                            <InputError error={errors.is_show_exam_sections} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <InputLabel name="Mark For Review" className="!mb-0 !text-[11px]" />
                            <div className="flex gap-4">
                                <Input value="yes" name="is_show_mark_for_review" type="radio" label={'Yes'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                                <Input value="no" name="is_show_mark_for_review" type="radio" label={'No'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                            </div>
                            <InputError error={errors.is_show_mark_for_review} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <InputLabel name="Show Clear Response" className="!mb-0 !text-[11px]" />
                            <div className="flex gap-4">
                                <Input value="yes" name="is_show_clear_response" type="radio" label={'Yes'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                                <Input value="no" name="is_show_clear_response" type="radio" label={'No'} className={'flex items-center gap-1.5 flex-row-reverse'} onChange={handleChange}></Input>
                            </div>
                            <InputError error={errors.is_show_clear_response} />
                        </div>
                    </div>

                    <div className="relative">
                        <InputLabel name="End Button Time" className="!text-[0.725rem] font-black text-slate-500 uppercase tracking-widest mb-1.5" />
                        <div className="relative">
                            <MdTimer className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xl pointer-events-none z-10" />
                            <input
                                type="number"
                                name={'end_button_time'}
                                onChange={handleChange}
                                value={publishExamForm.end_button_time}
                                className="!w-full h-12 rounded-2xl border-[1.5px] border-slate-100 bg-slate-50 font-bold text-[0.95rem] pl-11 pr-5 focus:border-cyan-500 focus:bg-white focus:ring-[5px] focus:ring-cyan-500/10 outline-none transition-all text-slate-800"
                            />
                        </div>
                        <InputError error={errors.end_button_time} />
                    </div>

                    <div className="relative flex items-end gap-3">
                        <div className="flex-1">
                            <InputLabel name="Test Key" className="!text-[0.725rem] font-black text-slate-500 uppercase tracking-widest mb-1.5" />
                            <div className="relative">
                                <MdVpnKey className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-xl pointer-events-none z-10" />
                                <input
                                    type="text"
                                    name={'test_key'}
                                    value={publishExamForm.test_key}
                                    disabled
                                    className="!w-full h-12 rounded-2xl border-[1.5px] border-slate-100 bg-slate-100 font-bold text-[0.95rem] pl-11 pr-5 outline-none transition-all text-slate-500"
                                />
                            </div>
                        </div>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-[11px] px-5 rounded-lg text-sm shadow-md shadow-emerald-500/30 transition-all whitespace-nowrap mb-1" onClick={handleGenerateTestKey}>
                            Generate Key
                        </button>
                    </div>

                    <div className="col-span-2 mt-2 flex justify-center w-full">
                        <button
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-12 rounded-full shadow-lg shadow-cyan-500/40 transition-all text-[0.95rem] tracking-wide w-full max-w-[400px]"
                            onClick={handleFinalPublishExam}
                        >
                            Publish Exam
                        </button>
                    </div>
                </div>
            </CModal>
            <div className="w-full mt-6 px-4 pb-8">
                <div className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-2xl flex items-center gap-3 mb-6 shadow-md shadow-cyan-500/30">
                    <MdList className="text-2xl" />
                    <span className="font-black text-xl tracking-wide">TESTS LIST</span>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
                    <DataTable
                        columns={columns}
                        data={testsList}
                        pagination
                        highlightOnHover
                        customStyles={customStyles}
                        width="100%"
                    />
                </div>
            </div>
        </>
    );
}

export default TestsList;
