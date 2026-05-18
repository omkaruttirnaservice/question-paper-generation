let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaPlus, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import { H1, H3 } from '../UI/Headings.jsx';
import { MdOutlinePublish, MdDeleteOutline } from 'react-icons/md';
import './PublishedTestsList.css';
import { testsSliceActions } from '../../Store/tests-slice.jsx';
import Swal from 'sweetalert2';
import { confirmDialouge } from '../../helpers/confirmDialouge.jsx';
import DataTable from 'react-data-table-component';
import { TEST_LIST_MODE } from '../Utils/Constants.jsx';
import { InputSelect } from '../UI/Input.jsx';

function PublishedTestsList() {
    const { sendRequest } = useHttp();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [publishedTestsList, setPublishedTestsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listMode, setListMode] = useState("NEW");

    useEffect(() => {
        getExamsList();
    }, [listMode]);

    function getExamsList() {
        const reqData = {
            url: SERVER_IP + `/api/test/list-published?type=EXAM&mode=${listMode}`,
        };
        setLoading(true);
        sendRequest(reqData, ({ data }) => {
            setLoading(false);
            if (data.length >= 1) {
                setPublishedTestsList(data);
            } else {
                setPublishedTestsList([]);
            }
        });
    }

    function isExamToday(date) {
        const [e_date, e_month, e_year] = date?.split('-');
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

    const handlePublishedTestQuePreview = (el) => {
        if (!el.id) return false;
        el.mode = TEST_LIST_MODE.PUBLISHED_TEST_LIST;
        dispatch(testsSliceActions.setTestDetails(el));
        navigate('/tests/published/questions');
    };

    const handleUnpublishExam = async (el) => {
        if (!el.id) return false;

        const isConfirm = await confirmDialouge({
            title: 'Are you sure?',
            text: 'Do you want to unpublish exam?',
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
                    text: 'Unpublished the exam',
                    icon: 'success',
                });
                setPublishedTestsList(publishedTestsList.filter((_el) => _el.id != el.id));
            }
        });
    };

    const columns = [
        {
            sortable: true,
            name: 'Paper',
            center: true,
            selector: (row, idx) => idx + 1,
            width: '6rem',
        },
        {
            sortable: true,
            name: 'Published test id',
            center: true,
            selector: (row) => (
                <span className="font-black text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-100 text-[10px]">
                    {row.id}
                </span>
            ),
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Test Name',
            selector: (row) => row.mt_name,
            grow: 3,
            minWidth: '250px',
            wrap: true,
        },
        {
            sortable: true,
            name: 'Batch',
            center: true,
            selector: (row) => (
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                    Batch-{row.tm_allow_to}
                </span>
            ),
            width: '7rem',
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
            name: 'Total Questions',
            center: true,
            selector: (row) => row.mt_total_test_question,
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Test Date',
            selector: (row) => (
                <span className="text-[11px] font-bold text-slate-800 leading-tight">{row.ptl_active_date}</span>
            ),
            width: '9rem',
        },
        {
            sortable: true,
            name: 'Posts',
            cell: (row) => {
                const posts = typeof row.post_details === 'string' ? JSON.parse(row.post_details) : row.post_details;
                return (
                    <div className="flex flex-wrap gap-1 max-w-[300px] py-1">
                        {posts?.map((_post, idx) => (
                            <span key={idx} className="bg-cyan-50 text-cyan-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-cyan-100 uppercase tracking-tight whitespace-nowrap">
                                {_post.post_name}
                            </span>
                        ))}
                    </div>
                );
            },
            grow: 2,
        },
        {
            sortable: true,
            name: 'Scheduled',
            cell: (row) => {
                const status = isExamToday(row.ptl_active_date);
                return (
                    <div className="flex items-center">
                        {status === 1 && (
                            <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Today
                            </span>
                        )}
                        {status === 2 && (
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                Upcoming
                            </span>
                        )}
                        {status === -1 && (
                            <span className="text-slate-400 font-medium text-[11px]">-</span>
                        )}
                    </div>
                );
            },
            width: '10rem',
        },
        {
            sortable: true,
            name: 'Unpublish',
            center: true,
            cell: (row) => (
                <div className="flex items-center justify-center w-full">
                    {isExamToday(row.ptl_active_date) === 2 ? (
                        <button
                            className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm"
                            onClick={() => handleUnpublishExam(row)}
                            title="Unpublish Exam"
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
            sortable: true,
            name: 'View',
            center: true,
            cell: (row) => (
                <div className="flex items-center justify-center w-full">
                    <button
                        className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center border border-sky-100 shadow-sm"
                        onClick={() => handlePublishedTestQuePreview(row)}
                        title="View Questions"
                    >
                        <FaEye size={14} />
                    </button>
                </div>
            ),
            width: '10rem',
        },
    ];




    return (
        <div className="ptl-root">
            {/* Premium Header Bar */}
            <div className="ptl-header-bar">
                <div className="ptl-header-content">
                    <MdOutlinePublish />
                    <span>PUBLISHED TESTS LIST</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="ptl-mode-indicator flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-1.5 shadow-sm">
                        <div className="ptl-mode-label text-white/90 text-[10px] font-black uppercase tracking-wider mr-3 border-r border-white/20 pr-3">
                            List Mode
                        </div>
                        <select
                            className="bg-transparent text-white text-[13px] font-bold outline-none cursor-pointer appearance-none pr-6 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
                            value={listMode}
                            onChange={(e) => setListMode(e.target.value)}
                        >
                            <option className="text-slate-800 font-bold" value="NEW">Active Tests</option>
                            <option className="text-slate-800 font-bold" value="ALL">All Published</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="ptl-content-container">
                {/* Loading State */}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="flex items-center gap-3 bg-cyan-50 text-cyan-700 px-6 py-3 rounded-2xl font-black text-sm animate-pulse shadow-sm border border-cyan-100">
                            <AiOutlineLoading3Quarters className="animate-spin" />
                            LOADING DATA...
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {publishedTestsList.length === 0 && !loading && (
                    <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No tests found in this category</p>
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
                                        paddingTop: '1rem',
                                        paddingBottom: '1rem',
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

export default PublishedTestsList;
