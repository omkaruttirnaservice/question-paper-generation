let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const postServerIP = async (ip) => {
	let _res = await fetch(SERVER_IP + '/api/students-area/set-server-ip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ip }),
	});

	return _res.json();
};

export const getServerIP = async () => {
	let _res = await fetch(SERVER_IP + '/api/students-area/get-server-ip');
	return _res.json();
};

export const getStudentsList = async (ip) => {
	let _res = await fetch(SERVER_IP + '/api/students-area/all-list', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ip }),
	});
	return _res.json();
};

export const getCentersList = async (ip) => {
	let _res = await fetch(SERVER_IP + '/api/students-area/download-centers-list', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ip }),
	});
	return _res.json();
};
