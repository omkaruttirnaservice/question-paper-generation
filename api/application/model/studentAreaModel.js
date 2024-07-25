import { Sequelize } from 'sequelize';
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
	saveAllStudentsList: (_data, transact) => {
		try {
			return tn_student_list.bulkCreate(_data, { transaction: transact });
		} catch (error) {
			throw new ApiError(500, error?.message || 'Something went wrong');
		}
	},
	getAllStudentsList_2: () => {
		try {
			return tn_student_list.findAll(
				{
					attributes: [
						'id',
						'sl_f_name',
						'sl_m_name',
						'sl_l_name',
						'sl_image',
						'sl_sign',
						'sl_email',
						'sl_father_name',
						'sl_mother_name',
						'sl_address',
						'sl_mobile_number_parents',
						'sl_tenth_marks',
						'sl_contact_number',
						'sl_class',
						'sl_roll_number',
						'sl_subject',
						'sl_stream',
						'sl_addmit_type',
						'sl_time',
						'sl_date',
						'sl_time_stamp',
						'sl_added_by_login_id',
						'sl_is_live',
						[Sequelize.fn('DATE_FORMAT', Sequelize.col('sl_date_of_birth'), '%d-%m-%Y'), 'sl_date_of_birth'],
						'sl_school_name',
						'sl_catagory',
						'sl_application_number',
						'sl_is_physical_handicap',
						'sl_is_physical_handicap_desc',
						'sl_post',
						'sl_center_code',
						'sl_batch_no',
						'sl_exam_date',
						'sl_password',
					],
				},
				{ raw: true }
			);
		} catch (error) {
			throw new ApiError(500, error?.message || 'Something went wrong');
		}
	},
};

export default studentAreaModel;
