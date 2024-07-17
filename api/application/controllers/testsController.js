import { myDate } from '../config/utils.js';
import testsModel from '../model/testsModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const testsController = {
	getList: async (req, res) => {
		try {
			let _testsList = await testsModel.getList();
			console.log(_testsList, '==_testsList==');
			return sendSuccess(res, _testsList);
		} catch (error) {
			return sendError(res, error.message);
		}
	},

	getPublishedList: async (req, res) => {
		try {
			let _testsListPublished = await testsModel.getPublishedList();
			console.log(_testsListPublished, '==_testsList==');
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
		console.log(req.body, 'createTest');
		let { test: _t, testQuestions: _q } = req.body;
		try {
			let _createTestRes = await testsModel.createTest(_t, _q);
			console.log(_createTestRes);
			if (_createTestRes) {
				return sendSuccess(res, 'Successfully created test');
			}
		} catch (error) {
			console.log(error);
			return sendError(res, error.message);
		}
	},

	createTestAuto: async (req, res) => {
		try {
			let { test: _t, topicList: _top } = req.body;
			if (!_t) {
				throw new Error('Invalid test details');
			}

			if (!_top) {
				throw new Error('Invalid topic list');
			}

			let _masterTest = await testsModel.createMasterTest(_t, _top);
			const { id: masterTestId } = _masterTest.toJSON();
			if (!masterTestId) {
				throw new Error('Unable to create master test');
			}

			let subjectId = [];
			let topicId = [];
			let limit = [];

			_top.forEach((el) => {
				subjectId.push(el.subject_id);
				topicId.push(el.id);
				limit.push(el.selectedCount);
			});

			let ALLDATA = [];

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
			}

			await fetchData(0);

			let _saveQuesRes = await testsModel.saveExamQuestions(
				ALLDATA,
				masterTestId,
				_t
			);

			return sendSuccess(res, 'Successfully created auto test');
		} catch (error) {
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
			console.log(_checkRes, '==_checkRes==');
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
			// let {
			// 	test_id_for_publish,
			// 	batch,
			// 	publish_date,
			// 	test_key,
			// 	test_details: mt,
			// } = req.body;

			let _publishTestInsert = await testsModel.publishTest(req.body);
			console.log(_publishTestInsert.toJSON(), '-------');
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
			console.log(_publishTestDelete, '-------');
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
			console.log(_updateRes, '==_updateRes==');

			return sendSuccess(res, 'Successfully updated question');
		} catch (error) {
			return sendError(res, error.message);
		}
	},
};

export default testsController;

// {
//   test: {
//     test_name: 'Omkar Test',
//     test_duration: '10',
//     marks_per_question: '1',
//     total_questions: null,
//     is_negative_marking: '1',
//     negative_mark: '1',
//     test_passing_mark: ' 2',
//     test_creation_type: 'Auto'
//   },
//   topicList: [
//     {
//       id: 1,
//       topic_name: 'Topic',
//       subject_id: 1,
//       question_count: 2,
//       selectedCount: '2'
//     },
//     {
//       id: 2,
//       topic_name: 'topic 2',
//       subject_id: 2,
//       question_count: 1,
//       selectedCount: '1'
//     }
//   ]
// }
