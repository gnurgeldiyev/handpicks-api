const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const { isUserExistsForParams, isTopicExistsForParams, isTopicExistsForBody } = require('../middlewares/commonChecks');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:userId', 
  isUserExistsForParams,
  userController.getUserById
);
router.get('/:userId/links', 
  isUserExistsForParams,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  isUserExistsForParams,
  linkController.getUserLinkById
);
router.get('/:userId/links/topics/:topicId',
  isUserExistsForParams,
  isTopicExistsForParams,
  linkController.getUserLinksByTopic
);
router.get('/:userId/topics/:topicId',
  isUserExistsForParams,
  isTopicExistsForParams,
  userController.topicFollowUnfollow  
);
router.get('/:userId/posts',
  isUserExistsForParams,
  userController.getUserPosts
);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:userId/logout',
  isUserExistsForParams,
  userController.userLogout
);
router.post('/:userId/links', 
  isUserExistsForParams, 
  isTopicExistsForBody,
  linkController.addNewLink
);

/**
 * PUT requests
*/
router.put('/:userId', 
  isUserExistsForParams,
  userController.updateUser
);

/**
 * DELETE requests
*/
router.delete('/:userId', 
  isUserExistsForParams,
  userController.deleteUser
);
router.delete('/:userId/links/:linkId',
  isUserExistsForParams,
  linkController.deleteLink
);

module.exports = router;