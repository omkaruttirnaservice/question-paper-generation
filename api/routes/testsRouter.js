import testsController from '../application/controllers/testsController.js';

import express from 'express';
let testsRouter = express.Router();

testsRouter.get('/list', testsController.getList);
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

export default testsRouter;
