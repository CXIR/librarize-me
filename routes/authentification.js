var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect("/");
});

router.get('/facebook',
    passport.authenticate('facebook', { scope : 'mailAdress' }
));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    })
);

module.exports = router;
