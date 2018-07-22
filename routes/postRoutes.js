const router = require('express').Router();
const postController = require('../controllers/postController');
const commonChecks = require('../middlewares/commonChecks');

/**
 * GET requests
*/
router.get('/', postController.getPostsByQuery);
router.get('/:postId', postController.getPostById);
router.get('/topics/:topicId', 
  commonChecks.isTopicExistsForParams,
  postController.getTopicAllPosts
);


/**
 * POST requests
*/
router.post('/', postController.addNewPost);


/**
 * PUT requests
*/


/**
 * DELETE requests
*/



module.exports = router;