let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { MdAssignment, MdBarChart, MdArrowBack } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1, H3 } from '../UI/Headings.jsx';
import './TestsList.css';
import '../PublishedTestsList/PublishedTestsList.css';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import DataTable from 'react-data-table-component';

function MockTestReport() {
    const [searchParams] = useSearchParams();
    const { sendRequest } = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.loader);

    const [publishedTestReport, setPublishedTestReport] = useState([]);

    useEffect(() => {
        getExamsList();
    }, []);

    function getExamsList() {
        const reqData = {
            url: SERVER_IP + `/api/test/mock-test-report?ptid=${searchParams.get('ptid')}`,
        };
        sendRequest(reqData, ({ data }) => {
            if (data.length >= 1) {
                setPublishedTestReport(data);
            }
        });
    }

    const columns = [
        {
            name: '#',
            selector: (row, idx) => idx + 1,
            width: '4rem',
        },
        {
            sortable: true,
            name: 'Candidate Name',
            selector: (row) => row.full_name,
            grow: 2,
        },
        {
            sortable: true,
            name: 'Test ID',
            selector: (row) => (
                <span className="font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    {row.published_test_id}
                </span>
            ),
            width: '6rem',
        },
        {
            sortable: true,
            name: 'Time Left',
            selector: (row) => (
                <div className="flex items-center gap-1">
                    {row.stm_min || row.stm_sec ? (
                        <span className="text-slate-700 font-bold">
                            {row.stm_min || 0}m {row.stm_sec || 0}s
                        </span>
                    ) : (
                        <span className="text-slate-300">—</span>
                    )}
                </div>
            ),
            width: '10rem',
        },
        {
            sortable: true,
            name: 'MAC Address',
            selector: (row) => (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {row.mac_id || 'N/A'}
                </span>
            ),
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Status',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.stl_test_status == 0 ? (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider whitespace-nowrap">
                            Completed
                        </span>
                    ) : (
                        <span className="bg-amber-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider whitespace-nowrap">
                            Incomplete
                        </span>
                    )}
                </div>
            ),
            width: '8rem',
        },
    ];

    return (
        <div className="ptl-root">
            {/* Premium Header Bar */}
            <div className="ptl-header-bar">
                <div className="ptl-header-content">
                    <MdBarChart />
                    <span>MOCK TEST REPORT</span>
                </div>
                <button
                    className="ptl-header-btn"
                    onClick={() => navigate(-1)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}
                >
                    <MdArrowBack className="text-xl" /> Go Back
                </button>
            </div>

            <div className="ptl-content-container">
                {/* List Mode Indicator (Report) */}
                <div className="ptl-mode-indicator">
                    <div className="ptl-mode-label">VIEWING</div>
                    <div className="ptl-mode-pill">
                        <span className="ptl-mode-dot" style={{ backgroundColor: '#8B5CF6' }} />
                        CANDIDATE PERFORMANCE
                    </div>
                </div>

                {/* Table Card */}
                <div className="ptl-table-card">
                    <DataTable
                        columns={columns}
                        data={publishedTestReport}
                        pagination
                        highlightOnHover
                        customStyles={{
                            header: { style: { display: 'none' } },
                            headRow: {
                                style: {
                                    backgroundColor: '#F8FAFC',
                                    borderTopLeftRadius: '1rem',
                                    borderTopRightRadius: '1rem',
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
                                    paddingTop: '1rem',
                                    paddingBottom: '1rem',
                                },
                            },
                            rows: {
                                style: {
                                    borderBottomColor: '#F1F5F9',
                                    '&:hover': {
                                        backgroundColor: '#F1F5F9/50',
                                    },
                                },
                            },
                            pagination: {
                                style: {
                                    borderTopColor: '#E2E8F0',
                                    borderBottomLeftRadius: '1rem',
                                    borderBottomRightRadius: '1rem',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default MockTestReport;
