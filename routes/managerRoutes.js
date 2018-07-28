const router = require('express').Router();
const managerController = require('../controllers/managerController');

/**
 * GET requests
*/
router.get('/', managerController.getAllManagers);
router.get('/editors', managerController.getAllEditors);
router.get('/:username', managerController.getManagerByUsername);

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