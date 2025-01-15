import dotenv from 'dotenv';
import ApiError from '../application/utils/ApiError.js';
dotenv.config();

const errorHandler = (err, req, res, next) => {
	let error = err;
	console.log(error, '==error global handler==');

	if (error.code) {
		switch (error.code) {
			case 'ER_DUP_ENTRY':
				error = new ApiError(
					409,
					'Duplicate entry. Already exists.',
					error.errors || [],
					error.stack
				);
				error.statusCode = 409;
				break;
			case 'ER_BAD_NULL_ERROR':
				error = new ApiError(
					400,
					'A required field is missing.',
					error.errors || [],
					error.stack
				);
				error.statusCode = 400;
				break;
			default:
				error = new ApiError(
					500,
					'Database error occurred.',
					error.errors || [],
					error.stack
				);
				error.statusCode = 400;
		}
	} else if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || 500;
		const message = error.message || 'Something went wrong';
		error = new ApiError(statusCode, message, error?.errors || [], err.stack);
	}

	const response = {
		...error,
		message: error.message,
		...(process.env.NODE_ENV === 'dev' ? { stack: error.stack } : {}),
	};

	// console.log(response, '==resposne==')
	console.log(error, '==error==');

	return res.status(error.statusCode).json(response);
};

export { errorHandler };
