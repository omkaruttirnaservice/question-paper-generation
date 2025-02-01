import { BIGINT, DATE, INTEGER, Sequelize, STRING } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import tm_publish_test_list from './tm_publish_test_list.js';

const tm_publish_test_by_post = sequelize.define('tm_publish_test_by_post', {
	id: {
		type: INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},

	post_id: {
		type: INTEGER,
		allowNull: false,
		comment: 'This is post id for which test is published',
	},

	post_name: {
		type: STRING(255),
		allowNull: false,
		comment: 'This is the post name.',
	},

	published_test_id: {
		type: BIGINT,
		allowNull: false,
		comment: 'This is published test id.',
	},

	createdAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
	updatedAt: {
		type: DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
});




export default tm_publish_test_by_post;
