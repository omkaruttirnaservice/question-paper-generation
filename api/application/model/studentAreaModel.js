import aouth from '../schemas/aouth.js';

const studentAreaModel = {
	getServerIP: async () => {
		return aouth.findAll({ raw: true });
	},
	addFormFillingIP: (ip) => {
		return aouth.update({ a_form_filling_ip: ip }, { where: { id: 1 } });
	},
};

export default studentAreaModel;
