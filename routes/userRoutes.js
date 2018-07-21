const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const linkChecks = require('../middlewares/linkChecks');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.get('/:userId/links', 
  linkChecks.isUserExists,
  linkController.getUserAllLinks
);
router.get('/:userId/links/:linkId',
  linkChecks.isUserExists,
  linkController.getUserLinkById
);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:userId/links', 
  linkChecks.isUserIdMatch,
  linkChecks.isUserExists, 
  linkChecks.topicCheck,
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
  linkChecks.isUserExists,
  linkController.deleteLink
);

module.exports = router;