let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getBatchAndCenterList = async () => {
	let _res = await fetch(SERVER_IP + '/api/students-area/get-center-and-batch-list');
	return await _res.json();
};

export const getStudentsListFilter = async (reqBody) => {
	let _res = await fetch(SERVER_IP + '/api/students-area/all-list-filtered', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(reqBody),
	});
	return await _res.json();
};
