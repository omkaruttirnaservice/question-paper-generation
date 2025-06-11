export const sendSuccess = (res, data = '', message) => {
    res.status(200).json({
        success: 1,
        data: data,
        message,
    });
};

export const sendError = (res, message) => {
    res.status(500).json({
        success: 0,
        message,
    });
};
