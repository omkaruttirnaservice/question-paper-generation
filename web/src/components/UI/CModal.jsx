import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.jsx';
import CButton from './CButton.jsx';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CModal({ id, children, title, showCloseBtn = true, className = '', headerClass = '' }) {
    const _modalSlice = useSelector((state) => state.modal);

    function _isModalOpen(key) {
        return !!_modalSlice[key];
    }

    useEffect(() => {
        if (_isModalOpen(id)) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup when modal unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [_isModalOpen(id)]);

    if (!_isModalOpen(id)) return null;

    return createPortal(
        <>
            <ModalBackdrop />
            <div
                className={`bg-white z-50
                            fixed
                            overflow-y-auto 
                            shadow-2xl 
                            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            p-6
                            min-w-[400px]
                            w-auto
                            !min-h-[10rem]
                            max-h-[90vh]
                            rounded-3xl
                            ${className}
                            `}>
                <div>
                    <ModalHeader id={id} showCloseBtn={showCloseBtn} headerClass={headerClass}>
                        {title}
                    </ModalHeader>

                    <div className="pt-4">{children}</div>
                </div>
            </div>
        </>,
        document.body
    );
}

export function ModalBackdrop() {
    return (
        <div className="fixed inset-0 z-[40] bg-black/40 backdrop-blur-md"></div>
    );
}

export function ModalTitle({ children }) {
    return <p>{children}</p>;
}

export function ModalHeader({ children, id, showCloseBtn, headerClass = '' }) {
    return (
        <div className={`flex justify-between items-center ${headerClass ? headerClass : 'border-b border-slate-200 pb-4 mb-2 bg-white'}`}>
            <div className={`font-black text-base tracking-wide ${headerClass ? 'text-white' : 'text-slate-800'}`}>{children}</div>
            {showCloseBtn && <ModalCloseBtn id={id} showCloseBtn={showCloseBtn} />}
        </div>
    );
}

export function ModalCloseBtn({ id }) {
    const dispatch = useDispatch();
    return (
        <CButton
            varient="btn--danger"
            icon={<IoClose />}
            onClick={() => {
                dispatch(ModalActions.toggleModal(id));
            }}
        />
    );
}
