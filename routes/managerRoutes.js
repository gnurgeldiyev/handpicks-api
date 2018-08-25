const router = require('express').Router();
const managerController = require('../controllers/managerController');
const { isManagerExistsForParams, isAdmin } = require('../middlewares/commonChecks');
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
/**
 * PUT requests
*/
router.put('/:managerId', 
  isAuthenticatedManager,
  isAdmin,
  isManagerExistsForParams,
  managerController.updateManager
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
module.exports = router;