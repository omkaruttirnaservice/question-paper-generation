import remoteModel from '../../model/remoteModel.js';
import tm_publish_test_list from '../../schemas/tm_publish_test_list.js';
import tm_test_question_sets from '../../schemas/tm_test_question_sets.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const remoteController = {
	getTodaysExamList: asyncHandler(async (req, res) => {
		let _examsList = await remoteModel.getTodaysExamList(req.body);

		if (_examsList.length == 0) throw new ApiError(200, 'No exams list found');

		return res.status(200).json(new ApiResponse(200, _examsList));
	}),
	downloadExam: asyncHandler(async (req, res) => {
		const { id } = req.params;

		// gettting test information
		const exam_info = await tm_publish_test_list.findAll({
			where: {
				id: +id,
			},
			raw: true,
		});
		if (exam_info.length == 0) {
			return res.status(404).json({
				call: 2,
			});
		}

		const ptl_test_id = exam_info[0].ptl_test_id;

		// getting question paper
		let question_paper = await tm_test_question_sets.findAll({
			where: {
				tqs_test_id: ptl_test_id,
			},
			raw: true,
		});

		if (question_paper.length == 0) {
			return res.status(404).json({
				call: 3,
			});
		}

		return res.status(200).json({
			call: 1,
			exam_info: exam_info,
			exam_question: question_paper,
		});

		// let _examsList = await remoteModel.getTodaysExamList(req.body);

		// return res.status(200).json(new ApiResponse(200, _examsList));
	}),
};
export default remoteController;
