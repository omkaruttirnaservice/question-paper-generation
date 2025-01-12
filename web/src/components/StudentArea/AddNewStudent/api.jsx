import axios from 'axios';
let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const postServerIP = async (ip) => {
	const url = SERVER_IP + '/api/students-area/set-server-ip';
	return await axios.post(url, { ip });
};

export const updateServerIP = async ({ ip, id }) => {
	const url = SERVER_IP + '/api/students-area/update-server-ip';
	return await axios.put(url, { ip, id });
};

export const deleteServerIP = async (id) => {
	const url = SERVER_IP + `/api/students-area/delete-server-ip/${id}`;
	return await axios.delete(url);
};

export const getServerIP = async () => {
	let _res = await fetch(SERVER_IP + '/api/students-area/get-server-ip');
	if (!_res.ok) {
		const errorData = await _res.json();
		const error = new Error(errorData?.message || `Server error.`);
		error.status = _res.status;
		throw error;
	}
	return _res.json();
};

export const getStudentsList = async (ip) => {
	console.log(ip, '==ip==');
	const url = SERVER_IP + '/api/students-area/all-list';
	return await axios.post(url, { ip });
};

export const getCentersList = async (ip) => {
	const url = SERVER_IP + '/api/students-area/download-centers-list';
	return await axios.post(url, { ip });
};
