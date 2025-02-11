import {
	BIGINT,
	TEXT,
	STRING,
	DATEONLY,
	INTEGER,
	Sequelize,
	DATE,
	TIME,
	DataTypes,
} from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tn_student_list = sequelize.define(
	'tn_student_list',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		sl_f_name: {
			type: DataTypes.STRING(1024),
			allowNull: false,
		},
		sl_m_name: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		sl_l_name: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		sl_image: {
			type: DataTypes.TEXT('long'),
			allowNull: true,
		},
		sl_sign: {
			type: DataTypes.TEXT('long'),
			allowNull: true,
		},
		sl_email: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		sl_father_name: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		sl_mother_name: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		sl_address: {
			type: DataTypes.TEXT('medium'),
			allowNull: true,
		},
		sl_mobile_number_parents: {
			type: DataTypes.STRING(15),
			allowNull: true,
		},
		sl_tenth_marks: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		sl_contact_number: {
			type: DataTypes.STRING(1024),
			allowNull: false,
		},
		sl_class: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		sl_roll_number: {
			type: DataTypes.STRING(20),
			allowNull: true,
			unique: true,
		},
		sl_subject: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		sl_stream: {
			type: DataTypes.STRING(70),
			allowNull: true,
		},
		sl_addmit_type: {
			type: DataTypes.STRING(70),
			allowNull: true,
		},
		sl_time: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		sl_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		sl_time_stamp: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		sl_added_by_login_id: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		sl_is_live: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		sl_date_of_birth: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		sl_school_name: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		sl_catagory: {
			type: DataTypes.STRING(128),
			allowNull: true,
		},
		sl_application_number: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		sl_is_physical_handicap: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		sl_is_physical_handicap_desc: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		sl_post: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		sl_center_code: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		sl_batch_no: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		sl_exam_date: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		sl_password: {
			type: DataTypes.TEXT('long'),
			allowNull: true,
		},
		sl_present_status: {
			type: DataTypes.INTEGER,
			defaultValue: 2,
		},
		sl_cam_image: {
			type: DataTypes.STRING(255),
			defaultValue: '',
		},

		center_id: {
			type: DataTypes.STRING(10),
			defaultValue: '',
		},
		floor: {
			type: DataTypes.STRING(10),
			defaultValue: '',
		},
		department: {
			type: DataTypes.STRING(10),
			defaultValue: '',
		},
		lab_no: {
			type: DataTypes.STRING(10),
			defaultValue: '',
		},
		lab_name: {
			type: DataTypes.STRING(10),
			defaultValue: '',
		},
	},
	{
		tableName: 'tn_student_list',
		timestamps: false,
	}
);

export default tn_student_list;
