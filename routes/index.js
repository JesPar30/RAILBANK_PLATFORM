var express = require('express');
var router = express.Router();
var user = require('../controllers/userController.js');
const { isAuthenticated,isNotAuthenticated } = require("../helpers/auth.js");

/* GET home page. */
router.get('/',isNotAuthenticated, function(req, res, next) {
  res.render('index');
});
router.get('/inicio',isAuthenticated, function(req, res, next) {
  res.render('inicio');
});
router.get('/login',isNotAuthenticated, user.loginForm);
router.post('/login',user.loginInit);

router.get('/logout',isAuthenticated, user.logout);


module.exports = router;
