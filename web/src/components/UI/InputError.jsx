import React from 'react';

function InputError({ error }) {
	return <>{error && <span className="error">{error}</span>}</>;
}

export default InputError;
