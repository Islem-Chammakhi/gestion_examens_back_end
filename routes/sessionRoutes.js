const express = require('express');
const router = express.Router();

const { getSessions, createSession } = require('../controllers/sesssionController');
const verifyRole = require('../middleware/verifyRole')


router.get('/sessions', verifyRole("ADMIN"), getSessions);
router.post('/sessions', verifyRole("ADMIN"), createSession);

module.exports = router;