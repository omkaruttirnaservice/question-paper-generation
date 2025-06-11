import { BIGINT, TEXT } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_server_ip_list = sequelize.define(
	'tm_server_ip_list',
	{
		id: {
			type: BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		form_filling_server_ip: {
			type: TEXT('long'),
			allowNull: false,
		},

		exam_panel_server_ip: {
			type: TEXT('long'),
			allowNull: false,
		},
	},
	{
		tableName: 'tm_server_ip_list',
		timestamps: false,
	}
);

export default tm_server_ip_list;
