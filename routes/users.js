"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

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
  }).then(function(stud){
    res.json(stud);
  }).catch(function(err){
    res.json({result: -1});
  });

});

//Modification d'un utilisateur


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
