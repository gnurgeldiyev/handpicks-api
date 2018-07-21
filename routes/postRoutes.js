const router = require('express').Router();
const postController = require('../controllers/postController');

/**
 * GET requests
*/
router.get('/:postId', postController.getPostById);

/**
 * POST requests
*/
router.post('/', postController.addNewPost);


/**
 * PUT requests
*/


/**
 * DELETE requests
*/



module.exports = router;