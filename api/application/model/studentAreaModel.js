import aouth from '../schemas/aouth.js';
import tn_student_list from '../schemas/tn_student_list.js';
import ApiError from '../utils/ApiError.js';

const studentAreaModel = {
	getServerIP: async () => {
		return aouth.findAll({ raw: true });
	},
	addFormFillingIP: (ip) => {
		return aouth.update({ a_form_filling_ip: ip }, { where: { id: 1 } });
	},
	saveAllStudentsList: (_data) => {
		try {
			return tn_student_list.bulkCreate(_data);
		} catch (error) {
			throw new ApiError(500, error.message || 'Something went wrong');
		}
	},
};

export default studentAreaModel;
