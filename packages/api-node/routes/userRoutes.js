const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/me', userController.getCurrentUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

// api-node/routes/postRoutes.js
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/user/:userId', postController.getPostsByUserId);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;

// api-node/routes/likeRoutes.js
const likeController = require('../controllers/likeController');

router.get('/', likeController.getAllLikes);
router.get('/post/:postId', likeController.getLikesByPostId);
router.get('/user/:userId', likeController.getLikesByUserId);
router.post('/', likeController.addLike);
router.delete('/:id', likeController.removeLike);

module.exports = router;
