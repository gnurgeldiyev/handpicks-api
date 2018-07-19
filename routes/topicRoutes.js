const router = require('express').Router();
const topicController = require('../controllers/topicController');

/**
 * GET requests
*/


/**
 * POST requests
*/
router.post('/', topicController.addNewTopic);


/**
 * PUT requests
*/

/**
 * DELETE requests
*/


module.exports = router;