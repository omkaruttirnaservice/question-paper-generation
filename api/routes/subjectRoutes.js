import express from 'express';
import subjectController from '../application/controllers/subjectController.js';
const router = express.Router();

router.post('/get-subject-list', subjectController.getSubjectList);
router.post('/add-subject', subjectController.addSubject);

router.post('/get-topic-list', subjectController.getTopicList);
router.post('/add-topic', subjectController.addTopic);

export default router;
