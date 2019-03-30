const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const ct_controller = require('../controllers/ct.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', ct_controller.test);
router.post('/create', ct_controller.contact_create);
router.get('/:id', ct_controller.contact_details);
router.put('/:id/update', ct_controller.contact_update);
router.delete('/:id/delete', ct_controller.contact_delete);
router.get('/', ct_controller.contact_getAll);
module.exports = router;