import aouth from '../schemas/aouth.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';

const reportsModel = {
	getExamServerIP: async () => {
		return await aouth.findOne({
			attributes: ['exam_server_ip'],
			where: {
				id: 1,
			},
			raw: true,
		});
	},
	saveExamServerIP: async (ip) => {
		return await aouth.update({ exam_server_ip: ip }, { where: { id: 1 } });
	},

	getPublishedTests: async () => {
		return await tm_publish_test_list.findAll({ raw: true });
	},
};

export default reportsModel;
