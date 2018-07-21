const router = require('express').Router();
const topicController = require('../controllers/topicController');

/**
 * GET requests
*/
router.get('/', topicController.getAllTopics);
router.get('/:topicId', topicController.getTopicById);

/**
 * POST requests
*/
router.post('/', topicController.addNewTopic);


/**
 * PUT requests
*/
router.put('/:topicId', topicController.updateTopic);

/**
 * DELETE requests
*/
router.delete('/:topicId', topicController.deleteTopic);


module.exports = router;