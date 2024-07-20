import { FaList } from 'react-icons/fa';
import { FiFilePlus } from 'react-icons/fi';
import { LuBookPlus } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { MdOutlineChecklist } from 'react-icons/md';

import { MdDashboard } from 'react-icons/md';

import { ModalActions } from '../../Store/modal-slice.jsx';
import './MenuBar.css';

function MenuBar({ isSidebarOpen }) {
	const dispatch = useDispatch();
	const createTestHandler = () => {
		dispatch(ModalActions.toggleModal('create-test-modal'));
		dispatch(testsSliceActions.setTestCreationType(MANUAL_TEST));
	};

	const createTestHandlerAuto = () => {
		dispatch(ModalActions.toggleModal('create-test-modal-auto'));
		dispatch(testsSliceActions.setTestCreationType(AUTO_TEST));
	};
	// dispatch(ModalActions.toggleModal(''));
	return (
		<>
			<div className="flex flex-col p-2 gap-2 justify-start container mx-auto">
				<NavLink to={'/dashboard'} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
					<div className="flex justify-center items-center gap-3">
						<MdDashboard className="text-xl" />
						{isSidebarOpen && <span>Dashboard</span>}
					</div>
				</NavLink>

				<NavLink to={'/tests-list'} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
					<FaList className="text-xl" />
					{isSidebarOpen && <span>Tests List</span>}
				</NavLink>

				<NavLink to={'/published-test'} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
					<MdOutlineChecklist className="text-xl" />
					{isSidebarOpen && <span>Published Tests List</span>}
				</NavLink>

				<NavLink to={'/create-test/manual'} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
					<LuBookPlus className="text-xl" />
					{isSidebarOpen && <span>Create Test (Manual)</span>}
				</NavLink>

				<NavLink to={'/create-test/auto'} className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}>
					<FiFilePlus className="text-xl" />
					{isSidebarOpen && <span>Create Test (Auto)</span>}
				</NavLink>
			</div>
		</>
	);
}

export default MenuBar;
