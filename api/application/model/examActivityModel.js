import runQuery from "../utils/runQuery.js";

const examActivityModel = {
    addLog: async (pool, data) => {
        const MASTER_DB = process.env.MASTER_DB_NAME || 'dv_exp_db';
        const query = `
            INSERT INTO ${MASTER_DB}.exam_activity_log 
            (
                student_id, admin_id, student_name, roll_no, 
                batch_id, exam_id, published_id, exam_name, lab_name,
                session_id, action_type, message, 
                question_id, question_no, 
                selected_option, answer_snapshot, extra_data,
                from_q, to_q, pc_label, old_pc, new_pc, 
                link_id, mac_address, ip_address, 
                attempt_no, total_questions, attempted, duration_mins
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.student_id || null,
            data.admin_id || null,
            data.student_name || null,
            data.roll_no || null,
            data.batch_id || null,
            data.exam_id || null,
            data.published_id || null,
            data.exam_name || null,
            data.lab_name || null,
            data.session_id || null,
            data.action_type || 'unknown',
            data.message || '',
            data.question_id || null,
            data.question_no || null,
            data.selected_option || null,
            data.answer_snapshot || null,
            data.extra_data || null,
            data.from_q || null,
            data.to_q || null,
            data.pc_label || null,
            data.old_pc || null,
            data.new_pc || null,
            data.link_id || null,
            data.mac_address || null,
            data.ip_address || null,
            data.attempt_no || null,
            data.total_questions || null,
            data.attempted || null,
            data.duration_mins || null
        ];

        try {
            return await runQuery(pool, query, values);
        } catch (error) {
            console.error("Question Paper Activity Logging Error:", error);
            return null;
        }
    }
};

export default examActivityModel;
