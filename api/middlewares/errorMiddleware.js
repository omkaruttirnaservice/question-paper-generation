import dotenv from 'dotenv';
import ApiError from '../application/utils/ApiError.js';
dotenv.config();

const errorHandler = (err, req, res, next) => {
	let error = err;

	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || 500;
		const message = error.message || 'Something went wrong';
		error = new ApiError(statusCode, message, error?.errors || [], err.stack);
	}

	const response = {
		...error,
		message: error.message,
		...(process.env.NODE_ENV === 'dev' ? { stack: error.stack } : {}),
	};

	return res.status(error.statusCode).json(response);
};

export { errorHandler };
