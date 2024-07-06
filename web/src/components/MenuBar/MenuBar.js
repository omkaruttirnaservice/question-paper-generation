import react from 'react';
import { NavLink } from 'react-router-dom';

import './MenuBar.css';

function MenuBar() {
	const menuButtons = [
		{
			name: 'Add Questions',
			icon: 'fa-solid fa-square-plus',
			path: '/question-form',
		},
		{
			name: 'Questions List',
			icon: 'fa-solid fa-house',
			path: '/questions-list',
		},
		{
			name: 'Deleted Questions',
			icon: 'fa-solid fa-house',
			path: '/deleted-questions-list',
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
