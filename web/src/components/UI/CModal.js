import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../Store/modal-slice.js';
import CButton from './CButton.js';

export default function CModal({ id, children, title, showCloseBtn = true }) {
	const _modalSlice = useSelector((state) => state.modal);

	function _isModalOpen(key) {
		return !!_modalSlice[key];
	}
	return (
		<>
			{_isModalOpen(id) && (
				<>
					<ModalBackdrop></ModalBackdrop>
					<div
						className={`bg-white  z-50 transition-all duration-300 absolute shadow-xl min-h-[10rem] left-[50%] translate-x-[-50%] translate-y-[-50%] ${
							_isModalOpen
								? `top-[50%] opacity-100 visible`
								: `top-[55%] opacity-0 invisible`
						} top-[50%] p-4 min-w-[40vw] w-auto`}>
						<ModalHeader id={id} showCloseBtn={showCloseBtn}>
							{title}
						</ModalHeader>

						<div className="pt-4">{children}</div>
					</div>
				</>
			)}
		</>
	);
}

export function ModalBackdrop() {
	return (
		<div className="fixed inset-0 z-40 h-[100vh] w-[100vw]  bg-black/50 backdrop-blur-sm"></div>
	);
}

export function ModalTitle({ children }) {
	return <p>{children}</p>;
}

export function ModalHeader({ children, id, showCloseBtn }) {
	return (
		<div className="border-b border-slate-400 h-10 w-100 flex justify-between items-center pb-4">
			<div className={'mb-0'}>{children}</div>
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
