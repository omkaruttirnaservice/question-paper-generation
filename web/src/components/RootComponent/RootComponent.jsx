import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';

function RootComponent() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	return (
		<>
			<ToastContainer autoClose={2000} />
			<div className="flex h-screen">
				<div
					className={`transition-all duration-300 ease-in-out ${
						isSidebarOpen ? 'w-[10rem]' : 'w-[3.5rem]'
					} h-screen bg-gradient-to-t from-cyan-600 to-blue-400 border overflow-hidden`}>
					<div className="flex justify-start p-2">
						<RxHamburgerMenu onClick={toggleSidebar} className="text-xl" />
					</div>

					<MenuBar isSidebarOpen={isSidebarOpen} />
				</div>
				<div className="h-screen overflow-y-auto flex-1 px-2">
					<Outlet />
				</div>
			</div>
		</>
	);
}

export default RootComponent;
