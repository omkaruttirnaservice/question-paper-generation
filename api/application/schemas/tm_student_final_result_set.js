import {
	BIGINT,
	TEXT,
	STRING,
	DATEONLY,
	INTEGER,
	Sequelize,
	DATE,
	TIME,
} from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import tn_student_list from './tn_student_list.js';

const tm_student_final_result_set = sequelize.define(
	'tm_student_final_result_set',
	{
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},

		sfrs_publish_id: { type: Sequelize.INTEGER },
		sfrs_batch_id: { type: Sequelize.INTEGER },
		sfrs_master_exam_id: { type: Sequelize.INTEGER },

		sfrs_student_id: { type: Sequelize.INTEGER },
		sfrs_student_roll_no: { type: Sequelize.STRING(50) },
		sfrs_marks_gain: { type: Sequelize.STRING(50) },
		srfs_percentile: { type: Sequelize.DOUBLE, defaultValue: 0 },
		sfrs_correct: { type: Sequelize.STRING(50) },
		sfrs_wrong: { type: Sequelize.STRING(50) },
		sfrs_unattempted: { type: Sequelize.STRING(50) },
		sfrs_cutoff: { type: Sequelize.STRING(50) },
		sfrc_total_marks: { type: Sequelize.STRING(50) },

		sfrs_test_date: { type: Sequelize.DATEONLY },
		sfrs_test_info: { type: Sequelize.STRING(20), defaultValue: 'Test' },
		sfrs_rem_min: { type: Sequelize.STRING(20) },
		sfrs_rem_sec: { type: Sequelize.STRING(20) },

		sfrs_duration: { type: Sequelize.INTEGER },
		sfrs_sms: { type: Sequelize.STRING(20), defaultValue: '0' },
		sfrs_sms_issue: { type: Sequelize.STRING(512), defaultValue: 'No' },
		sfrs_sms_message: { type: Sequelize.STRING(512), defaultValue: 'No' },
		sfrs_is_absent: { type: Sequelize.INTEGER, defaultValue: '1' },
		sfrs_percentile: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_id_1: { type: Sequelize.INTEGER, defaultValue: '0' },
		sfrs_sub_name_1: { type: Sequelize.STRING(30), defaultValue: '0' },
		sfrs_sub_marks_1: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_percentile_1: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_id_2: { type: Sequelize.INTEGER, defaultValue: '0' },
		sfrs_sub_name_2: { type: Sequelize.STRING(30), defaultValue: '0' },
		sfrs_sub_marks_2: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_percentile_2: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_id_3: { type: Sequelize.INTEGER, defaultValue: '0' },
		sfrs_sub_name_3: { type: Sequelize.STRING(30), defaultValue: '0' },
		sfrs_sub_marks_3: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_percentile_3: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_id_4: { type: Sequelize.INTEGER, defaultValue: '0' },
		sfrs_sub_name_4: { type: Sequelize.STRING(30), defaultValue: '0' },
		sfrs_sub_marks_4: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_sub_percentile_4: { type: Sequelize.DOUBLE, defaultValue: '0' },
		sfrs_dob: { type: Sequelize.BIGINT, defaultValue: '0' },
		sfrs_rank: { type: Sequelize.INTEGER, defaultValue: '0' },

		createdAt: {
			type: DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updatedAt: {
			type: DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
	}
);

tm_student_final_result_set.belongsTo(tn_student_list, {
	foreignKey: 'sfrs_student_id',
	as: 'tn_student_list',
});
export default tm_student_final_result_set;
