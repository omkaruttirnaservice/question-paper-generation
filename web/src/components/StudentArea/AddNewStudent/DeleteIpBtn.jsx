import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { deleteServerIP } from './api';
import { confirmDialouge } from '../../../helpers/confirmDialouge';

function DeleteIpBtn({ id }) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteServerIP,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['getServerIP']);
            toast.success(data?.data?.message || 'Configuration deleted');
        },
        onError: (error) => toast.warn(error?.response?.data?.message || 'Server error'),
    });

    const handleDelete = async () => {
        const isConfirm = await confirmDialouge({
            title: 'Delete configuration?',
            text: 'This will remove the server sync settings.',
        });
        if (isConfirm) deleteMutation.mutate(id);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-100 shadow-sm"
            title="Delete IP Configuration"
        >
            <FaTrash size={12} />
        </button>
    );
}

export default memo(DeleteIpBtn);
