const router = require('express').Router();
const postController = require('../controllers/postController');
const { isTopicExistsForParams, isPostExistsForParams } = require('../middlewares/commonChecks');

/**
 * GET requests
*/
router.get('/', postController.getPostsByQuery);
router.get('/:postId', postController.getPostById);
router.get('/topics/:topicId', 
  isTopicExistsForParams,
  postController.getTopicAllPosts
);

/**
 * POST requests
*/
router.post('/', postController.addNewPost);

/**
 * PUT requests
*/
router.put('/:postId',
  isPostExistsForParams,
  postController.updatePost
);

/**
 * DELETE requests
*/
router.delete('/:postId', 
  isPostExistsForParams,
  postController.deletePost
);  

module.exports = router;