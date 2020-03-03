var express = require('express');
var router = express.Router();

var fr = require('../controllers/FRController.js');

const { isAuthenticated } = require("../helpers/auth");

router.get('/',isAuthenticated, fr.list);
router.get('/genAmex/:id',isAuthenticated, fr.genAmex);
router.get('/show/:id',isAuthenticated, fr.show);
router.get('/create',isAuthenticated, fr.create);
router.post('/save', fr.save);
router.get('/edit/:id',isAuthenticated, fr.edit);
router.post('/update/:id', fr.update);
router.post('/delete/:id', fr.delete);

module.exports = router;