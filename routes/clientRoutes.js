const router = require('express').Router();
const clientController = require('../controllers/clientController');
const { isAdmin, isClientExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/', 
  isAuthenticatedManager,
  isAdmin,
  clientController.getAllClients
);
router.get('/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isClientExistsForParams,
  clientController.getClientById
);
router.get('/clients/:clientId/keys', 
  isAuthenticatedManager,
  isAdmin,
  isClientExistsForParams,
  clientController.getClientKeys
);
/**
 * POST requests
*/
router.post('/', 
  isAuthenticatedManager,
  isAdmin,
  clientController.addNewClient
);
/**
 * PUT requests
*/
router.put('/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isClientExistsForParams,
  clientController.updateClient
);
/**
 * DELETE requests
*/
router.delete('/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isClientExistsForParams,
  clientController.deleteClient
);
module.exports = router;