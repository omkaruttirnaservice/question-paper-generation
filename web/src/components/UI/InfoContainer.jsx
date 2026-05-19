import React, { Children } from 'react';

function InfoContainer({ children, className }) {
	return <div className={`bg-blue-50/50 border border-blue-100 shadow-sm p-4 rounded-xl mx-auto container ${className} mb-6`}>{children}</div>;
}

export default InfoContainer;
