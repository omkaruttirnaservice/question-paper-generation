import { memo } from 'react';
import { FaPencil } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice';

function EditIpBtn({ setIpDetails, _el }) {
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => {
                dispatch(ModalActions.toggleModal('edit-process-url-modal'));
                setIpDetails({
                    id: _el.id,
                    form_filling_server_ip: _el.form_filling_server_ip,
                    exam_panel_server_ip: _el.exam_panel_server_ip,
                });
            }}
            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all border border-emerald-100 shadow-sm"
            title="Edit Configuration"
        >
            <FaPencil size={12} />
        </button>
    );
}

export default memo(EditIpBtn);
