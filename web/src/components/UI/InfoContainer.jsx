import React, { Children } from 'react';

function InfoContainer({ children, className }) {
	return <div className={`bg-cyan-100 shadow-sm  border-t-sky-700 border-t-4 p-3 mx-auto container ${className} mb-6`}>{children}</div>;
}

export default InfoContainer;
