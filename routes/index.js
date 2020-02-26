var express = require('express');
var router = express.Router();

const { isAuthenticated,isNotAuthenticated } = require("../helpers/auth");

/* GET home page. */
router.get('/',isNotAuthenticated, function(req, res, next) {
  res.render('index');
});
router.get('/inicio',isAuthenticated, function(req, res, next) {
  res.render('inicio');
});


module.exports = router;
