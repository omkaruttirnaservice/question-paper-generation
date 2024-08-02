import { Router } from 'express';
import remoteController from '../application/controllers/RemoteController/RemoteController.js';
const remoteRouter = Router();

remoteRouter.post('/getNewExamList', remoteController.getTodaysExamList);
remoteRouter.get('/DownloadExam/:id', remoteController.downloadExam);

export default remoteRouter;
