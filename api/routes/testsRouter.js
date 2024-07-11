import testsController from '../application/controllers/testsController.js';

import express from 'express';
let testsRouter = express.Router();

testsRouter.get('/list', testsController.getList);
testsRouter.post('/create', testsController.createTest);
testsRouter.post('/create-auto', testsController.createTestAuto);

export default testsRouter;
