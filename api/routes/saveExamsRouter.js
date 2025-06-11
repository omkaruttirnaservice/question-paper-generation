import { Router } from 'express';
import reportsController from '../application/controllers/ReportsControllers/ReportsController.js';
import saveExamsController from '../application/controllers/saveExamsController/saveExamsController.js';

const saveExamsRouter = Router();

saveExamsRouter.post('/saveUploadedExam', saveExamsController.saveExamData);

saveExamsRouter.get('/single-candidate-paper', saveExamsController.getCandiateExamPaperInfo);

export default saveExamsRouter;
