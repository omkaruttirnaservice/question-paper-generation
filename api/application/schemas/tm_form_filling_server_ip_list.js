import { BIGINT, TEXT } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';

const tm_form_filling_server_ip_list = sequelize.define(
	'tm_form_filling_server_ip_list',
	{
		id: {
			type: BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		server_ip: {
			type: TEXT('long'),
			allowNull: false,
		},
	},
	{
		tableName: 'tm_form_filling_server_ip_list',
		timestamps: false,
	}
);

export default tm_form_filling_server_ip_list;
