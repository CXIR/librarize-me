"use strict";

const express = require('express');
const models = require('../models');
const Borrow = models.Borrow;
const router = express.Router();


/**************************GET**************************/
//Liste des emprunts en cours de l'utilisateur (ses produits empruntés)
//TODO: à tester
router.get('/byFriends/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Borrow.findAll({options,
    include: [{
        model: Product,
        where: { UserId: Sequelize.col(req.params.user_id) }
    }],
     where: {
      renderingDate :NULL
  }
  }).then(function(allBorrowered) {
      for(let oneBorrowered of allBorrowered) {
        result.push(oneBorrowered.responsify());
      }
      res.json(result);
  }).catch(function(err){
      res.json({result: -1});
  });

});

//Liste des emprunts en cours de l'utilisateur (les produits qu'ils a empruntés)
// TODO: à tester
router.get('/byMe/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Borrow.findAll({options, where: {
      UserId : req.params.user_id,  // TODO : Vérifier nom
      renderingDate :NULL
  }
  }).then(function(allBorrowered) {
      for(let oneBorrowered of allBorrowered) {
        result.push(oneBorrowered.responsify());
      }
      res.json(result);
  }).catch(function(err){
      res.json({result: -1});
  });

});

//Liste des emprunts passés de l'utilisateur (ses produits empruntés)
//TODO : à tester
router.get('/byFriends_old/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Borrow.findAll({options,
    include: [{
        model: Product,
        where: { UserId: Sequelize.col(req.params.user_id) }
    }],
     where: {
      renderingDate : { $lte : new Date() }
  }
  }).then(function(allBorrowered) {
      for(let oneBorrowered of allBorrowered) {
        result.push(oneBorrowered.responsify());
      }
      res.json(result);
  }).catch(function(err){
      res.json({result: -1});
  });

});

//Liste des emprunts passés de l'utilisateur (les produits qu'ils a empruntés)
// TODO: à tester
router.get('/byMe_old/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Borrow.findAll({options, where: {
      UserId : req.params.user_id,
      renderingDate : { $lte : new Date() }
  }
  }).then(function(allBorrowered) {
      for(let oneBorrowered of allBorrowered) {
        result.push(oneBorrowered.responsify());
      }
      res.json(result);
  }).catch(function(err){
      res.json({result: -1});
  });

});

/**************************POST**************************/
//Création d'un emprunt
router.post('/', function(req, res, next) {
  let p = req.body.productID;
  let u = req.body.userID;
  let d = new Date();

  Borrow.create({
    BorrowDate: d,
    renderingDate : null,
    UserId: u,
    ProductId : p
  }).then(function(Borrow){
    res.json(Borrow);
  }).catch(function(err){
    res.json({result: -1});
  });

});

//Rendre un produit --> maj renderingDate
// TODO : à tester
router.post('/return', function(req, res, next) {
  let p = req.body.productID;
  let u = req.body.userID;
  let d = new Date();

  Borrow.update({
    renderingDate: d,
  }, {
    where: {
        UserId: u,
        ProductId : p
      }
    }
  ).then(function(borrow){
    res.json(borrow);
  }).catch(function(err){
    res.json({result: -1});
  });

});

/**************************END**************************/
module.exports = router;
