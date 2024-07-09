import { myDate } from '../config/utils.js';
import testsModel from '../model/testsModel.js';

const testsController = {
	createTest: async (req, res) => {
		console.log(req.body, 'createTest');
		let { test: t, testQuestions } = req.body;
		try {
			let _createTestRes = await testsModel.createTest(t);
			console.log(_createTestRes);
		} catch (error) {
			console.log(error);
		}
		// let masterTestData = {
		// 	mt_name: t.test_name,
		// 	mt_added_date: myDate.getDate(),
		// 	mt_descp: 'TEST',
		// 	mt_added_time: myDate.getTime(),
		// 	mt_is_live: 1,
		// 	mt_time_stamp: myDate.getDateTime(),
		// 	mt_type: 1,
		// 	tm_aouth_id: 1,
		// 	mt_test_time: t.test_duration,
		// 	mt_total_test_takan: 0,
		// 	mt_is_negative: t.is_negative_marking,
		// 	mt_negativ_mark: 0,
		// 	mt_mark_per_question: t.marks_per_question,
		// 	mt_passing_out_of: t.test_passing_mark,
		// 	mt_total_marks: +t.total_questions * +t.marks_per_question,
		// 	mt_pattern_type: 1,
		// 	mt_total_test_question: +t.total_questions,
		// };
	},
};

export default testsController;
