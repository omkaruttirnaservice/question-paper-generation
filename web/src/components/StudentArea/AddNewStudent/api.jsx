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

export const getPublishedTestList = async () => {
	// This download students question paper from exam panel
	const url = SERVER_IP + '/api/test/list-published';

	return await axios.get(url);
};

export const uploadPublishedTestToFormFilling = async ({
	_published_test_id,
	_ip_details,
}) => {
	/**
	 *  This will upload published test to form filling server
	 * 	The Published test will be selecteed by using id of `tm_published_test_lists` table
	 *  It will include Question Paper and Published Test details
	 * */
	const url =
		SERVER_IP + '/api/students-area/upload-published-test-to-form-filling';
	return await axios.post(url, {
		published_test_id: _published_test_id,
		ip_details: _ip_details,
	});
};

export const getPostList = async (selectedIP) => {
	console.log(2, '==2==');
	const url = selectedIP.form_filling_server_ip + '/api/posts-list';
	console.log(selectedIP, '==selectedIP==');

	return await axios.get(url);
};

export const getExamsList = async () => {
	const url = SERVER_IP + '/api/test/list';
	return await axios.get(url);
};
