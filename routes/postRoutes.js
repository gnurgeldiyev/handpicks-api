const router = require('express').Router();
const postController = require('../controllers/postController');
const { isTopicUrlExistsForParams, isPostExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/', 
  postController.getPostsByQuery
);
router.get('/:postId', 
  postController.getPostById
);
router.get('/topics/:topicUrl', 
  isTopicUrlExistsForParams,
  postController.getTopicAllPosts
);
router.get('/topics/:topicUrl/upcoming',
  isTopicUrlExistsForParams,
  postController.getTopicUpcomingPosts
);
/**
 * POST requests
*/
router.post('/', 
  isAuthenticatedManager,
  postController.addNewPost
);
/**
 * PUT requests
*/
router.put('/:postId',
  isAuthenticatedManager,
  isPostExistsForParams,
  postController.updatePost
);
/**
 * DELETE requests
*/
router.delete('/:postId',
  isAuthenticatedManager,
  isPostExistsForParams,
  postController.deletePost
);  
module.exports = router;