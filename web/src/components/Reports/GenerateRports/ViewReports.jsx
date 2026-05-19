import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reportsAction } from '../../../Store/reports-slice.jsx';
import CButton from '../../UI/CButton.jsx';
import {
    getCandidateResponseSheet,
    getCustomResultExcel,
    getExamDates,
    getResultBatchesList,
    getResultViewData,
    singleCandiatePaper,
} from './gen-reports-api.jsx';
import { InputSelect } from '../../UI/Input.jsx';
import { RESULT_BY_BATCH, RESULT_BY_POST, SERVER_IP } from '../../Utils/Constants.jsx';
import { FiEye } from 'react-icons/fi';
import { MdOutlineAssessment, MdFileDownload } from 'react-icons/md';
import './ViewReports.css';

function ViewReports() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { singleStudentViewReport, currentViewTestDetails } = useSelector(
        (state) => state.reports
    );

    const [postsList, setPostList] = useState([]);

    const [showPercentileResult, setShowPercentileResult] = useState(false);

    const [examDates, setExamDates] = useState([]);

    const _getExamDatesList = useQuery({
        queryKey: ['get-exam-dates'],
        queryFn: () => getExamDates(),

        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const _getResultBatchesList = useQuery({
        queryKey: ['get-result-batches-list'],
        queryFn: () => getResultBatchesList(),

        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (currentViewTestDetails?.viewResultBy === RESULT_BY_POST) {
            _getResultBatchesList.refetch();
        }
        if (currentViewTestDetails?.viewResultBy === RESULT_BY_BATCH) {
            _getExamDatesList.refetch();
        }
    }, [currentViewTestDetails?.viewResultBy]);

    useEffect(() => {
        if (_getResultBatchesList?.data) {
            setPostList(_getResultBatchesList.data.data);
        }
        if (_getExamDatesList?.data) {
            setExamDates(_getExamDatesList.data.data);
        }
    }, [_getResultBatchesList, _getExamDatesList]);

    const columns = [
        {
            sortable: true,
            name: '#',
            cell: (row, idx) => <p>{idx + 1}</p>,
            width: '6rem',
            center: true,
        },
        {
            sortable: true,
            name: 'Student name',
            cell: (row) => <span className="font-bold text-slate-800">{row['full_name']}</span>,
            grow: 2,
        },
        {
            sortable: true,
            name: 'Roll No',
            selector: (row) => row.sfrs_student_roll_no,
            width: '10rem',
            center: true,
        },

        {
            sortable: true,
            name: 'Gender',
            selector: (row) => row.sl_gender,
            width: '8rem',
            center: true,
        },
        {
            sortable: true,
            name: 'Unattempted',
            selector: (row) => row.sfrs_unattempted,
            width: '10rem',
            center: true,
        },
        {
            sortable: true,
            name: 'Attempt',
            selector: (row) => Number(row.sfrc_total_marks) - Number(row.sfrs_unattempted) || '-',
            width: '10rem',
            center: true,
        },
        { sortable: true, name: 'Wrong', selector: (row) => row.sfrs_wrong, width: '8rem', center: true },
        { sortable: true, name: 'Correct', selector: (row) => row.sfrs_correct, width: '8rem', center: true },
        {
            sortable: true,
            name: 'Score',
            center: true,
            width: '10rem',
            cell: (row) => {
                return showPercentileResult ? (
                    <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 text-xs">
                        {row.srfs_percentile} %
                    </span>
                ) : (
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 text-xs">
                        {row.sfrs_marks_gain + ' / ' + row.sfrc_total_marks}
                    </span>
                );
            },
        },
        {
            sortable: true,
            name: 'Action',
            width: '10rem',
            center: true,
            cell: (row) => (
                <CButton
                    className="!py-1.5 !px-3.5 !rounded-lg text-xs"
                    onClick={handleCandidateViewReport.bind(null, row)}
                    isLoading={candidateReportViewLoading}
                    icon={<FiEye />}>
                    Report
                </CButton>
            ),
        },
    ];

    const { mutate: _singleCandidatePaper, isPending: candidateReportViewLoading } = useMutation({
        mutationFn: (data) => singleCandiatePaper(data),
        onSuccess: (data) => {
            dispatch(reportsAction.setSingleStudentViewReport(data.data));
        },
        onError: (err) => {
            console.log(err, '==err==');
            toast.error(err?.message || 'Server error');
        },
    });

    useEffect(() => {
        if (singleStudentViewReport?.quePaper?.length >= 1 && singleStudentViewReport?.studExam) {
            navigate('/reports/single');
        }
    }, [singleStudentViewReport]);

    const handleCandidateViewReport = async (data) => {
        _singleCandidatePaper({
            studentRollNumber: data.sfrs_student_id,
            publishedTestId: data.sfrs_publish_id,
        });
    };

    const _getResultViewDataMutation = useMutation({
        mutationFn: (type) => {
            return getResultViewData(type);
        },
        onSuccess: (data) => {
            const updatedData = { ...currentViewTestDetails };
            updatedData['studentResultList'] = data.data[0].result_data?.candidate_results || [];
            const { page, limit, total_pages, total_rows } = data.data[0].result_data.pagination;
            updatedData['page'] = page;
            updatedData['limit'] = limit;
            updatedData['totalRows'] = total_rows;
            updatedData['totalPages'] = total_pages;
            dispatch(reportsAction.setCurentViewTestDetails(updatedData));
        },
        onError: (error) => {
            console.log(error, '==error==');
            toast.error(error?.message || 'Server error');
        },
    });

    const handleGetResultData = () => {
        const _data = {};
        if (currentViewTestDetails?.viewResultBy === RESULT_BY_POST) {
            _data.viewResultBy = RESULT_BY_POST;
            _data.postName = currentViewTestDetails.selectedPost;
        }

        if (currentViewTestDetails?.viewResultBy === RESULT_BY_BATCH) {
            _data.viewResultBy = RESULT_BY_BATCH;
            _data.postName = currentViewTestDetails?.selectedPost;
            _data.examDate = currentViewTestDetails?.selectedExamDate;
        }

        _data.page = currentViewTestDetails.page;
        _data.limit = currentViewTestDetails.limit;

        _getResultViewDataMutation.mutate(_data);
    };

    const handlePageChange = (newPage) => {
        const updatedData = { ...currentViewTestDetails };
        updatedData['page'] = newPage;
        dispatch(reportsAction.setCurentViewTestDetails(updatedData));
    };

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        const updatedData = { ...currentViewTestDetails };
        updatedData['page'] = 1;
        updatedData['limit'] = currentRowsPerPage || 10;
        dispatch(reportsAction.setCurentViewTestDetails(updatedData));
    };

    useEffect(() => {
        handleGetResultData();
    }, [currentViewTestDetails.page, currentViewTestDetails.limit]);

    const handleChange = (e) => {
        let updatedList = { ...currentViewTestDetails };

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;
        updatedList = {
            ...updatedList,
            studentResultList: [],
            [name]: value,
        };
        dispatch(reportsAction.setCurentViewTestDetails(updatedList));
    };

    const _getResultExel = useMutation({
        mutationFn: (data) => {
            return getCustomResultExcel(data);
        },
        onSuccess: (data) => { },
        onError: (error) => {
            console.log(error.message, '==error==');
            toast.error(error?.message || 'Server error');
        },
    });

    const handleGetExcelBtn = () => {
        const _data = {};
        if (currentViewTestDetails?.viewResultBy === RESULT_BY_POST) {
            _data.viewResultBy = RESULT_BY_POST;
            _data.postName = currentViewTestDetails?.selectedPost;
            _data.resultType = showPercentileResult ? 'PERCENTILE' : 'MARKS';
        }

        if (currentViewTestDetails?.viewResultBy === RESULT_BY_BATCH) {
            _data.viewResultBy = RESULT_BY_BATCH;
            _data.postName = currentViewTestDetails?.selectedPost;
            _data.examDate = currentViewTestDetails?.selectedExamDate;
            _data.resultType = showPercentileResult ? 'PERCENTILE' : 'MARKS';
        }
        _getResultExel.mutate(_data);
    };

    return (
        <div className="vr-root">
            {/* Premium Header Bar */}
            <div className="vr-header-bar">
                <div className="vr-header-content">
                    <MdOutlineAssessment size={24} />
                    <span>STUDENT EXAM SCORES</span>
                </div>
            </div>

            <div className="vr-content-container">
                {/* Search / Filters Card */}
                <div className="vr-filter-card">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
                            <InputSelect
                                label="View Result By"
                                className={'w-full'}
                                name="viewResultBy"
                                value={currentViewTestDetails?.viewResultBy || RESULT_BY_BATCH}
                                onChange={handleChange}>
                                <option value={RESULT_BY_BATCH}>{RESULT_BY_BATCH}</option>
                                <option value={RESULT_BY_POST}>{RESULT_BY_POST}</option>
                            </InputSelect>
                        </div>

                        {currentViewTestDetails?.viewResultBy === RESULT_BY_BATCH && (
                            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
                                <InputSelect
                                    label="Exam Dates"
                                    className={'w-full'}
                                    name="selectedExamDate"
                                    value={currentViewTestDetails?.selectedExamDate || ''}
                                    onChange={handleChange}>
                                    <option value="">--Select Exam Date--</option>
                                    {examDates?.length > 0 &&
                                        examDates.map((date, idx) => {
                                            return (
                                                <option key={idx} value={date.sl_exam_date}>
                                                    {date.sl_exam_date}
                                                </option>
                                            );
                                        })}
                                </InputSelect>
                            </div>
                        )}

                        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
                            <InputSelect
                                label="Posts"
                                className={'w-full'}
                                name="selectedPost"
                                value={currentViewTestDetails?.selectedPost || ''}
                                onChange={handleChange}>
                                <option value="">--Select Post--</option>
                                {postsList?.length > 0 &&
                                    postsList.map((post, idx) => {
                                        return <option key={idx} value={post.sl_post}>{post.sl_post}</option>;
                                    })}
                            </InputSelect>
                        </div>

                        <div className="col-span-12 lg:col-span-6 xl:col-span-6 self-end">
                            <div className="flex flex-wrap gap-3 items-center mt-3 lg:mt-0">
                                <CButton
                                    className="!rounded-xl shadow-md !py-3 !px-5 flex-shrink-0"
                                    onClick={handleGetResultData}
                                    isLoading={_getResultViewDataMutation.isPending}>
                                    View Result
                                </CButton>

                                <CButton
                                    varient={'btn--warning'}
                                    className="!rounded-xl shadow-md !py-3 !px-5 flex-shrink-0"
                                    onClick={handleGetExcelBtn}
                                    isLoading={_getResultExel.isPending}>
                                    Excel Export
                                </CButton>

                                <a 
                                    href={`${SERVER_IP}/api/pdf/v3/candidate-response-sheet`}
                                    className="vr-pdf-link flex-shrink-0">
                                    <MdFileDownload size={18} className="mr-1" />
                                    Response PDF
                                </a>

                                <label className="vr-toggle-wrap flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        className="vr-toggle-checkbox"
                                        id="percentile-result"
                                        checked={showPercentileResult}
                                        onChange={() => setShowPercentileResult(!showPercentileResult)}
                                    />
                                    <span>Percentile</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-4 text-indigo-700 text-xs font-semibold">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    <span>Note: Negative marking is only calculated for wrong answered questions.</span>
                </div>

                {/* Table Card */}
                <div className="vr-table-card">
                    <DataTable
                        columns={columns}
                        data={currentViewTestDetails?.studentResultList || []}
                        pagination
                        highlightOnHover
                        paginationServer
                        paginationTotalRows={currentViewTestDetails?.totalRows || 0}
                        paginationDefaultPage={currentViewTestDetails?.page || 0}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Total Per Page',
                            rangeSeparatorText: '--',
                        }}
                        customStyles={{
                            header: { style: { display: 'none' } },
                            headRow: {
                                style: {
                                    backgroundColor: '#F8FAFC',
                                    borderBottomColor: '#E2E8F0',
                                    minHeight: '52px',
                                },
                            },
                            headCells: {
                                style: {
                                    color: '#64748B',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                },
                            },
                            cells: {
                                style: {
                                    color: '#1E293B',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    paddingTop: '0.5rem',
                                    paddingBottom: '0.5rem',
                                },
                            },
                            rows: {
                                style: {
                                    borderBottomColor: '#F1F5F9',
                                    '&:hover': {
                                        backgroundColor: '#F8FAFC',
                                    },
                                },
                            },
                            pagination: {
                                style: {
                                    borderTopColor: '#E2E8F0',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ViewReports;
