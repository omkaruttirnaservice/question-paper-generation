import express from 'express';
import questionController from '../application/controllers/questionController.js';

const router = express.Router();

router.post('/add-question', questionController.addNewQuestion);

router.post('/list', questionController.getQuestionList);
router.post('/list-trash', questionController.getQuestionListTrash);

router.get('/get-question-number', questionController.getQuestionNumber);

router.delete('/delete', questionController.deleteQuestion);
router.delete('/delete-permenant', questionController.deleteQuestionPermenant);
router.delete('/restore', questionController.restoreQuestion);

router.put('/update-question', questionController.saveEditQuestion);

// getting edit question data
router.post('/edit-question-data', questionController.editQuestionData);

router.get('/publications-list', questionController.getPublicationList);

router.post('/books-list', questionController.getBooksList);

export default router;
