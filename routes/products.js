"use strict";

const express = require('express');
const models = require('../models');
const amazon = require('amazon-product-api');
const Product = models.Product;
const router = express.Router();
const amazon_client = amazon.createClient({
  awsId: "",
  awsSecret: ""
});

/**************************GET**************************/
//Affichage de la bibliothèque d'un utilisateur (liste des produits sans description)
//TODO : Affichage Pretty
router.get('/users/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Product.findAll({options, where: {UserId : req.params.user_id}} ).then(function(products) {
    for(let product of products) {
      result.push(product.responsify());
    }
    res.json(result);
  }).catch(function(err){
    res.json({result: -1});
  });


});

//Affichage d'un produit d'un utilisateur (avec description)
router.get('/:product_id', function(req, res, next){
  Product.find({
    where: {
      id : req.params.product_id
    }
  }).then(function(product){
    if(product){
      let asin = product.ASINCode;
      return res.json(product);

      //TODO : recherche du produit via ASIN sur amazon pour afficher les détails

    }
    res.json({result: 404}); //PRODUCT NOT FOUND
  }).catch(function(err){
    res.json({result: -1});
  });
});


/**************************POST**************************/
//Ajout d'un produit à la bibliothèque de l'utilisateur via code ASIN
//Recherche du produit via code ASIN
//Puis ajout à la bibliothèque
router.post('/add', function(req, res, next) {
  let asin = req.body.asin;
  let user = req.body.user;
  let date = new Date();
  let n;
  let bc;
  let pt;

  amazon_client.itemLookup({
    itemId: asin,
    responseGroup: 'ItemAttributes'
  }, function(err, results, response) {
    if (results) {
      n = results[0].ItemAttributes[0]["Title"][0];
      pt = results[0].ItemAttributes[0]["ProductGroup"][0];
      bc = results[0].ItemAttributes[0]["EAN"][0];

      //Ajout en BDD
      Product.create({
        barCode: bc,
        name : n,
        add_date: date,
        productType: pt,
        ASINCode: asin,
        UserId : user
      }).then(function(product){
        res.json(product);
      }).catch(function(err){
        console.log(err);
        res.json({result: -1}); //SEQUELIZE ERROR
      });

    } else {
      console.log(err.Error);
    }
  });

});

//Recherche de produits par EAN/Keywords/Type/ASIN
//EAN & ASIN -> Retourne un élément
//Keywords & Type -> Retourne une liste
//TODO : Affichage Pretty
router.post('/find', function(req, res, next) {
  let type = req.body.type;
  let value = req.body.value;

  if (type == 'EAN') {
    amazon_client.itemLookup({
      idType: 'EAN',
      itemId: value,
      responseGroup: 'ItemAttributes'
    }, function(err, results, response) {
      if (err) {
        res.json(err);
      } else {
        res.json(results);
      }
    });
  }
  if (type == 'ASIN') {
    amazon_client.itemLookup({
      itemId: value,
      responseGroup: 'ItemAttributes'
    }, function(err, results, response) {
      if (err) {
        res.json(err);
      } else {
        res.json(results);
      }
    });
  }
  else if (type == 'Keywords') {
    amazon_client.itemSearch({
      keywords : value,
      responseGroup: 'ItemAttributes'
    }).then(function(results){
      res.json(results);
    }).catch(function(err){
      res.json(err);
    });
  }
  else if (type == 'Type') {
    amazon_client.itemSearch({
      keywords : value,
      searchIndex: value,
      responseGroup: 'ItemAttributes',
      VariationPage : 1,
      sort:"salesrank"
    }).then(function(results){
      res.json(results);
    }).catch(function(err){
      res.json(err);
    });
  }
});

/**************************END**************************/
module.exports = router;
