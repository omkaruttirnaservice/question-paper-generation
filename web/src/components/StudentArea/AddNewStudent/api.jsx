export const postServerIP = async (ip) => {
	let _res = await fetch('/api/students-area/set-server-ip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ip }),
	});

	return _res.json();
};

export const getServerIP = async () => {
	let _res = await fetch('/api/students-area/get-server-ip');
	return _res.json();
};

export const getStudentsList = async (ip) => {
	let _res = await fetch('/api/students-area/all-list', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ip }),
	});
	return _res.json();
};
