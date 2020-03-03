var express = require('express');
var router = express.Router();

var user = require('../controllers/userController.js');

const { isAuthenticated,isNotAuthenticated } = require("../helpers/auth.js");

router.get('/',isAuthenticated, user.list);
router.get('/show/:id',isAuthenticated, user.show);
router.get('/create',isAuthenticated, user.create);
router.post('/save', user.save);
router.get('/edit/:id',isAuthenticated, user.edit);
router.post('/update/:id', user.update);
router.post('/delete/:id', user.delete);

module.exports = router;