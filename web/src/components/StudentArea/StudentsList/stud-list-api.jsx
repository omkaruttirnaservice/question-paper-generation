export const getStudList = async () => {
	let _res = await fetch('/api/students-area/all-list');
	return await _res.json();
};
