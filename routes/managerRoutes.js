const router = require('express').Router();
const managerController = require('../controllers/managerController');

/**
 * GET requests
*/


/**
 * POST requests
*/
router.post('/', managerController.addNewManager);


/**
 * PUT requests
*/


/**
 * DELETE requests
*/


module.exports = router;