import React from 'react';

function ContextMenu({ show = true, className, list, ref }) {
	return (
		<ul
			ref={ref}
			className={`absolute z-50 bg-white shadow-lg 
                bottom-0 right-0 ${
									className ? className : ''
								} transition-all duration-300 ease-in-out
                ${
									show
										? 'opacity-1 pointer-events-auto'
										: 'opacity-0 pointer-events-none hidden'
								}`}
		>
			{list.map((_el) => {
				return (
					<li className="cursor-pointer hover:bg-gray-200 p-3 w-[10rem]">
						{_el.name}
					</li>
				);
			})}
		</ul>
	);
}

export default ContextMenu;
