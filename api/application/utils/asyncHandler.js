export const asyncHandler = (controllerFun) => {
	return async (req, res, next) => {
		Promise.resolve(controllerFun(req, res, next)).catch((err) => {
			next(err);
		});
	};
};
