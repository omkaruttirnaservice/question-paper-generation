let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { MdAssignment, MdList, MdDeleteSweep, MdBarChart, MdAddCircleOutline, MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1, H3 } from '../UI/Headings.jsx';
import './TestsList.css';
import '../PublishedTestsList/PublishedTestsList.css';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import DataTable from 'react-data-table-component';

function MockTestsList() {
    const { sendRequest } = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.loader);

    const [publishedTestsList, setPublishedTestsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getExamsList();
    }, []);

    function getExamsList() {
        setLoading(true);
        const reqData = {
            url: SERVER_IP + '/api/test/list-published?type=MOCK&mode=ALL',
        };
        sendRequest(reqData, ({ data }) => {
            setLoading(false);
            if (data) {
                setPublishedTestsList(data);
            }
        });
    }

    function isExamToday(date) {
        if (!date) return -1;
        const [e_date, e_month, e_year] = date.split('-');
        let examDate = new Date(`${e_year}-${e_month}-${e_date}`);
        examDate.setHours(0, 0, 0, 0);
        let examDateTime = examDate.getTime();

        let todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);
        let todaysDateTime = todaysDate.getTime();

        if (examDateTime > todaysDateTime) return 2;
        else if (examDateTime == todaysDateTime) return 1;
        else if (examDateTime < todaysDateTime) return -1;
    }

    const handleViewReport = (el) => {
        navigate(`/mock-report?ptid=${el.id}`);
    };

    const handleUnpublishExam = async (el) => {
        if (!el.id) return false;

        const isConfirm = await confirmDialouge({
            title: 'Are you sure?',
            text: 'Do you want to unpublish this mock exam?',
        });
        if (!isConfirm) return false;

        let rD = {
            url: SERVER_IP + '/api/test/unpublish',
            method: 'DELETE',
            body: JSON.stringify({ id: el.id }),
        };
        sendRequest(rD, ({ success, data }) => {
            if (success == 1) {
                Swal.fire({
                    title: 'Success',
                    text: 'Mock exam unpublished successfully',
                    icon: 'success',
                });
                setPublishedTestsList(publishedTestsList.filter((_el) => _el.id != el.id));
            }
        });
    };

    const columns = [
        {
            sortable: true,
            name: '#',
            center: true,
            selector: (row, idx) => idx + 1,
            width: '6rem',
        },
        {
            sortable: true,
            name: 'Test ID',
            center: true,
            selector: (row) => (
                <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[10px]">
                    {row.id}
                </span>
            ),
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Mock Test Name',
            selector: (row) => row.mt_name,
            grow: 3,
            minWidth: '250px',
            wrap: true,
        },
        {
            sortable: true,
            name: 'Duration',
            center: true,
            selector: (row) => `${row.mt_test_time}m`,
            width: '8rem',
        },
        {
            sortable: true,
            name: 'Questions',
            center: true,
            selector: (row) => row.mt_total_test_question,
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Test Date',
            selector: (row) => (
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">{row.ptl_active_date}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        Batch-{row.tm_allow_to}
                    </span>
                </div>
            ),
            width: '9rem',
        },
        {
            sortable: true,
            name: 'Posts',
            cell: (row) => (
                <div className="flex flex-wrap gap-1 max-w-[300px] py-1">
                    {row.post_details?.map((_post, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-tight whitespace-nowrap">
                            {_post.post_name}
                        </span>
                    ))}
                </div>
            ),
            grow: 2,
        },
        {
            sortable: true,
            name: 'Status',
            center: true,
            cell: (row) => {
                const status = isExamToday(row.ptl_active_date);
                return (
                    <div className="flex items-center">
                        {status === 1 && (
                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Today
                            </span>
                        )}
                        {status === 2 && (
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                Upcoming
                            </span>
                        )}
                        {status === -1 && (
                            <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                                Past
                            </span>
                        )}
                    </div>
                );
            },
            width: '10rem',
        },
        {
            name: 'Unpublish',
            center: true,
            cell: (row) => (
                <div className="flex justify-center">
                    {isExamToday(row.ptl_active_date) === 2 ? (
                        <button
                            onClick={() => handleUnpublishExam(row)}
                            className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm"
                            title="Unpublish Mock"
                        >
                            <MdDeleteOutline size={16} />
                        </button>
                    ) : (
                        <span className="text-slate-300">—</span>
                    )}
                </div>
            ),
            width: '9rem',
        },
        {
            name: 'Report',
            center: true,
            cell: (row) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => handleViewReport(row)}
                        className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center border border-sky-100 shadow-sm"
                        title="View Mock Report"
                    >
                        <FaEye size={14} />
                    </button>
                </div>
            ),
            width: '9rem',
        },
    ];

    return (
        <div className="ptl-root">
            {/* Premium Header Bar */}
            <div className="ptl-header-bar mtl-header-bar">
                <div className="ptl-header-content">
                    <MdAssignment />
                    <span>MOCK TESTS LIST</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="ptl-mode-indicator flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-1.5 shadow-sm">
                        <div className="ptl-mode-label text-white/90 text-[10px] font-black uppercase tracking-wider mr-3 border-r border-white/20 pr-3">
                            Test Type
                        </div>
                        <div className="text-white text-[13px] font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            MOCK EXAM
                        </div>
                    </div>

                    <button
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg backdrop-blur-md"
                        onClick={() => navigate('/mock/create')}
                    >
                        <FaPlus /> Create Mock Test
                    </button>
                </div>
            </div>

            <div className="ptl-content-container">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="flex items-center gap-3 bg-amber-50 text-amber-700 px-6 py-3 rounded-2xl font-black text-sm animate-pulse shadow-sm border border-amber-200">
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            LOADING MOCK TESTS...
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {publishedTestsList.length === 0 && !loading && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No mock tests available</p>
                    </div>
                )}

                {/* Table Card */}
                {publishedTestsList.length > 0 && (
                    <div className="ptl-table-card">
                        <DataTable
                            columns={columns}
                            data={publishedTestsList}
                            pagination
                            highlightOnHover
                            customStyles={{
                                header: { style: { display: 'none' } },
                                headRow: {
                                    style: {
                                        backgroundColor: '#F8FAFC',
                                        borderTopLeftRadius: '1.25rem',
                                        borderTopRightRadius: '1.25rem',
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
                                        paddingTop: '0.75rem',
                                        paddingBottom: '0.75rem',
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
                                        borderBottomLeftRadius: '1.25rem',
                                        borderBottomRightRadius: '1.25rem',
                                    },
                                },
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default MockTestsList;
