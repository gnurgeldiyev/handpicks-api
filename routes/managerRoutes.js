const router = require('express').Router();
const managerController = require('../controllers/managerController');
const clientController = require('../controllers/clientController');
const { isManagerExistsForParams, isAdminForParams } = require('../middlewares/commonChecks');

/**
 * GET requests
*/
router.get('/', managerController.getAllManagers);
router.get('/editors', managerController.getAllEditors);
router.get('/:managerId', 
  isManagerExistsForParams,
  managerController.getManagerByUsername
);

/**
 * POST requests
*/
router.post('/', managerController.addNewManager);
router.post('/login', managerController.login);
router.post('/:managerId/clients', 
  isManagerExistsForParams,
  isAdminForParams,
  clientController.addNewClient
);

/**
 * PUT requests
*/
router.put('/:managerId', 
  isManagerExistsForParams,
  managerController.updateManager
);

/**
 * DELETE requests
*/
router.delete('/:managerId', 
  isManagerExistsForParams,
  isAdminForParams,
  managerController.deleteManager
);

module.exports = router;