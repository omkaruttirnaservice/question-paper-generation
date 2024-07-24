import { BIGINT, TEXT, STRING, DATEONLY, INTEGER, Sequelize, DATE, TIME } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tn_student_list = sequelize.define(
	'tn_student_list',
	{
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		sl_f_name: {
			type: STRING(1024),
		},
		sl_m_name: {
			type: STRING(1024),
		},
		sl_l_name: {
			type: STRING(1024),
		},
		sl_image: {
			type: TEXT('long'),
		},
		sl_sign: {
			type: TEXT('long'),
		},
		sl_email: {
			type: TEXT('long'),
		},
		sl_father_name: {
			type: STRING(50),
		},
		sl_mother_name: {
			type: STRING(50),
		},
		sl_address: {
			type: TEXT('medium'),
		},
		sl_mobile_number_parents: {
			type: STRING(15),
		},
		sl_tenth_marks: {
			type: INTEGER,
		},
		sl_contact_number: {
			type: STRING(15),
		},
		sl_class: {
			type: STRING(50),
		},
		sl_roll_number: {
			type: STRING(50),
		},
		sl_subject: {
			type: STRING(50),
		},
		sl_stream: {
			type: STRING(70),
		},
		sl_addmit_type: {
			type: STRING(70),
		},
		sl_time: {
			type: STRING(20),
		},
		sl_date: {
			type: DATEONLY,
		},
		sl_time_stamp: {
			type: DATE,
		},
		sl_added_by_login_id: {
			type: INTEGER,
		},
		sl_is_live: {
			type: INTEGER,
		},
		sl_date_of_birth: {
			type: DATE,
		},
		sl_school_name: {
			type: STRING(500),
		},
		sl_catagory: {
			type: STRING(40),
		},
		sl_application_number: {
			type: STRING(20),
		},
		sl_is_physical_handicap: {
			type: STRING(10),
		},
		sl_is_physical_handicap_desc: {
			type: STRING(100),
		},
		sl_post: {
			type: STRING(20),
		},
		sl_center_code: {
			type: INTEGER,
		},
		sl_batch_no: {
			type: INTEGER(2),
		},
		sl_exam_date: {
			type: DATEONLY,
		},
		sl_password: {
			type: TEXT('long'),
		},

		createdAt: {
			type: DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updatedAt: {
			type: DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['sl_roll_number'],
			},
		],
	}
);

export default tn_student_list;
