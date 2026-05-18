import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaPlus, FaRegClipboard, FaLink } from 'react-icons/fa6';
import { MdDns, MdOutlineTerminal, MdAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice.jsx';
import { StudentAreaActions } from '../../../Store/student-area-slice.jsx';
import CModal from '../../UI/CModal.jsx';
import Input, { InputLabel } from '../../UI/Input.jsx';
import { writeToClipboard } from '../../Utils/utils.jsx';
import { getServerIP, postServerIP, updateServerIP } from './api.jsx';
import GetCentersListBtn from './GetCentersListBtn.jsx';
import GetStudentsListBtn from './GetStudentsListBtn.jsx';
import UploadQuestionPaperToFormFillingBtn from './UploadQuestionPaperToFormFillingBtn.jsx';
import DeleteIpBtn from './DeleteIpBtn.jsx';
import EditIpBtn from './EditIpBtn.jsx';
import DataTable from 'react-data-table-component';
import '../../PublishedTestsList/PublishedTestsList.css';

function AddNewStudent() {
    const [ipDetails, setIpDetails] = useState({});
    const { formFillingIP } = useSelector((state) => state.studentArea);
    const dispatch = useDispatch();

    const {
        data: serverIP,
        error: getServerIPErr,
        isLoading: getServerIPLoading,
        isError,
        refetch: refetchServerIPList,
    } = useQuery({
        queryKey: ['getServerIP'],
        queryFn: getServerIP,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (isError) toast.warn(getServerIPErr?.message);
    }, [isError, getServerIPErr]);

    useEffect(() => {
        if (serverIP) {
            dispatch(StudentAreaActions.setFormFillingIP(serverIP.data));
        }
    }, [serverIP, dispatch]);

    const handleServerIpSubmit = (e) => {
        e.preventDefault();
        if (!ipDetails?.form_filling_server_ip) return toast.warn('Please enter Form Filling Server IP');
        if (!ipDetails?.exam_panel_server_ip) return toast.warn('Please enter Exam Panel IP');
        saveServerIP(ipDetails);
    };

    const { mutate: saveServerIP, isPending: saveIpPending } = useMutation({
        mutationFn: postServerIP,
        onSuccess: () => {
            refetchServerIPList();
            toast.success('Successfully added server IP.');
            setIpDetails({});
            dispatch(ModalActions.toggleModal('add-process-url-modal'));
        },
        onError: (data) => toast.warn(data?.response?.data?.message || 'Server error'),
    });

    const handleServerIpUpdate = (e) => {
        e.preventDefault();
        if (!ipDetails?.form_filling_server_ip) return toast.warn('Please enter Form Filling Server IP');
        if (!ipDetails?.exam_panel_server_ip) return toast.warn('Please enter Exam Panel IP');
        if (!ipDetails?.id) return toast.warn('Edit id not set.');
        updateServerIpMutation.mutate(ipDetails);
    };

    const updateServerIpMutation = useMutation({
        mutationFn: updateServerIP,
        onSuccess: () => {
            refetchServerIPList();
            toast.success('Successfully updated server IP.');
            setIpDetails({});
            dispatch(ModalActions.toggleModal('edit-process-url-modal'));
        },
        onError: (data) => toast.warn(data?.response?.data?.message || 'Server error'),
    });

    const columns = [
        {
            name: '#',
            selector: (row, idx) => idx + 1,
            width: '4rem',
        },
        {
            name: 'FORM FILLING SERVER (URL/IP)',
            selector: row => row.form_filling_server_ip,
            grow: 2,
            cell: row => (
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                        <FaLink className="text-xs" />
                    </div>
                    <span className="font-mono text-xs text-slate-600 font-bold tracking-tight">{row.form_filling_server_ip}</span>
                    <button 
                        onClick={() => writeToClipboard(row.form_filling_server_ip)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded transition-all text-slate-400 hover:text-cyan-600"
                    >
                        <FaRegClipboard size={12} />
                    </button>
                </div>
            )
        },
        {
            name: 'EXAM PANEL IP',
            selector: row => row.exam_panel_server_ip,
            grow: 2,
            cell: row => (
                <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <MdOutlineTerminal className="text-sm" />
                    </div>
                    <span className="font-mono text-xs text-slate-600 font-bold tracking-tight">{row.exam_panel_server_ip}</span>
                    <button 
                        onClick={() => writeToClipboard(row.exam_panel_server_ip)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded transition-all text-slate-400 hover:text-indigo-600"
                    >
                        <FaRegClipboard size={12} />
                    </button>
                </div>
            )
        },
        {
            name: 'ACTIONS & SYNC',
            minWidth: '460px',
            right: true,
            cell: row => (
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                        <EditIpBtn _el={row} setIpDetails={setIpDetails} ipDetails={ipDetails} />
                        <DeleteIpBtn id={row.id} />
                    </div>
                    
                    <div className="h-8 w-[1px] bg-slate-200 mx-1" />
                    
                    <div className="flex gap-2">
                        <GetCentersListBtn form_filling_server_ip={row.form_filling_server_ip} />
                        <GetStudentsListBtn form_filling_server_ip={row.form_filling_server_ip} />
                        <UploadQuestionPaperToFormFillingBtn _el={row} />
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="ptl-root">
            <CModal id="add-process-url-modal" title={'ADD NEW SERVER CONFIGURATION'} className="w-[600px]">
                <form className="p-5 flex flex-col gap-5" onSubmit={handleServerIpSubmit}>
                    <div className="relative">
                        <InputLabel name="Form Filling Server URL/IP" className="!text-[0.7rem] font-black text-slate-500 mb-1.5 uppercase" />
                        <div className="relative">
                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 z-10" />
                            <input 
                                type="url" 
                                name="form_filling_server_ip"
                                placeholder="https://example.com or 192.168.1.1"
                                value={ipDetails.form_filling_server_ip || ''}
                                onChange={(e) => setIpDetails(prev => ({...prev, [e.target.name]: e.target.value}))}
                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 font-bold text-slate-800 outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <InputLabel name="Exam Panel Server IP" className="!text-[0.7rem] font-black text-slate-500 mb-1.5 uppercase" />
                        <div className="relative">
                            <MdOutlineTerminal className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl z-10" />
                            <input 
                                type="text" 
                                name="exam_panel_server_ip"
                                placeholder="http://localhost:3150"
                                value={ipDetails.exam_panel_server_ip || ''}
                                onChange={(e) => setIpDetails(prev => ({...prev, [e.target.name]: e.target.value}))}
                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={saveIpPending}
                        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-black rounded-2xl shadow-lg shadow-cyan-500/30 hover:scale-[1.01] transition-all uppercase tracking-widest mt-2"
                    >
                        {saveIpPending ? 'SAVING...' : 'SAVE CONFIGURATION'}
                    </button>
                </form>
            </CModal>

            <CModal id="edit-process-url-modal" title={'UPDATE SERVER CONFIGURATION'} className="w-[600px]">
                <form className="p-5 flex flex-col gap-5" onSubmit={handleServerIpUpdate}>
                    <input type="hidden" name="id" value={ipDetails?.id || ''} />
                    <div className="relative">
                        <InputLabel name="Form Filling Server URL/IP" className="!text-[0.7rem] font-black text-slate-500 mb-1.5 uppercase" />
                        <div className="relative">
                            <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 z-10" />
                            <input 
                                type="url" 
                                name="form_filling_server_ip"
                                value={ipDetails.form_filling_server_ip || ''}
                                onChange={(e) => setIpDetails(prev => ({...prev, [e.target.name]: e.target.value}))}
                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 font-bold text-slate-800 outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <InputLabel name="Exam Panel Server IP" className="!text-[0.7rem] font-black text-slate-500 mb-1.5 uppercase" />
                        <div className="relative">
                            <MdOutlineTerminal className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-xl z-10" />
                            <input 
                                type="text" 
                                name="exam_panel_server_ip"
                                value={ipDetails.exam_panel_server_ip || ''}
                                onChange={(e) => setIpDetails(prev => ({...prev, [e.target.name]: e.target.value}))}
                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition-all uppercase tracking-widest mt-2"
                    >
                        UPDATE CONFIGURATION
                    </button>
                </form>
            </CModal>

            <div className="ptl-header-bar">
                <div className="ptl-header-content">
                    <MdDns />
                    <span>SERVER SYNC & IP CONFIGURATION</span>
                </div>
                <button 
                    className="ptl-header-btn" 
                    onClick={() => dispatch(ModalActions.toggleModal('add-process-url-modal'))}
                >
                    <MdAdd className="text-xl" /> Add New Server
                </button>
            </div>

            <div className="ptl-content-container">
                <div className="ptl-mode-indicator">
                    <div className="ptl-mode-label">CONNECTION STATUS</div>
                    <div className="ptl-mode-pill">
                        <span className="ptl-mode-dot" style={{ backgroundColor: '#10B981' }} />
                        SYNC ACTIVE
                    </div>
                </div>

                <div className="ptl-table-card">
                    <DataTable
                        columns={columns}
                        data={formFillingIP || []}
                        isLoading={getServerIPLoading}
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
                                    minHeight: '56px',
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
                                    paddingTop: '1.25rem',
                                    paddingBottom: '1.25rem',
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
            </div>
        </div>
    );
}

export default AddNewStudent;
