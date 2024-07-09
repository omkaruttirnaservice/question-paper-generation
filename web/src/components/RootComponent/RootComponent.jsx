import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RootComponent() {
	return (
		<>
			<ToastContainer autoClose={2000} />
			<div className="">
				<MenuBar />
				<Outlet />
			</div>
		</>
	);
}

export default RootComponent;
