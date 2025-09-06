const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/me', userController.me);

module.exports = router;
