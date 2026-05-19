import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaFilePdf, FaHistory, FaCloudDownloadAlt } from 'react-icons/fa';
import useHttp from '../../Hooks/use-http.jsx';
import './ActivityLogReports.css';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;

function ActivityLogReports() {
    const { sendRequest } = useHttp();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters Dropdown Options
    const [filterOptions, setFilterOptions] = useState({ batches: [], exams: [] });

    // Filters state
    const [filters, setFilters] = useState({
        searchBy: 'roll_no',
        searchValue: '',
        batch: '',
        exam_name: '',
        date: ''
    });

    const fetchFilterOptions = () => {
        sendRequest({ url: SERVER_IP + `/api/reports/activity-logs-filters`, method: 'GET' }, (response) => {
            if (response && response.data) {
                setFilterOptions(response.data);
            }
        });
    };

    const fetchLogs = async () => {
        setLoading(true);
        // Build query string
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) queryParams.append(key, filters[key]);
        });

        const reqData = {
            url: SERVER_IP + `/api/reports/activity-logs?${queryParams.toString()}`,
            method: 'GET'
        };

        sendRequest(reqData, (response) => {
            setLoading(false);
            if (response && response.data) {
                setLogs(response.data || []);
            } else {
                setLogs([]);
            }
        });
    };

    // Initial load for filter options only
    useEffect(() => {
        fetchFilterOptions();
    }, []);

    // Fetch logs whenever filters change (and also on mount)
    useEffect(() => {
        // Debounce to prevent too many requests when typing in the input
        const delayDebounceFn = setTimeout(() => {
            fetchLogs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Display all fields from exam_activity_log + post
    const columns = [
        { name: 'LOG_ID', selector: row => row.log_id || '-', sortable: true, width: '100px' },
        { 
            name: 'STUDENT_ID', 
            selector: row => row.student_id || '-', 
            sortable: true, 
            width: '120px',
            cell: row => <span className="font-bold text-indigo-600">{row.student_id || '-'}</span>
        },
        { 
            name: 'STUDENT_NAME', 
            selector: row => row.student_name || row.name || '-', 
            sortable: true, 
            width: '150px',
            cell: row => <span className="font-semibold text-slate-800">{row.student_name || row.name || '-'}</span>
        },
        { name: 'ROLL_NO', selector: row => row.roll_no || '-', sortable: true, width: '120px' },
        { name: 'BATCH_ID', selector: row => row.batch_id || row.batch || '-', sortable: true, width: '100px' },
        { name: 'EXAM_ID', selector: row => row.exam_id || '-', sortable: true, width: '100px' },
        { name: 'PUBLISHED_ID', selector: row => row.published_id || '-', sortable: true, width: '120px' },
        { name: 'EXAM_NAME', selector: row => row.exam_name || '-', sortable: true, width: '150px' },
        { name: 'LAB_NAME', selector: row => row.lab_name || '-', sortable: true, width: '120px' },
        { name: 'SESSION_ID', selector: row => row.session_id || '-', sortable: true, width: '120px' },
        { 
            name: 'ACTION_TYPE', 
            selector: row => row.action_type || row.activity || '-', 
            sortable: true, 
            width: '150px',
            cell: row => {
                const act = row.action_type || row.activity || '-';
                let cls = 'bg-slate-100 text-slate-700';
                if (act.includes('LOGIN')) cls = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                if (act.includes('SUBMIT') || act.includes('FINISH')) cls = 'bg-purple-50 text-purple-700 border border-purple-100';
                if (act.includes('WARN') || act.includes('TAB')) cls = 'bg-rose-50 text-rose-700 border border-rose-100';
                return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${cls}`}>{act}</span>;
            }
        },
        { name: 'MESSAGE', selector: row => row.message || '-', sortable: true, width: '200px', wrap: true },
        { name: 'QUESTION_ID', selector: row => row.question_id || '-', sortable: true, width: '120px' },
        { name: 'QUESTION_NO', selector: row => row.question_no || '-', sortable: true, width: '120px' },
        { name: 'SELECTED_OPTION', selector: row => row.selected_option || '-', sortable: true, width: '140px' },
        { name: 'ANSWER_SNAPSHOT', selector: row => row.answer_snapshot ? <div className="alr-json-view">{JSON.stringify(row.answer_snapshot)}</div> : '-', width: '200px' },
        { name: 'EXTRA_DATA', selector: row => row.extra_data ? <div className="alr-json-view">{JSON.stringify(row.extra_data)}</div> : '-', width: '200px' },
        { name: 'FROM_Q', selector: row => row.from_q || '-', sortable: true, width: '90px' },
        { name: 'TO_Q', selector: row => row.to_q || '-', sortable: true, width: '90px' },
        { name: 'PC_LABEL', selector: row => row.pc_label || '-', sortable: true, width: '110px' },
        { name: 'OLD_PC', selector: row => row.old_pc || '-', sortable: true, width: '100px' },
        { name: 'NEW_PC', selector: row => row.new_pc || '-', sortable: true, width: '100px' },
        { name: 'LINK_ID', selector: row => row.link_id || '-', sortable: true, width: '100px' },
        { name: 'MAC_ADDRESS', selector: row => row.mac_address || '-', sortable: true, width: '130px' },
        { name: 'IP_ADDRESS', selector: row => row.ip_address || '-', sortable: true, width: '130px' },
        { name: 'ATTEMPT_NO', selector: row => row.attempt_no || '-', sortable: true, width: '110px' },
        { name: 'TOTAL_QUESTIONS', selector: row => row.total_questions || '-', sortable: true, width: '140px' },
        { name: 'ATTEMPTED', selector: row => row.attempted || '-', sortable: true, width: '110px' },
        { name: 'DURATION_MINS', selector: row => row.duration_mins || '-', sortable: true, width: '130px' },
        { 
            name: 'CREATED_AT', 
            selector: row => {
                const date = row.created_at || row.date_time;
                if (!date || date === '-') return '-';
                try {
                    const d = new Date(date);
                    if (isNaN(d.getTime())) return date;
                    return d.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }).replace(',', '').toUpperCase();
                } catch (e) {
                    return date;
                }
            }, 
            sortable: true, 
            width: '180px' 
        }
    ];

    const generatePDF = (specificRoll = null) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', [800, 210]);
        const dataToExport = specificRoll ? logs.filter(l => l.roll_no === specificRoll) : logs;
        
        if (dataToExport.length === 0) return;

        doc.setFontSize(22);
        doc.setTextColor(124, 58, 237); // Purple
        doc.text(`Student Activity Report ${specificRoll ? `: ${dataToExport[0].student_name} (${specificRoll})` : ''}`, 20, 20);

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);

        const tableColumn = columns.map(c => c.name);
        const tableRows = dataToExport.map(log => {
            const date = log.created_at || log.date_time;
            let formattedDate = date;
            if (date && date !== '-') {
                try {
                    const d = new Date(date);
                    if (!isNaN(d.getTime())) {
                        formattedDate = d.toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }).replace(',', '').toUpperCase();
                    }
                } catch(e) {}
            }
            return [
                log.log_id, log.student_id, log.student_name || '-', log.roll_no, 
                log.batch_id, log.exam_id, log.published_id, log.exam_name || '-', 
                log.lab_name || '-', log.session_id || '-', 
                log.action_type, log.message || '-', 
                log.question_id || '-', log.question_no || '-', 
                log.selected_option || '-', 
                log.answer_snapshot ? JSON.stringify(log.answer_snapshot) : '-',
                log.extra_data ? JSON.stringify(log.extra_data) : '-',
                log.from_q || '-', log.to_q || '-', 
                log.pc_label || '-', log.old_pc || '-', log.new_pc || '-',
                log.link_id || '-', log.mac_address || '-', log.ip_address || '-', 
                log.attempt_no || '-', log.total_questions || '-', log.attempted || '-', 
                log.duration_mins || '-', formattedDate
            ];
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
            headStyles: { fillColor: [124, 58, 237] },
            columnStyles: { 
                11: { cellWidth: 40 }, // Message
                15: { cellWidth: 50 }, // Snapshot
                16: { cellWidth: 50 }  // Extra Data
            }
        });

        doc.save(`activity_log_${specificRoll || 'all'}.pdf`);
    };

    return (
        <div className="alr-root">
            {/* Premium Header Bar */}
            <div className="alr-header-bar">
                <div className="alr-header-content">
                    <FaHistory />
                    <span>STUDENT ACTIVITY LOG REPORTS</span>
                </div>
                <button 
                    onClick={() => generatePDF()} 
                    disabled={logs.length === 0}
                    className="alr-pdf-btn"
                >
                    <FaFilePdf />
                    Generate PDF Report
                </button>
            </div>

            <div className="alr-content-container">
                {/* Filter Section Card */}
                <div className="alr-filter-card">
                    <div className="alr-filter-grid">
                        
                        {/* Search By Dropdown & Input */}
                        <div className="alr-filter-field col-span-12 md:col-span-6">
                            <span className="alr-label">Search Student By</span>
                            <div className="alr-input-group">
                                <select 
                                    name="searchBy" 
                                    value={filters.searchBy} 
                                    onChange={handleFilterChange} 
                                    className="alr-select w-[130px]"
                                >
                                    <option value="roll_no">ROLL_NO</option>
                                    <option value="name">STUDENT_NAME</option>
                                </select>
                                <input 
                                    type="text" 
                                    name="searchValue" 
                                    value={filters.searchValue} 
                                    onChange={handleFilterChange} 
                                    placeholder={`Enter ${filters.searchBy === 'roll_no' ? 'Roll No' : 'Name'}...`} 
                                    className="alr-input flex-1" 
                                />
                                <button 
                                    onClick={() => generatePDF(filters.searchValue)}
                                    disabled={!filters.searchValue || logs.length === 0}
                                    title="Download Student Report"
                                    className="alr-download-btn"
                                >
                                    <FaCloudDownloadAlt size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="alr-filter-field col-span-12 sm:col-span-4 md:col-span-2">
                            <span className="alr-label">Batch</span>
                            <select 
                                name="batch" 
                                value={filters.batch} 
                                onChange={handleFilterChange} 
                                className="alr-select w-full"
                            >
                                <option value="">All Batches</option>
                                {filterOptions.batches.map(b => (
                                    <option key={b} value={b}>Batch {b}</option>
                                ))}
                            </select>
                        </div>

                        <div className="alr-filter-field col-span-12 sm:col-span-8 md:col-span-2">
                            <span className="alr-label">Exam Name</span>
                            <select 
                                name="exam_name" 
                                value={filters.exam_name} 
                                onChange={handleFilterChange} 
                                className="alr-select w-full"
                            >
                                <option value="">All Exams</option>
                                {filterOptions.exams.map(e => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>

                        <div className="alr-filter-field col-span-12 sm:col-span-4 md:col-span-2">
                            <span className="alr-label">Date</span>
                            <input 
                                type="date" 
                                name="date" 
                                value={filters.date} 
                                onChange={handleFilterChange} 
                                className="alr-input w-full"
                            />
                        </div>
                        
                    </div>
                </div>

                {/* Activity Log Table Section */}
                <div className="alr-table-card">
                    <DataTable
                        columns={columns}
                        data={logs}
                        progressPending={loading}
                        pagination
                        highlightOnHover
                        striped
                        noDataComponent={<div className="p-10 text-gray-400 italic font-semibold text-center">No activity logs found.</div>}
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
                                    fontSize: '0.825rem',
                                    fontWeight: '600',
                                    paddingTop: '0.65rem',
                                    paddingBottom: '0.65rem',
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

export default ActivityLogReports;
