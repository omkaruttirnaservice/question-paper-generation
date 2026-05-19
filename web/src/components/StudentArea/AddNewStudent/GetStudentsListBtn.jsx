import { useMutation } from '@tanstack/react-query';
import { getStudentsList } from './api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { memo } from 'react';
import { MdOutlineGroups } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function GetStudentsListBtn({ form_filling_server_ip }) {
    const getStudentListMutation = useMutation({
        mutationFn: getStudentsList,
        onSuccess: (data) => {
            Swal.fire({
                title: 'Success',
                text: 'Downloaded students list successfully',
                icon: 'success'
            });
        },
        onError: (error) => {
            const er = error?.response?.data?.message || 'Server error.';
            if (er === 'Validation error') {
                Swal.fire('Notice', 'Student data is already up to date', 'info');
            } else {
                toast.warn(er);
            }
        },
    });

    return (
        <button
            type="button"
            onClick={() => getStudentListMutation.mutate(form_filling_server_ip)}
            disabled={getStudentListMutation.isPending}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-lg text-[10px] shadow-sm uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
        >
            {getStudentListMutation.isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xs" />
            ) : (
                <MdOutlineGroups className="text-sm" />
            )}
            Sync Students
        </button>
    );
}

export default memo(GetStudentsListBtn);
