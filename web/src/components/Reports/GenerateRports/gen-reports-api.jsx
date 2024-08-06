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

export const getResultExcel = async (testId) => {
	console.log(testId, '==testId==');
	let _res = await fetch(SERVER_IP + '/api/reports/get-result-excel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ testId }),
	});
	const _blob = await _res.blob();
	console.log(_blob, '==_blob==');

	const url = window.URL.createObjectURL(_blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'result.xlsx';
	document.body.appendChild(a);
	a.click();

	window.URL.revokeObjectURL(url);
	document.body.removeChild(a);
};

export const singleCandiatePaper = async ({ studentRollNumber, publishedTestId }) => {
	let _res = await fetch(`${SERVER_IP}/api/exams/single-candidate-paper?stud_roll=${studentRollNumber}&pub_test_id=${publishedTestId}`);
	return await _res.json();
};
