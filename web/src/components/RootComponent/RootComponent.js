import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './RootComponent.css';

function RootComponent() {
	return (
		<>
			<ToastContainer autoClose={2000} />
			<div className="">
				<div className=" menubar ">
					<MenuBar />
				</div>
				<div className="">
					<Outlet />
				</div>
			</div>
		</>
	);
}

export default RootComponent;
