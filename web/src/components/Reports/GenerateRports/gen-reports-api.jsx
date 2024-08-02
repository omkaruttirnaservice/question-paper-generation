export const getPublishedTestLists = async (ip) => {
	let _res = await fetch('/api/reports/get-published-tests');
	return _res.json();
};

export const generateResult = async (testId) => {
	let _res = await fetch('/api/reports/generate-result', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ testIdInBase64: testId }),
	});

	return await _res.json();
};
