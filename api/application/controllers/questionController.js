import questionModel from '../model/questionModel.js';
import customValidate from '../utils/customValidate.js';

const { isNonEmptyNullString, isNumber } = customValidate;
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const questionController = {
	addNewQuestion: async (req, res) => {
		try {
			let response = await questionModel.addNewQuestion(req.body);
			if (response[0].affectedRows === 0)
				throw new Error('Question was not saved');
			return sendSuccess(res);
		} catch (err) {
			return sendError(res, err);
		}
	},

	restoreQuestion: async (req, res) => {
		try {
			const { questionId } = req.body;
			if (!questionId) {
				throw new Error(
					'Invalid questionID for restoration, please send valid id'
				);
			}
			let _deleteResponse = await questionModel.restoreQuestion(questionId);
			if (_deleteResponse[0].affectedRows == 1) {
				return sendSuccess(res, 'Successfully restored');
			} else {
				throw new Error(`Unable to restore questionID: ${questionId}`);
			}
		} catch (err) {
			sendError(res, err);
		}
	},

	deleteQuestion: async (req, res) => {
		try {
			const { questionId } = req.body;
			if (!questionId) {
				throw new Error(
					'Invalid questionID for deletion, please send valid id'
				);
			}
			let _deleteResponse = await questionModel.deleteQuestion(questionId);
			if (_deleteResponse[0].affectedRows == 1) {
				return sendSuccess(res, 'Successfully deleted');
			} else {
				throw new Error(`Unable to delte questionID: ${questionId}`);
			}
		} catch (err) {
			sendError(res, err);
		}
	},

	deleteQuestionPermenant: async (req, res) => {
		try {
			const { questionId } = req.body;
			if (!questionId) {
				throw new Error(
					'Invalid questionID for deletion, please send valid id'
				);
			}
			let _deleteResponse = await questionModel.deleteQuestionPermenant(
				questionId
			);
			console.log(_deleteResponse, '-after permenet delete');
			if (_deleteResponse[0].affectedRows == 1) {
				return sendSuccess(res, 'Successfully deleted');
			} else {
				throw new Error(`Unable to delte questionID: ${questionId}`);
			}
		} catch (err) {
			sendError(res, err);
		}
	},

	saveEditQuestion: async (req, res) => {
		try {
			console.log(req.body, '==req.body edit question controller==');

			let _editRes = await questionModel.saveEditQuestion(req.body);
			return sendSuccess(res, _editRes);
		} catch (error) {
			return sendError(res, error);
		}
	},

	editQuestionData: async (req, res) => {
		try {
			let qId = req.body.questionId;
			console.log(qId, 'gettting data');
			if (!qId) throw new Error('No question id sent');
			let _data = await questionModel.getEditQuestionData(qId);
			return sendSuccess(res, _data[0]);
		} catch (error) {
			return sendError(res, error);
		}
	},

	getQuestionNumber: async (req, res) => {
		try {
			let response = await questionModel.getQuestionNumber();
			if (response[0].length !== 0) {
				return sendSuccess(res, response[0][0]);
			}
		} catch (err) {
			return sendError(res, err);
		}
	},

	getQuestionList: async (req, res) => {
		try {
			const { post_id, subject_id, topic_id } = req.body;
			const questionList = await questionModel.getQuestionList({
				post_id,
				subject_id,
				topic_id,
			});
			return sendSuccess(res, questionList[0]);
		} catch (err) {
			console.log('Error whlie fetching the questions: ', err);
			return sendError(res, err);
		}
	},

	getQuestionListTrash: async (req, res) => {
		try {
			const { post_id, subject_id, topic_id } = req.body;
			const questionList = await questionModel.getQuestionListTrash({
				post_id,
				subject_id,
				topic_id,
			});
			return sendSuccess(res, questionList[0]);
		} catch (err) {
			console.log('Error whlie fetching the questions: ', err);
			return sendError(res, err);
		}
	},

	// publication list

	getPublicationList: async (req, res) => {
		try {
			let [publicationsList] = await questionModel.getPublicationList();
			return sendSuccess(res, publicationsList);
		} catch (error) {
			return sendError(res, err);
		}
	},

	getBooksList: async (req, res) => {
		try {
			let { pubName } = req.body;
			let [booksList] = await questionModel.getBooksList(pubName);
			return sendSuccess(res, booksList);
		} catch (error) {
			console.log(error, '-error');
			return sendError(res, err);
		}
	},
};

export default questionController;
