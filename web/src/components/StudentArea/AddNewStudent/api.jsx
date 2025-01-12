import axios from 'axios';
let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;

export const postServerIP = async ({
	form_filling_server_ip,
	exam_panel_server_ip,
}) => {
	const url = SERVER_IP + '/api/students-area/set-server-ip';
	return await axios.post(url, {
		form_filling_server_ip,
		exam_panel_server_ip,
	});
};

export const updateServerIP = async ({
	form_filling_server_ip,
	exam_panel_server_ip,
	id,
}) => {
	const url = SERVER_IP + '/api/students-area/update-server-ip';
	return await axios.put(url, {
		form_filling_server_ip,
		exam_panel_server_ip,
		id,
	});
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

export const getQuestionPaper = async (exam_panel_server_ip) => {
	// This download students question paper from exam panel
	const url = SERVER_IP + '/api/students-area/get-students-question-paper';
	return await axios.post(url, { exam_panel_server_ip });
};
