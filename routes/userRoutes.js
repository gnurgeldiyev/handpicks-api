const router = require('express').Router();
const userController = require('../controllers/userController');
const linkController = require('../controllers/linkController');
const linkChecks = require('../middlewares/linkChecks');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);
router.post('/:id/links', 
  linkChecks.ownerCheck, 
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

module.exports = router;