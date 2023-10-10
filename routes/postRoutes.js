const express = require('express');
const { createPost, getPost, deletePost, likeunlikePost, replyPost, feedPost, } = require('../controllers/postControllers');
const protectRoute = require('../middlewares/protectRoutes');

const router = express.Router();

router.get('/feed', protectRoute, feedPost);
router.post('/create', protectRoute, createPost);
router.get('/:id', getPost);
router.delete('/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likeunlikePost);
router.post('/reply/:id', protectRoute, replyPost);

module.exports = router;