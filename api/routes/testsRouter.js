import testsController from '../application/controllers/testsController.js';

import express from 'express';
let testsRouter = express.Router();

testsRouter.get('/list', testsController.getList);
testsRouter.get('/list-published', testsController.getPublishedList);

//  create new test
testsRouter.post('/create', testsController.createTest);

// create new auto test
testsRouter.post('/v1/create-auto', testsController.createTestAutoV1);
testsRouter.post('/v2/create-auto', testsController.createTestAutoV2);

testsRouter.delete('/delete', testsController.deleteTest);

// test keys
testsRouter.post('/check-for-duplicate-test-key', testsController.checkForDuplicateTestKey);

// publish the exam
testsRouter.post('/publish', testsController.publishTest);
testsRouter.delete('/unpublish', testsController.unpublishTest);

// getting test questions list
testsRouter.post('/questions', testsController.getTestQuestionsList);

// update test question
testsRouter.put('/update-test-question', testsController.updateTestQuestion);

// mock exam
testsRouter.post('/create-mock', testsController.createMock);

// save mock report This report will be push from exam panel
testsRouter.post('/upload-mock-report', testsController.saveMockReport)
testsRouter.get('/mock-test-report', testsController.getMockTestReport)



export default testsRouter;
