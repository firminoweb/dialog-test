const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.get('/', likeController.getAllLikes);
router.get('/post/:postId', likeController.getLikesByPostId);
router.get('/user/:userId', likeController.getLikesByUserId);
router.post('/', likeController.addLike);
router.delete('/:id', likeController.removeLike);

module.exports = router;
