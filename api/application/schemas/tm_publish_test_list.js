import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_publish_test_list = sequelize.define(
    'tm_publish_test_list',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ptl_active_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        ptl_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        ptl_link: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ptl_link_1: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        ptl_test_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        ptl_master_exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ptl_master_exam_name: {
            type: DataTypes.STRING(128),
            defaultValue: '0',
        },
        ptl_added_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        ptl_added_time: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        ptl_time_stamp: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        ptl_test_description: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
        },
        ptl_is_live: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        ptl_aouth_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        ptl_is_test_done: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ptl_test_info: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mt_name: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
        },
        mt_added_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        mt_descp: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mt_is_live: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        mt_time_stamp: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        mt_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '1: on tablet, 2: on paper',
        },
        tm_aouth_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        mt_test_time: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'test duration',
        },
        mt_total_test_takan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        mt_is_negative: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '0',
        },
        mt_negativ_mark: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '0',
        },
        mt_mark_per_question: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '1',
        },
        mt_passing_out_of: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'cut off',
        },
        mt_total_marks: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        mt_pattern_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'eg. 0 for general',
        },
        mt_total_test_question: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        mt_added_time: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        mt_pattern_name: {
            type: DataTypes.STRING(30),
            defaultValue: '-',
        },
        is_test_generated: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        ptl_test_mode: {
            type: DataTypes.ENUM('MOCK', 'EXAM'),
            allowNull: false,
            defaultValue: 'EXAM',
        },
        tm_allow_to: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '0-all, 1-eng&gen, 2-med&gen',
        },
        is_test_loaded: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_student_added: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_uploaded: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_start_exam: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_absent_mark: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_exam_downloaded: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_photos_downloaded: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_sign_downloaded: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_final_published: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_students_downloaded: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_attendance_started: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: 'When 1 => started, 0 => stopped',
        },
        center_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'This is center code eg. (101, 102...)',
        },
        is_show_exam_sections: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment:
                'When value 1=> show sections in the examination, 0=> dont show sections in exam',
        },
    },
    {
        tableName: 'tm_publish_test_list',
        timestamps: true,
    }
);

export default tm_publish_test_list;
