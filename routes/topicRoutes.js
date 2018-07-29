const router = require('express').Router();
const topicController = require('../controllers/topicController');
const { isTopicExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');

/**
 * GET requests
*/
router.get('/', topicController.getAllTopics
);
router.get('/:topicId',
  isTopicExistsForParams,
  topicController.getTopicById
);

/**
 * POST requests
*/
router.post('/', 
  isAuthenticatedManager,
  topicController.addNewTopic
);

/**
 * PUT requests
*/
router.put('/:topicId',
  isAuthenticatedManager,
  isTopicExistsForParams,
  topicController.updateTopic
);

/**
 * DELETE requests
*/
router.delete('/:topicId', 
  isAuthenticatedManager,
  isTopicExistsForParams,
  topicController.deleteTopic
);

module.exports = router;