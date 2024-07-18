import sequelize from '../config/db-connect-migration.js';
import { myDate } from '../config/utils.js';
import tm_mega_question_set from '../Migration_Scripts/tm_mega_question_set.js';
import tm_test_question_sets from '../Migration_Scripts/tm_test_question_sets.js';
import tm_test_user_master_list from '../Migration_Scripts/tm_test_user_master_list.js';
import testsModel from '../model/testsModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const testsController = {
	getList: async (req, res) => {
		try {
			let _testsList = await testsModel.getList();
			return sendSuccess(res, _testsList);
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	getPublishedList: async (req, res) => {
		try {
			let _testsListPublished = await testsModel.getPublishedList();
			return sendSuccess(res, _testsListPublished);
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	deleteTest: async (req, res) => {
		try {
			let { deleteId } = req.body;

			if (!deleteId) {
				throw new Error('Invalid delete id passed');
			}

			let _deleteRes = await testsModel.deleteTest(deleteId);
			return sendSuccess(res, _deleteRes);
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	createTest: async (req, res) => {
		let { test: _t, testQuestions: _q } = req.body;
		try {
			let _createTestRes = await testsModel.createTest(_t, _q);
			if (_createTestRes) {
				return sendSuccess(res, 'Successfully created test');
			}
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	createTestAutoV1: async (req, res) => {
		try {
			let { test: _t, topicList: _top } = req.body;
			if (!_t) throw new Error('Invalid test details');

			if (!_top) throw new Error('Invalid topic list');

			let _masterTest = await testsModel.createMasterTest(_t, _top);

			const { id: masterTestId } = _masterTest.toJSON();
			if (!masterTestId) throw new Error('Unable to create master test');

			let subjectId = [];
			let topicId = [];
			let limit = [];

			_top.forEach((el) => {
				subjectId.push(el.subject_id);
				topicId.push(el.id);
				limit.push(el.selectedCount);
			});

			let ALLDATA = [];
			let selectedQueId = [];

			async function fetchData(idx) {
				let [_randQues] = await testsModel.getRandQues(
					subjectId[idx],
					topicId[idx],
					limit[idx]
				);

				if (_randQues.length == 0) {
					throw new Error('No questions found to select automatically');
				}
				ALLDATA.push(..._randQues);

				if (idx + 1 < topicId.length) {
					await fetchData(idx + 1);
				}

				// adding id of selected question to update their selection status later on
				_randQues.forEach((el) => selectedQueId.push(el.q_id));
			}

			await fetchData(0);

			let _saveQuesRes = await testsModel.saveExamQuestions(
				ALLDATA,
				masterTestId,
				_t
			);

			// updating the question selection status to 1 to indidate that question is selected
			let _updateTestQuesSelectionStatusRes =
				await testsModel.updateTestQueSelectionStatus(selectedQueId);

			return sendSuccess(res, 'Successfully created auto test');
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	createTestAutoV2: async (req, res) => {
		let transact = await sequelize.transaction();
		try {
			let { test: _t, topicList: _top } = req.body;
			if (!_t) throw new Error('Invalid test details');

			if (!_top || _top.length == 0) throw new Error('Invalid topic list');

			// creating master test
			let _masterTest = await tm_test_user_master_list.create(
				{
					mt_name: _t.test_name,
					mt_added_date: myDate.getDate(),
					mt_descp: 'TEST',
					mt_added_time: myDate.getTime(),
					mt_is_live: 1,
					mt_time_stamp: myDate.getDateTime(),
					mt_type: 1,
					tm_aouth_id: 1,
					mt_test_time: _t.test_duration,
					mt_total_test_takan: 0,
					mt_is_negative: _t.is_negative_marking,
					mt_negativ_mark: 0,
					mt_mark_per_question: _t.marks_per_question,
					mt_passing_out_of: _t.test_passing_mark,
					mt_total_marks: +_t.total_questions * +_t.marks_per_question,
					mt_pattern_type: 1,
					mt_total_test_question: +_t.total_questions,
				},
				{
					transaction: transact,
				}
			);

			const { id: masterTestId } = _masterTest.toJSON();
			if (!masterTestId) throw new Error('Unable to create master test');

			let subjectId = [];
			let topicId = [];
			let limit = [];
			let ALLDATA = [];
			let selectedQueId = [];

			_top.forEach((el) => {
				subjectId.push(el.subject_id);
				topicId.push(el.id);
				limit.push(el.selectedCount);
			});

			async function fetchData(idx) {
				let [_randQues] = await testsModel.getRandQues(
					subjectId[idx],
					topicId[idx],
					limit[idx],
					transact
				);

				if (_randQues.length == 0) {
					throw new Error('No questions found to select automatically');
				}
				ALLDATA.push(..._randQues);

				if (idx + 1 < topicId.length) {
					await fetchData(idx + 1);
				}

				// adding id of selected question to update their selection status later on
				_randQues.forEach((el) => selectedQueId.push(el.q_id));
			}

			await fetchData(0);

			let questionsData = testsModel.getQuestionsDataToSave(
				ALLDATA,
				masterTestId,
				_t
			);
			console.log(questionsData, '==questionsData==');
			if (questionsData.length == 0)
				throw new Error('No questions found to save');

			let _saveQuesRes = await tm_test_question_sets.bulkCreate(questionsData, {
				transaction: transact,
			});

			console.log(_saveQuesRes, '==_saveQuesRes==');

			// updating the question selection status to 1 to indidate that question is selected
			let _updateTestQuesSelectionStatusRes = await tm_mega_question_set.update(
				{
					is_que_selected_previously: 1,
				},
				{
					where: {
						id: [...selectedQueId],
					},
				},
				{
					transaction: transact,
				}
			);

			await transact.commit();

			return sendSuccess(res, 'Successfully created auto test');
		} catch (error) {
			await transact.rollback();
			return sendError(res, error.message);
		}
	},

	// test keys
	checkForDuplicateTestKey: async (req, res) => {
		try {
			let { testKey } = req.body;

			if (!testKey) {
				throw new Error('No test key passed to check');
			}

			let _checkRes = await testsModel.checkForDuplicateTestKey(testKey);
			if (_checkRes.length === 1) {
				return res.status(200).json({
					_message: 'Test key already exsists',
					_success: 2,
				});
			} else {
				return res.status(200).json({
					_message: 'Unique key',
					_success: 1,
				});
			}
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	publishTest: async (req, res) => {
		try {
			let _publishTestInsert = await testsModel.publishTest(req.body);
			if (_publishTestInsert.toJSON().id) {
				return sendSuccess(res, {
					message: 'Successfully published test',
				});
			}
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	unpublishTest: async (req, res) => {
		try {
			let { id } = req.body;
			if (!id) {
				throw new Error('Invalid test id');
			}
			let _publishTestDelete = await testsModel.unpublishTest(id);
			if (_publishTestDelete == 1) {
				return sendSuccess(res, {
					message: 'Successfully un-published test',
				});
			}
		} catch (error) {
			return sendError(res, error.message);
		}
	},
	// getting test questions list
	getTestQuestionsList: async (req, res) => {
		try {
			const { testId } = req.body;
			let _testsList = await testsModel.getTestQuestionsList(testId);

			return sendSuccess(res, _testsList);
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	// update test question
	updateTestQuestion: async (req, res) => {
		try {
			let [_updateRes] = await testsModel.updateTestQuestion(req.body);

			return sendSuccess(res, 'Successfully updated question');
		} catch (error) {
			return sendError(res, error.message);
		}
	},
};

export default testsController;
