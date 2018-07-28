const router = require('express').Router();
const topicController = require('../controllers/topicController');
const { isTopicExistsForParams } = require('../middlewares/commonChecks');

/**
 * GET requests
*/
router.get('/', topicController.getAllTopics);
router.get('/:topicId', 
  isTopicExistsForParams,
  topicController.getTopicById
);

/**
 * POST requests
*/
router.post('/', topicController.addNewTopic);


/**
 * PUT requests
*/
router.put('/:topicId',
  isTopicExistsForParams,
  topicController.updateTopic
);

/**
 * DELETE requests
*/
router.delete('/:topicId', 
  isTopicExistsForParams,
  topicController.deleteTopic
);


module.exports = router;