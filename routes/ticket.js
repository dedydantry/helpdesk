var express = require('express');
var router = express.Router();
var ticketController = require('../controller/ticketController');

router.get('/', ticketController.index);
router.get('/create', ticketController.create);
router.post('/store', ticketController.store);

module.exports = router;