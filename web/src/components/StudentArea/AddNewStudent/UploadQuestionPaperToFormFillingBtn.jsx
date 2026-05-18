import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useEffect, useState } from 'react';
import { FaUpload, FaCloudArrowUp } from 'react-icons/fa6';
import { MdOutlineUploadFile, MdOutlineAssignmentInd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalActions } from '../../../Store/modal-slice';
import CModal from '../../UI/CModal';
import { getPublishedTestList, uploadPresentStudentsToFormFilling, uploadPublishedTestToFormFilling } from './api';
import DataTable from 'react-data-table-component';

function UploadQuestionPaperToFormFillingBtn({ _el }) {
    const dispatch = useDispatch();
    const [publishedTestList, setPublishedTestList] = useState([]);

    const getPublishedTestListQuery = useQuery({
        queryKey: ['Get-Published-Test-List'],
        queryFn: getPublishedTestList,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (getPublishedTestListQuery?.data) {
            setPublishedTestList(getPublishedTestListQuery?.data?.data?.data || []);
        }
    }, [getPublishedTestListQuery?.data]);

    const uploadMutation = useMutation({
        mutationFn: uploadPublishedTestToFormFilling,
        onSuccess: (data) => toast.success(data?.data?.message || 'Upload Successful'),
        onError: (error) => toast.warn(error?.response?.data?.message || 'Server error'),
    });

    const uploadAttendanceMutation = useMutation({
        mutationFn: uploadPresentStudentsToFormFilling,
        onSuccess: (data) => toast.success(data?.data?.message || 'Attendance Uploaded'),
        onError: (error) => toast.warn(error?.response?.data?.message || 'Server error'),
    });

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            width: '4rem',
            cell: row => <span className="font-bold text-slate-400">#{row.id}</span>
        },
        {
            name: 'Test Name',
            selector: row => row.mt_name,
            grow: 2,
        },
        {
            name: 'Batch',
            selector: row => row.tm_allow_to,
            width: '5rem',
            center: true,
        },
        {
            name: 'Date',
            selector: row => row.ptl_active_date,
            width: '7rem',
        },
        {
            name: 'Upload Actions',
            width: '24rem',
            right: true,
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => uploadMutation.mutate({ _published_test_id: row.id, _ip_details: _el })}
                        disabled={uploadMutation.isPending}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        <MdOutlineUploadFile className="text-sm" />
                        Paper to FF
                    </button>
                    <button
                        onClick={() => uploadAttendanceMutation.mutate({ _published_test_id: row.id, _ip_details: _el })}
                        disabled={uploadAttendanceMutation.isPending}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        <MdOutlineAssignmentInd className="text-sm" />
                        Attendance
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    dispatch(ModalActions.toggleModal('published-test-list-modal'));
                    getPublishedTestListQuery.refetch();
                }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-lg text-[10px] shadow-sm uppercase tracking-wider transition-all whitespace-nowrap"
            >
                <FaCloudArrowUp className="text-sm" />
                Upload to FF
            </button>

            <CModal
                className="!w-[80vw]"
                id="published-test-list-modal"
                title="SELECT TEST TO UPLOAD TO FORM FILLING"
            >
                <div className="p-4">
                    <DataTable
                        columns={columns}
                        data={publishedTestList}
                        pagination
                        highlightOnHover
                        customStyles={{
                            headRow: { style: { backgroundColor: '#F8FAFC', minHeight: '48px' } },
                            headCells: { style: { color: '#64748B', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' } },
                            cells: { style: { fontSize: '0.8rem', fontWeight: '600', paddingY: '0.75rem' } },
                        }}
                    />
                </div>
            </CModal>
        </>
    );
}

export default memo(UploadQuestionPaperToFormFillingBtn);
