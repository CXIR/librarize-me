"use strict";

const express = require('express');
const models = require('../models');
const Friends = models.Friends;
const router = express.Router();

/**************************GET**************************/

/** Display user's current friend list */
router.get('/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Friends.findAll({options, where: {
      statutDemande: "Valide",
      $or: [
          {
              idUser1: req.params.user_id
          },
          {
              idUser2: req.params.user_id
          }
      ]
  }
  }).then(function(friends) {
    for(let friend of friends) {
      result.push(friend.responsify());
    }
    res.json(result);
  }).catch(function(err){
    res.json({result: -1});
  });

});

/** Display user's current sent friend requests */
router.get('/send_request/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Friends.findAll({options, where: {
      statutDemande: "EnAttente",
      idUser1: req.params.user_id
  }
  }).then(function(friends) {
      for(let friend of friends) {
        result.push(friend.responsify());
      }
      res.json(result);
  }).catch(function(err){
      res.json({result: -1});
  });

});

/** Display user's current received friend requests */
router.get('/received_request/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Friends.findAll({options, where: {
      statutDemande: "EnAttente",
      idUser2: req.params.user_id
  }
  }).then(function(friends) {
    for(let friend of friends) {
      result.push(friend.responsify());
    }
    res.json(result);
  }).catch(function(err){
    res.json({result: -1});
  });


});

/**************************POST**************************/

/** Send friend request */
router.post('/', function(req, res, next) {
  // User who ask
  let u = req.body.user;
  // User who receive ask
  let f = req.body.friend;
  let s = 'EnAttente';

  Friends.create({
    statutDemande: s,
    idUser1 : u,
    idUser2 : f,
  }).then(function(friend){
    res.json(friend);
  }).catch(function(err){
    res.json({result: -1});
  });

});

/** Accept friend request */
router.post('/accept/', function(req, res, next) {
  // User who ask
  let u = req.body.user;
  // User who receive ask
  let f = req.body.friend;
  let s = 'Valide';

  Friends.update({
    statutDemande: s,
  }, {
    where: {
        idUser1 : u,
        idUser2 : f
      }
    }
  ).then(function(friend){
    res.json(friend);
  }).catch(function(err){
    res.json({result: -1});
  });

});

/**************************DELETE**************************/

/** Reject friend request / delete friend */
router.delete('/:user_id/:friend_id', function(req, res, next) {

  Friends.find({
    where: { idUser1 : req.params.user_id
    , idUser2 : req.params.friend_id }
  }).then(function(friend) {
    if (friend) {
      return friend.destroy().then(function(friend){
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
