const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const commonChecks = require('../middlewares/commonChecks');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:userId', 
  commonChecks.isUserExists,
  userController.getUserById
);
router.get('/:userId/links', 
  commonChecks.isUserExists,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  commonChecks.isUserExists,
  linkController.getUserLinkById
);
router.get('/:userId/links/topics/:topicId',
  commonChecks.isUserExists,
  commonChecks.isTopicExistsForParams,
  linkController.getUserLinksByTopic
);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:userId/links', 
  commonChecks.isUserExists, 
  commonChecks.isTopicExistsForBody,
  linkController.addNewLink
);

/**
 * PUT requests
*/
// router.put('/:id', userController.updateUser);

/**
 * DELETE requests
*/
// router.delete('/:id', userController.deleteUser);
router.delete('/:userId/links/:linkId',
  commonChecks.isUserExists,
  linkController.deleteLink
);

module.exports = router;