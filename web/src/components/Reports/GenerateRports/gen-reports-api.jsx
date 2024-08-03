let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getPublishedTestLists = async (ip) => {
	let _res = await fetch(SERVER_IP + '/api/reports/get-published-tests');
	return _res.json();
};

export const generateResult = async (testId) => {
	let _res = await fetch(SERVER_IP + '/api/reports/generate-result', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ testIdInBase64: testId }),
	});

	return await _res.json();
};

export const getResultViewData = async (testId) => {
	let _res = await fetch(SERVER_IP + '/api/reports/get-result-view-data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ testId }),
	});

	return await _res.json();
};
