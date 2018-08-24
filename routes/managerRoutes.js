const router = require('express').Router();
const managerController = require('../controllers/managerController');
const clientController = require('../controllers/clientController');
const { isManagerExistsForParams, isAdmin, isClientExistsForParams } = require('../middlewares/commonChecks');
const { isAuthenticatedManager } = require('../middlewares/auth');
/**
 * GET requests
*/
router.get('/', 
  isAuthenticatedManager,
  managerController.getAllManagers
);
router.get('/editors', 
  isAuthenticatedManager,
  managerController.getAllEditors
);
router.get('/:managerId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  managerController.getManagerByUsername
);
router.get('/:managerId/clients', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  clientController.getAllClients
);
router.get('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  isClientExistsForParams,
  clientController.getClientById
);
router.get('/:managerId/clients/:clientId/keys', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  isClientExistsForParams,
  clientController.getClientKeys
);
/**
 * POST requests
*/
router.post('/', 
  isAuthenticatedManager,
  managerController.addNewManager
);
router.post('/login', managerController.login);
router.post('/logout', 
  isAuthenticatedManager,
  managerController.logout
);
router.post('/:managerId/clients', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  clientController.addNewClient
);
/**
 * PUT requests
*/
router.put('/:managerId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  managerController.updateManager
);
router.put('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  isClientExistsForParams,
  clientController.updateClient
);
/**
 * DELETE requests
*/
router.delete('/:managerId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  managerController.deleteManager
);
router.delete('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  isClientExistsForParams,
  clientController.deleteClient
);
module.exports = router;