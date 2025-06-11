import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const mock_exam_report = sequelize.define(
    'mock_exam_report',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        stl_stud_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        stl_publish_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mac_id: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        stm_min: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        stm_sec: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
        stl_test_status: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        },
    },
    {
        tableName: 'mock_exam_report',
        timestamps: false,
    }
);

export default mock_exam_report;
