var express = require('express');
var router = express.Router();

var fr = require('../controllers/FRController.js');

const { isAuthenticated } = require("../helpers/auth");

router.get('/', fr.list);
router.get('/genAmex/:id', fr.genAmex);
router.get('/show/:id', fr.show);
router.get('/create', fr.create);
router.post('/save', fr.save);
router.get('/edit/:id', fr.edit);
router.post('/update/:id', fr.update);
router.post('/delete/:id', fr.delete);

module.exports = router;