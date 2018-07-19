const router = require('express').Router();
const userController = require('../controllers/userController');

/**
 * GET requests
*/
// router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

/**
 * POST requests
*/
router.post('/', userController.userSignIn);


/**
 * PUT requests
*/
// router.put('/:id', userController.updateUser);

/**
 * DELETE requests
*/
// router.delete('/:id', userController.deleteUser);

module.exports = router;