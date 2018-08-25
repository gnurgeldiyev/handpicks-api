const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const { isUserExistsForParams, isTopicIdExistsForParams, isTopicExistsForBody } = require('../middlewares/commonChecks');
const { isAuthenticatedUser, isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/',
  isAuthenticatedManager,
  userController.getUserByQuery
);
router.get('/:userId',
  isAuthenticatedUser,
  isUserExistsForParams,
  userController.getUserById
);
router.get('/:userId/links',
  isAuthenticatedUser,
  isUserExistsForParams,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  isAuthenticatedUser,
  isUserExistsForParams,
  linkController.getUserLinkById
);
router.get('/:userId/links/topics/:topicId',
  isAuthenticatedUser,
  isUserExistsForParams,
  isTopicIdExistsForParams,
  linkController.getUserLinksByTopic
);
router.get('/:userId/topics/:topicId',
  isAuthenticatedUser,
  isUserExistsForParams,
  isTopicIdExistsForParams,
  userController.topicFollowUnfollow  
);
router.get('/:userId/posts',
  isAuthenticatedUser,
  isUserExistsForParams,
  userController.getUserPosts
);
/**
 * POST requests
*/
router.post('/', 
  userController.userSignIn
);
router.post('/:userId/logout',
  isAuthenticatedUser,
  isUserExistsForParams,
  userController.userLogout
);
router.post('/:userId/links',
  isAuthenticatedUser, 
  isUserExistsForParams, 
  isTopicExistsForBody,
  linkController.addNewLink
);
/**
 * PUT requests
*/
router.put('/:userId', 
  isAuthenticatedUser,
  isUserExistsForParams,
  userController.updateUser
);
/**
 * DELETE requests
*/
router.delete('/:userId', 
  isAuthenticatedUser,
  isUserExistsForParams,
  userController.deleteUser
);
router.delete('/:userId/links/:linkId',
  isAuthenticatedUser,
  isUserExistsForParams,
  linkController.deleteLink
);
module.exports = router;