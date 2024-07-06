import { BIGINT, DATEONLY } from 'sequelize';
import sequelize from '../config/db-connect-migration';

const sample = sequelize.define('sample', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	ub_otp: {
		type: BIGINT,
	},
});

export default sample;
