import { Sequelize } from 'sequelize';
import aouth from '../schemas/aouth.js';
import tn_student_list from '../schemas/tn_student_list.js';
import ApiError from '../utils/ApiError.js';
import tn_center_list from '../schemas/tn_center_list.js';
import tm_server_ip_list from '../schemas/tm_server_ip_list.js';
import tm_student_question_paper from '../schemas/tm_student_question_paper.js';

const studentAreaModel = {
	getServerIP: async () => {
		return tm_server_ip_list.findAll({ raw: true });
	},
	addFormFillingIP: ({ form_filling_server_ip, exam_panel_server_ip }) => {
		return tm_server_ip_list.create({
			form_filling_server_ip,
			exam_panel_server_ip,
		});
	},
	updateFormFillingIP: (
		{ form_filling_server_ip, exam_panel_server_ip },
		id
	) => {
		return tm_server_ip_list.update(
			{
				form_filling_server_ip,
				exam_panel_server_ip,
			},
			{
				where: {
					id: id,
				},
			}
		);
	},

	deleteFormFillingIP: (id) => {
		return tm_server_ip_list.destroy({
			where: {
				id: id,
			},
		});
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
						[
							Sequelize.fn(
								'DATE_FORMAT',
								Sequelize.col('sl_date_of_birth'),
								'%d-%m-%Y'
							),
							'sl_date_of_birth',
						],
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

	getStudentsListByFilter: async (data) => {
		try {
			let _result = await tn_student_list.findAll({
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
					[
						Sequelize.fn(
							'DATE_FORMAT',
							Sequelize.col('sl_date_of_birth'),
							'%d-%m-%Y'
						),
						'sl_date_of_birth',
					],
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
				where: {
					sl_center_code: data.centerNumber,
					sl_batch_no: data.batchNumber,
					sl_exam_date: data.date,
				},
				raw: true,
			});
			return _result;
		} catch (error) {
			console.log(error, '==error==');
			throw new ApiError(500, error || 'Something went wrong');
		}
	},

	deleteCentersListOld: () => {
		try {
			return tn_center_list.destroy({
				truncate: true,
			});
		} catch (error) {
			throw new ApiError(500, error || 'Something went wrong');
		}
	},

	saveCentersList: (centersList) => {
		try {
			return tn_center_list.bulkCreate(centersList);
		} catch (error) {
			throw new ApiError(500, error?.message || 'Something went wrong');
		}
	},

	getCentersList: async () => {
		try {
			const result = await tn_center_list.findAll({
				group: ['cl_number'],
				raw: true,
			});
			return result;
		} catch (error) {
			throw new ApiError(500, error.message);
		}
	},

	getBatchList: async () => {
		try {
			const results = await tn_student_list.findAll({
				attributes: ['sl_batch_no'],
				group: ['sl_batch_no'],
				order: [['sl_batch_no', 'ASC']],
				raw: true,
			});

			return results;
		} catch (error) {
			throw new ApiError(500, error.message);
		}
	},
	getPostsList: async () => {
		try {
			const _results = await tn_student_list.findAll({
				attributes: ['sl_post'],
				group: ['sl_post'],
				raw: true,
			});
			return _results;
		} catch (error) {
			throw new ApiError(500, error.message);
		}
	},

	// save downlaoded students question paper from exam panel
	saveStudentQuestionPaper: async (questionPapers) => {
		try {
			const result = tm_student_question_paper.bulkCreate(questionPapers);
			return [null, result];
		} catch (error) {
			return [error, null];
		}
	},
};

export default studentAreaModel;
