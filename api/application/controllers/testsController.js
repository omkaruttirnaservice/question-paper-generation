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

	createTest: async (req, res) => {
		console.log(req.body, 'createTest');
		let { test: _t, testQuestions: _q, _formData: _fd } = req.body;
		try {
			let _createTestRes = await testsModel.createTest(_t, _q, _fd);
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
