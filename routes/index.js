var express = require('express');
var router = express.Router();

var Authorize = require('../controllers/auth.controller');

//Authorize(register, login, )
router.post("/api/v1/register", Authorize.register);
router.post("/api/v1/login", Authorize.login);
router.get("/api/v1/profile", Authorize.verifyToken, Authorize.profile);

module.exports = router;