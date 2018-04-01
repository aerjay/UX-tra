var express = require('express');
var router = express.Router();
var auth = require('../controllers/Controller.js');

// route for the homepage
router.get('/', auth.home);

// restrict dash for logged in user only
router.get('/dash', auth.dash);

// route for register action
router.get('/register', auth.home);

// route for register action
router.post('/register', auth.doRegister);

// route for login action
router.post('/login', auth.doLogin);

// route for login 
router.get('/login', auth.home);

// route for logout action
router.get('/logout', auth.logout);

//route for project
router.get('/proj', auth.proj);

//route for project action
router.post('/proj', auth.doProj);

module.exports = router;