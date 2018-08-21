const router = require('express').Router();
const messageController = require('../controllers/messageController');
const { isMessageExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/', 
  messageController.getAllMessages
);
router.get('/:messageId',
  isMessageExistsForParams,
  messageController.getMessageById
);
/**
 * POST requests
*/
router.post('/', 
  messageController.addNewMessage
);
/**
 * DELETE requests
*/
router.delete('/:messageId', 
  isAuthenticatedManager,
  messageController.deleteTopic
);
module.exports = router;