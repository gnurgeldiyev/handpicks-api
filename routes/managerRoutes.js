const router = require('express').Router();
const managerController = require('../controllers/managerController');
const clientController = require('../controllers/clientController');
const { isManagerExistsForParams, isAdminForParams, isClientExistsForParams } = require('../middlewares/commonChecks');
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
  isManagerExistsForParams,
  isAdminForParams,
  clientController.getAllClients
);
router.get('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  isAdminForParams,
  isClientExistsForParams,
  clientController.getClientById
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
  isManagerExistsForParams,
  isAdminForParams,
  clientController.addNewClient
);

/**
 * PUT requests
*/
router.put('/:managerId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  managerController.updateManager
);
router.put('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  isAdminForParams,
  isClientExistsForParams,
  clientController.updateClient
);

/**
 * DELETE requests
*/
router.delete('/:managerId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  isAdminForParams,
  managerController.deleteManager
);
router.delete('/:managerId/clients/:clientId', 
  isAuthenticatedManager,
  isManagerExistsForParams,
  isAdminForParams,
  isClientExistsForParams,
  clientController.deleteClient
);

module.exports = router;