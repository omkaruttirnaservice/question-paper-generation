// export const asyncHandler = (controllerFun) => {
// 	return async (req, res, next) => {
// 		Promise.resolve(controllerFun(req, res, next)).catch((err) => {
// 			next(err);
// 		});
// 	};
// };

export const asyncHandler = (controllerFun) => {
    return async (req, res, next) => {
        try {
            await controllerFun(req, res, next);
        } catch (err) {
            next(err);  // This passes the error to the next middleware (which should be your error handler)
        }
    };
};
