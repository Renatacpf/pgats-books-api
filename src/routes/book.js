const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');

router.post('/', bookController.create);
router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.remove);

module.exports = router;
