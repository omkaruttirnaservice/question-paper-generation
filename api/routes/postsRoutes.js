import express from 'express';
import postController from '../application/controllers/postController.js';

const router = express.Router();

router.get('/list', postController.getPostList);

router.post('/add', postController.addPost);

export default router;
