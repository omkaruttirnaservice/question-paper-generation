import express from 'express';

import questionRoutes from './questionRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import postsRoutes from './postsRoutes.js';
const router = express.Router();

router.use('/', subjectRoutes);
router.use('/questions', questionRoutes);

router.use('/posts', postsRoutes);

export default router;
