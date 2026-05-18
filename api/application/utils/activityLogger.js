import examActivityModel from '../model/examActivityModel.js';

const getClientIp = (req) => {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (ip && ip.includes('::ffff:')) {
        ip = ip.split(':').pop();
    }
    return ip;
};

const activityLogger = {
    /**
     * Question Paper Project centralized logging function
     * @param {Object} req - Express request object
     * @param {Object} pool - Database pool
     * @param {string} actionType - Activity type constant
     * @param {string} message - Descriptive message
     * @param {Object} customData - Any extra fields
     */
    log: async (req, pool, actionType, message, customData = {}) => {
        try {
            // Check for pool (Question-pepar project might use sequelize or mysql pool)
            const dbPool = pool || req.app.get('pool');
            if (!dbPool) return;

            const ip = getClientIp(req);
            // In QP project, user is often in req.user
            const adminInfo = req.user || (req.session ? req.session.User : {}) || {};

            const logData = {
                admin_id: customData.admin_id || adminInfo.id || adminInfo.u_id || null,
                student_name: customData.admin_name || adminInfo.fullName || adminInfo.u_full_name || 'QP_Admin',
                
                session_id: (req.session ? req.sessionID : null) || null,
                action_type: actionType,
                message: message,

                extra_data: customData.extra_data || (Object.keys(customData).length > 0 ? JSON.stringify(customData) : null),
                ip_address: ip,
                mac_address: customData.mac_address || null,
                exam_id: customData.exam_id || null,
                exam_name: customData.exam_name || null
            };

            // Log to database
            await examActivityModel.addLog(dbPool, logData);

        } catch (error) {
            console.error("QP Activity Logging failed:", error);
        }
    }
};

export default activityLogger;
