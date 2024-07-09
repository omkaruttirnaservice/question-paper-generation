import testsController from '../application/controllers/testsController.js';

import express from 'express';
let testsRouter = express.Router();

testsRouter.post('/create', testsController.createTest);

export default testsRouter;
