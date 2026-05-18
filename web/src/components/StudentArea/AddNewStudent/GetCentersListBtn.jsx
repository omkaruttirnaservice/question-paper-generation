import React, { memo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getCentersList } from './api';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { MdOutlineDomain } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function GetCentersListBtn({ form_filling_server_ip }) {
    const getCenterListMutation = useMutation({
        mutationFn: getCentersList,
        onSuccess: (data) => {
            Swal.fire({
                title: 'Success',
                text: 'Downloaded centers list successfully',
                icon: 'success'
            });
        },
        onError: (error) => {
            const er = error?.response?.data?.message || 'Server error.';
            toast.warn(er);
        },
    });

    return (
        <button
            type="button"
            onClick={() => getCenterListMutation.mutate(form_filling_server_ip)}
            disabled={getCenterListMutation.isPending}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-lg text-[10px] shadow-sm uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
        >
            {getCenterListMutation.isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xs" />
            ) : (
                <MdOutlineDomain className="text-sm" />
            )}
            Sync Centers
        </button>
    );
}

export default memo(GetCentersListBtn);
