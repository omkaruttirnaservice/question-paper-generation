export const getPublishedTestLists = async (ip) => {
	let _res = await fetch('/api/reports/get-published-tests');
	return _res.json();
};
