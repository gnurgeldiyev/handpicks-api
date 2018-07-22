const router = require('express').Router();
const topicController = require('../controllers/topicController');
const commonChecks = require('../middlewares/commonChecks');

/**
 * GET requests
*/
router.get('/', topicController.getAllTopics);
router.get('/:topicId', 
  commonChecks.isTopicExistsForParams,
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
  commonChecks.isTopicExistsForParams,
  topicController.updateTopic
);

/**
 * DELETE requests
*/
router.delete('/:topicId', 
  commonChecks.isTopicExistsForParams,
  topicController.deleteTopic
);


module.exports = router;