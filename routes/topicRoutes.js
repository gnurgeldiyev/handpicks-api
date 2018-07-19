const router = require('express').Router();
const topicController = require('../controllers/topicController');

/**
 * GET requests
*/
router.get('/', topicController.getAllTopics);
router.get('/:id', topicController.getTopicById);

/**
 * POST requests
*/
router.post('/', topicController.addNewTopic);


/**
 * PUT requests
*/
router.put('/:id', topicController.updateTopic);

/**
 * DELETE requests
*/
router.delete('/:id', topicController.deleteTopic);


module.exports = router;