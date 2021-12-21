
import express from 'express';

const router = express.Router();

import {
    getSinglePost,getPost,createPost,updatePost, deletePost, likePost,getPostsBySearch, commentPost
} from '../controllers/posts.js'
import auth from '../middleware/auth.js'

router.get("/search", getPostsBySearch);
router.get('/', getPost)
router.get("/:id", getSinglePost);
router.post('/',auth, createPost)
router.patch('/:id',auth,updatePost)
router.delete('/:id',auth, deletePost)
router.patch('/:id/likePost',auth, likePost)
router.post("/:id/commentPost", auth, commentPost);

export default router
