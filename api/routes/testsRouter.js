import testsController from '../application/controllers/testsController.js';

import express from 'express';
let testsRouter = express.Router();

testsRouter.get('/list', testsController.getList);
testsRouter.get('/list-published', testsController.getPublishedList);
testsRouter.post('/create', testsController.createTest);
testsRouter.post('/create-auto', testsController.createTestAuto);
testsRouter.delete('/delete', testsController.deleteTest);

// test keys
testsRouter.post(
	'/check-for-duplicate-test-key',
	testsController.checkForDuplicateTestKey
);

// publish the exam
testsRouter.post('/publish', testsController.publishTest);
testsRouter.delete('/unpublish', testsController.unpublishTest);

// getting test questions list
testsRouter.post('/questions', testsController.getTestQuestionsList);

export default testsRouter;
