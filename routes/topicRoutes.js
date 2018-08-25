const router = require('express').Router();
const topicController = require('../controllers/topicController');
const { isTopicUrlExistsForParams, isTopicIdExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/', 
  topicController.getAllTopics
);
router.get('/:topicUrl',
  isTopicUrlExistsForParams,
  topicController.getTopicByUrl
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
  isTopicIdExistsForParams,
  topicController.updateTopic
);
/**
 * DELETE requests
*/
router.delete('/:topicId', 
  isAuthenticatedManager,
  isTopicIdExistsForParams,
  topicController.deleteTopic
);
module.exports = router;