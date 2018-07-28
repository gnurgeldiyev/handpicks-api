const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const { isUserExistsForParams, isTopicExistsForParams, isTopicExistsForBody } = require('../middlewares/commonChecks');
const auth = require('../middlewares/auth');

/**
 * GET requests
*/
router.get('/:userId',
  isUserExistsForParams,
  userController.getUserById
);
router.get('/:userId/links',
  auth.isAuthenticated,
  isUserExistsForParams,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  auth.isAuthenticated,
  isUserExistsForParams,
  linkController.getUserLinkById
);
router.get('/:userId/links/topics/:topicId',
  auth.isAuthenticated,
  isUserExistsForParams,
  isTopicExistsForParams,
  linkController.getUserLinksByTopic
);
router.get('/:userId/topics/:topicId',
  auth.isAuthenticated,
  isUserExistsForParams,
  isTopicExistsForParams,
  userController.topicFollowUnfollow  
);
router.get('/:userId/posts',
  auth.isAuthenticated,
  isUserExistsForParams,
  userController.getUserPosts
);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:userId/logout',
  auth.isAuthenticated,
  isUserExistsForParams,
  userController.userLogout
);
router.post('/:userId/links',
  auth.isAuthenticated, 
  isUserExistsForParams, 
  isTopicExistsForBody,
  linkController.addNewLink
);

/**
 * PUT requests
*/
router.put('/:userId', 
  auth.isAuthenticated,
  isUserExistsForParams,
  userController.updateUser
);

/**
 * DELETE requests
*/
router.delete('/:userId', 
  auth.isAuthenticated,
  isUserExistsForParams,
  userController.deleteUser
);
router.delete('/:userId/links/:linkId',
  auth.isAuthenticated,
  isUserExistsForParams,
  linkController.deleteLink
);

module.exports = router;