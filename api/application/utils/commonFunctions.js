export const sendSuccess = (res, data = '') => {
	res.status(200).json({
		success: 1,
		data: data,
	});
};

export const sendError = (res, error) => {
	console.log(error, 'in backend');
	res.status(500).json({
		success: 0,
		data: error.message,
	});
};
