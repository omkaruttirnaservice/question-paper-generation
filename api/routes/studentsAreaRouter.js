import express from 'express';
import StudentAreaController from '../application/controllers/StudentArea/studentAreaController.js';

const studentsAreaRouter = express.Router();
studentsAreaRouter.get('/get-server-ip', StudentAreaController.getServerIP);
studentsAreaRouter.post('/set-server-ip', StudentAreaController.saveFormFillingIP);

studentsAreaRouter.post('/all-list', StudentAreaController.getAllStudentsList_1); // this is to get list from form filling server
studentsAreaRouter.get('/all-list', StudentAreaController.getAllStudentsList_2); // this is to get list from local server
studentsAreaRouter.post('/all-list-filtered', StudentAreaController.getStudentsListByFilter); // this is to get filtered list from local server

// get centers list
studentsAreaRouter.post('/download-centers-list', StudentAreaController.downloadCentersList);

studentsAreaRouter.get('/get-center-and-batch-list', StudentAreaController.getCenterAndBatchList);

export default studentsAreaRouter;
