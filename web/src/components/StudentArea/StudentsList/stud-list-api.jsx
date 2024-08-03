let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getStudList = async () => {
	let _res = await fetch(SERVER_IP + '/api/students-area/all-list');
	return await _res.json();
};
