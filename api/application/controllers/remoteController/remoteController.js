import { Sequelize } from 'sequelize';
import remoteModel from '../../model/remoteModel.js';
import tm_publish_test_by_post from '../../schemas/tm_publish_test_by_post.js';
import tm_publish_test_list from '../../schemas/tm_publish_test_list.js';
import tm_test_question_sets from '../../schemas/tm_test_question_sets.js';
import tn_student_list from '../../schemas/tn_student_list.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const remoteController = {
    getTodaysExamList: asyncHandler(async (req, res) => {
        console.log(req.body, '==req.body==');

        /**
		 * 
		 * {
				downloadedExamsId: [ '1,2' ],
				exam_mode: 'MOCK',
				center_code: '101'
			}
		 * 
		 */

        const data = req.body;
        console.log(data, '=data');
        let _examsList = await remoteModel.getTodaysExamList(data);
        console.log(_examsList, '==_examsList==');

        if (_examsList.length == 0)
            throw new ApiError(400, 'No exams list found', 'No new exams list found in qp-gen');

        return res.status(200).json(new ApiResponse(200, _examsList));
    }),

    downloadExam: asyncHandler(async (req, res) => {
        const { center_code, published_test_id, exam_mode } = req.body;

        if (!center_code) throw new ApiError(400, 'Center Code required');
        if (!published_test_id) throw new ApiError(400, 'Exam id required');

        // gettting test information
        const exam_info = await tm_publish_test_list.findAll({
            where: {
                id: Number(published_test_id),
            },
            raw: true,
        });

        if (exam_info.length == 0) {
            return res.status(404).json({
                call: 2,
            });
        }

        const ptl_test_id = exam_info[0].ptl_test_id;

        // get post list for the published test
        const _postsList = await tm_publish_test_by_post.findAll({
            where: {
                published_test_id,
            },
            raw: true,
        });

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

        let studentsList = [];

        if (exam_mode === 'MOCK') {
            // get students list as well if its mock test
            const _mockStudents = await remoteModel.getMockStudensList(
                center_code,
                published_test_id
            );
            studentsList = _mockStudents;
        }

        return res.status(200).json({
            call: 1,
            exam_info: exam_info,
            exam_question: question_paper,
            _postsList: _postsList,
            studentsList,
        });

        // let _examsList = await remoteModel.getTodaysExamList(req.body);

        // return res.status(200).json(new ApiResponse(200, _examsList));
    }),
};
export default remoteController;
