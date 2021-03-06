var express = require('express');
var router = express.Router();
var auth = require('../controllers/Controller.js');

// route for the homepage
router.get('/', auth.home);

// restrict dash for logged in user only
router.get('/dash', auth.dash);

// route for register action
router.post('/register', auth.doRegister);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

//route for add project action
router.post('/proj', auth.doProj);

//email confirmation
router.get('/confirmation', auth.doConfirmation);

module.exports = router;