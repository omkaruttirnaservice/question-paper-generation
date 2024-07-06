import { BIGINT, STRING, DATEONLY } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import subject from './subject.js';

const topic = sequelize.define('topic', {
	id: {
		type: BIGINT,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	subject_id: {
		type: BIGINT,
		allowNull: false,
	},
	topic_name: {
		type: STRING(255),
		allowNull: false,
	},
});

export default topic;
