const router = require('express').Router();
const managerController = require('../controllers/managerController');

/**
 * GET requests
*/
router.get('/', managerController.getAllManagers);

/**
 * POST requests
*/
router.post('/', managerController.addNewManager);
router.post('/login', managerController.login);

/**
 * PUT requests
*/


/**
 * DELETE requests
*/


module.exports = router;