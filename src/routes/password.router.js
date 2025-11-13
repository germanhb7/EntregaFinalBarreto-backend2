// src/routes/password.router.js
const express = require('express');
const { requestPasswordReset, resetPassword } = require('../controllers/password.controller');

const router = express.Router();

router.post('/forgot', requestPasswordReset);
router.post('/reset', resetPassword);

module.exports = router;
