const router = require('express').Router();
const managerController = require('../controllers/managerController');
const { isManagerExistsForParams } = require('../middlewares/commonChecks');

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
  managerController.deleteManager
);

module.exports = router;