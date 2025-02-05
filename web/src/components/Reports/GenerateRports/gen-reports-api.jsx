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

export const getExamDates = async () => {
	let _res = await fetch(SERVER_IP + `/api/reports/get-exam-dates-list`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!_res.ok) {
		const _resJson = await _res.json();
		throw new Error(_resJson?.message || 'Server errror');
	}

	return await _res.json();
};

export const getResultBatchesList = async () => {
	let _res = await fetch(SERVER_IP + `/api/reports/get-result-batches-list`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!_res.ok) {
		const _resJson = await _res.json();
		throw new Error(_resJson?.message || 'Server errror');
	}

	return await _res.json();
};

export const getResultViewData = async (viewResultBy) => {
	console.log(viewResultBy, '==viewResultBy==');
	let _res = await fetch(SERVER_IP + `/api/reports/get-result-view-data`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(viewResultBy),
	});

	if (!_res.ok) {
		const _resJson = await _res.json();
		throw new Error(_resJson?.message || 'Server errror');
	}

	const data = await _res.json();
	console.log(data, '==data==');
	return data;
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

export const getCustomResultExcel = async (data) => {
	let _res = await fetch(SERVER_IP + '/api/reports/get-custom-result-excel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!_res.ok) {
		const _resJson = await _res.json();
		throw new Error(_resJson?.message || 'Server errror');
	}

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

export const singleCandiatePaper = async ({
	studentRollNumber,
	publishedTestId,
}) => {
	console.log(studentRollNumber, '==studentRollNumber==');
	console.log(publishedTestId, '==publishedTestId==');

	let _res = await fetch(
		`${SERVER_IP}/api/exams/single-candidate-paper?stud_roll=${studentRollNumber}&pub_test_id=${publishedTestId}`
	);
	return await _res.json();
};
