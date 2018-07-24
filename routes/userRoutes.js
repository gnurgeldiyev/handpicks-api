const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const commonChecks = require('../middlewares/commonChecks');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:userId', 
  commonChecks.isUserExistsForParams,
  userController.getUserById
);
router.get('/:userId/links', 
  commonChecks.isUserExistsForParams,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  commonChecks.isUserExistsForParams,
  linkController.getUserLinkById
);
router.get('/:userId/links/topics/:topicId',
  commonChecks.isUserExistsForParams,
  commonChecks.isTopicExistsForParams,
  linkController.getUserLinksByTopic
);
router.get('/:userId/topics/:topicId',
  commonChecks.isUserExistsForParams,
  commonChecks.isTopicExistsForParams,
  userController.topicFollowUnfollow  
);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:userId/links', 
  commonChecks.isUserExistsForParams, 
  commonChecks.isTopicExistsForBody,
  linkController.addNewLink
);

/**
 * PUT requests
*/
router.put('/:userId', 
  commonChecks.isUserExistsForParams,
  userController.updateUser
);

/**
 * DELETE requests
*/
// router.delete('/:id', userController.deleteUser);
router.delete('/:userId/links/:linkId',
  commonChecks.isUserExistsForParams,
  linkController.deleteLink
);

module.exports = router;