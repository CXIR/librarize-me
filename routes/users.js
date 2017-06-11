"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**************************AUTHENTICATION**************************/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'mail',
    passwordField: 'pass'
  },
  function(mail, pass, done) {
    User.find({
      where: {
        mailAdress : mail
      }
    }).then(function(user){
      if(err) return done(err);
      if(user){
        if(user.password == pass){
          return done(null,user);
        }
        else{
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
      else return done(null, false, { message: 'Incorrect username.' });
    }).catch(function(err){
      //res.json({result: -1});
    });
  }
));

router.post('/login',
  passport.authenticate('local', { successRedirect: '/users/loginFailure',
                                   failureRedirect: '/users/loginSuccess' }));

router.get('/loginFailure', function(req, res, next) {
  res.json({result:'Failed to authenticate'});
});

router.get('/loginSuccess', function(req, res, next) {
  res.json({result:'Successfully authenticated'});
});

/**************************GET**************************/
//Liste des utilisateurs
router.get('/', function(req, res, next) {
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o
  };
  User.findAll(options).then(function(users) {
    for(let user of users) {
      result.push(user.responsify());
    }
    res.json(result);
  }).catch(function(err){
    res.json({result: -1});
  });
});

//Affichage d'un utilisateur
router.get('/:user_id', function(req, res, next){
  User.find({
    where: {
      id : req.params.user_id
    }
  }).then(function(user){
    if(user){
      return res.json(user.responsify());
    }
    res.json({result: 404}); //USER NOT FOUND
  }).catch(function(err){
    res.json({result: -1});
  });
});

/**************************POST**************************/
//Creation d'un utilisateur
router.post('/', function(req, res, next) {
  let l = req.body.lastname;
  let f = req.body.firstname;
  let b = req.body.birthdate;
  let ma = req.body.mailAdress;
  let p = req.body.password;

  User.create({
    lastname: l,
    firstname : f,
    birthdate : b,
    mailAdress : ma,
    password : p
  }).then(function(user){
    res.json(user);
  }).catch(function(err){
    res.json({result: -1});
  });

});

router.post('/profile',function(req,res,next){
  let first = req.body.first;
  let name = req.body.name;
  let mail = req.body.mail;

  res.json({
            first: first,
            name: name,
            mail: mail
          });
});

//Modification d'un utilisateur
router.post('/edit',function(req,res,next){
  let id = req.body.id;
  let name = req.body.name;
  let first = req.body.first;
  let birth = req.body.birth;
  let mail = req.body.mail;
  let pass = req.body.pass;

  User.find({
    where: { id : id}
  }).then(function(user) {
    if (user) {
      user.updateAttributes({
        lastname: name,
        firstname : first,
        birthdate : birth,
        mailAdress : mail,
        password : pass
      });
      res.json(user);
    }
    res.json({result: 404}); //USER NOT FOUND
  }).catch(function(err){
    res.json({result: -1}); //SEQUELIZE ERROR
  });

})


/**************************DELETE**************************/
//Suppression d'un utilisateur
router.delete('/:user_id', function(req, res, next){
  User.find({
    where: { id : req.params.user_id }
  }).then(function(user) {
    if (user) {
      return user.destroy().then(function(user){
        res.json({result: 1});
      });
    }
    res.json({result: 404}); //USER NOT FOUND
  }).catch(function(err){
    res.json({result: -1}); //SEQUELIZE ERROR
  });

});

/**************************END**************************/
module.exports = router;
