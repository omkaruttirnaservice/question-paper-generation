import { NavLink } from 'react-router-dom';

import './MenuBar.css';

function MenuBar() {
	const menuButtons = [
		{
			name: 'Dashboard',
			path: '/dashboard',
		},
	];

	return (
		<>
			<div className="flex p-2 gap-2 justify-start container mx-auto">
				{menuButtons?.map((el, index) => {
					return (
						<NavLink
							key={index}
							to={el.path}
							className={({ isActive }) =>
								isActive ? 'menu-item active' : 'menu-item'
							}>
							<i className={el.icon}></i>
							<span>{el.name}</span>
						</NavLink>
					);
				})}
			</div>
		</>
	);
}

export default MenuBar;
