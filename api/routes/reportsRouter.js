import { Router } from 'express';
import reportsController from '../application/controllers/ReportsControllers/ReportsController.js';

const reportsRouter = Router();

reportsRouter.get('/get-exam-server-ip', reportsController.getExamServerIP);
reportsRouter.post('/set-exam-server-ip', reportsController.setExamServerIP);

reportsRouter.get('/get-published-tests', reportsController.getPublishedTests);

reportsRouter.post('/generate-result', reportsController.generateResult);

reportsRouter.post('/get-result-view-data', reportsController.getResultViewData);

// get-exam-dates-list
reportsRouter.get(
	'/get-exam-dates-list',
	reportsController.getExamDatesList
);

reportsRouter.get(
	'/get-result-batches-list',
	reportsController.getResultBatchesList
);

reportsRouter.post('/get-result-excel', reportsController.getResultExcel);
reportsRouter.post('/get-custom-result-excel', reportsController.getCustomResultExcel);

export default reportsRouter;
