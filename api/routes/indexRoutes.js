import express from 'express';

import postsRoutes from './postsRoutes.js';
import questionRoutes from './questionRoutes.js';
import studentsAreaRouter from './studentsAreaRouter.js';
import subjectRoutes from './subjectRoutes.js';
import testsRouter from './testsRouter.js';
import reportsRouter from './reportsRouter.js';
import saveExamsRouter from './saveExamsRouter.js';
import remoteRouter from './remoteRouter.js';
const router = express.Router();

router.use('/', subjectRoutes);
router.use('/questions', questionRoutes);
router.use('/test', testsRouter);

router.use('/posts', postsRoutes);

router.use('/students-area', studentsAreaRouter);
router.use('/reports', reportsRouter);
router.use('/exams', saveExamsRouter);

router.use('/remote', remoteRouter);

export default router;
