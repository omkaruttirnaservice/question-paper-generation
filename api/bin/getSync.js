import sequelize from '../application/config/db-connect-migration.js';
import tm_master_test_list from '../application/Migration_Scripts/tm_master_test_list.js';
import tm_mega_question_set from '../application/Migration_Scripts/tm_mega_question_set.js';
import tm_main_topic_list from '../application/Migration_Scripts/tm_main_topic_list.js';
import tm_sub_topic_list from '../application/Migration_Scripts/tm_sub_topic_list.js';

import tm_test_user_master_list from '../application/Migration_Scripts/tm_test_user_master_list.js';
import tm_test_question_sets from '../application/Migration_Scripts/tm_test_question_sets.js';

import tm_publish_test_list from '../application/Migration_Scripts/tm_publish_test_list.js';

import tm_exam_to_question from '../application/Migration_Scripts/tm_exam_to_question.js';

tm_master_test_list.hasMany(tm_main_topic_list, {
	foreignKey: 'mtl_master_test_list_id',
});

tm_main_topic_list.belongsTo(tm_master_test_list, {
	foreignKey: 'mtl_master_test_list_id',
});

tm_main_topic_list.hasMany(tm_sub_topic_list, {
	foreignKey: 'stl_main_topic_list_id',
});

tm_sub_topic_list.belongsTo(tm_main_topic_list, {
	foreignKey: 'stl_main_topic_list_id',
});

const getSync = () => {
	sequelize
		.sync({ alter: true })
		.then(() => {
			console.log(
				'"\x1b[47m", \x1b[30m%s\x1b[0m',
				'Database has been migrated successfully, you can now start the server.'
			);
		})
		.catch((error) => console.log(error));
};

export default getSync;
