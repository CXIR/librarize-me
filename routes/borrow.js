"use strict";

const express = require('express');
const Sequelize = require('sequelize');
const models = require('../models');
const Borrow = models.Borrow;
const Product = models.Product;
const router = express.Router();


/**************************GET**************************/

/** Current user's borrows list */
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
        where: { UserId: req.params.user_id }
    }],
     where: {
      renderingDate : null
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

/** Current borrows list from user */
router.get('/byMe/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Borrow.findAll({options, where: {
      UserId : req.params.user_id,
      renderingDate: null
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

/** Former user's borrows list */
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
        where: { UserId: req.params.user_id }
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

/** Former borrows list from user */
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

/** New borrow */
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

/** Get back a borrow */
router.post('/return', function(req, res, next) {
  let p = req.body.productID;
  /** User who borrowed */
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
