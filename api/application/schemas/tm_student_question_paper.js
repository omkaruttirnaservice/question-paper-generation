import sequelize from '../config/db-connect-migration.js';
import { Sequelize } from 'sequelize';

const tm_student_question_paper = sequelize.define('tm_student_question_paper', {
	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},

	sqp_question_id: {
		type: Sequelize.INTEGER,
	},
	sqp_student_id: {
		type: Sequelize.INTEGER,
	},
	sqp_test_id: {
		type: Sequelize.INTEGER,
	},
	sqp_publish_id: {
		type: Sequelize.INTEGER,
	},
	sqp_is_remark: {
		type: Sequelize.INTEGER,
	},
	sqp_index_value: {
		type: Sequelize.INTEGER,
	},
	sqp_time: {
		type: Sequelize.STRING(255),
	},
	sqp_ans: {
		type: Sequelize.STRING(255),
	},
	added_time: {
		type: Sequelize.STRING(255),
	},
	sqp_min: {
		type: Sequelize.INTEGER,
	},
	sqp_sec: {
		type: Sequelize.INTEGER,
	},
});

export default tm_student_question_paper;
