import { Router } from 'express';
import remoteController from '../application/controllers/remoteController/remoteController.js';
const remoteRouter = Router();

remoteRouter.post('/getNewExamList', remoteController.getTodaysExamList);
remoteRouter.post('/DownloadExam', remoteController.downloadExam);

export default remoteRouter;
