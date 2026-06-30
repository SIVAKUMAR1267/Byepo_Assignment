const express = require('express');
const { evaluateFlag } = require('../controllers/publicController');

const router = express.Router();

router.post('/evaluate', evaluateFlag);

module.exports = router;