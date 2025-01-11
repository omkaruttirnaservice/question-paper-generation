import axios from 'axios';

let SERVER_IP = import.meta.env.VITE_API_SERVER_IP;
export const getStudList = async () => {
	const url = SERVER_IP + '/api/students-area/all-list';
	return await axios.get(url);
};
