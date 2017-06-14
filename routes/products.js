"use strict";

const express = require('express');
const models = require('../models');
const amazon = require('amazon-product-api');
const Product = models.Product;
const router = express.Router();
const amazon_client = amazon.createClient({
  awsId: "AKIAJ57L27I3YHIMBQJA",
  awsSecret: "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"
});

/**************************GET**************************/

/** Display user's products library (with no description) */
router.get('/users/:user_id', function(req, res, next){
  let l = parseInt(req.query.limit) || 20;
  let o = parseInt(req.query.offset) || 0;
  let result = [];
  let options = {
    limit : l,
    offset : o,
  };

  Product.findAll({options, where: {UserId : req.params.user_id}} )
  .then(function(products) {
    for(let product of products) {
      result.push(product.responsify());
    }
    res.json(result);
  }).catch(function(err){
    res.json({result: -1});
  });

});

/** Display one user product (with description) */
router.get('/:product_id', function(req, res, next){
  Product.find({
    where: {
      id : req.params.product_id
    }
  }).then(function(product){
    if(product){
      console.log(product);
      let asin = product.ASINCode;
      let info = {};

      amazon_client.itemLookup({
        itemId: asin,
        idType: "ASIN",
        responseGroup: 'ItemAttributes'
      },function(err, results, response){
        if(results){
          let type = results[0].ItemAttributes[0]["ProductGroup"][0];

          if(type == 'DVD'){
            info['title'] = results[0].ItemAttributes[0]["Title"];
            info['producer'] = results[0].ItemAttributes[0]["Director"];
            info['actors'] = results[0].ItemAttributes[0]["Actor"];
            info['format'] = results[0].ItemAttributes[0]["Format"];
          }
          if(type == 'Music'){
            info['title'] = results[0].ItemAttributes[0]["Title"];
            info['artist'] = results[0].ItemAttributes[0]["Artist"];
            info['discs'] = results[0].ItemAttributes[0]["NumberOfDiscs"];
          }
          if(type == 'Video Game'){
            info['title'] = results[0].ItemAttributes[0]["Title"];
            info['description'] = results[0].ItemAttributes[0]["Feature"];
            info['studio'] = results[0].ItemAttributes[0]["Studio"];
            info['genre'] = results[0].ItemAttributes[0]["Genre"];
            info['platform'] = results[0].ItemAttributes[0]["Platform"];
          }
          if(type == 'Book'){
            info['title'] = results[0].ItemAttributes[0]["Title"];
            info['author'] = results[0].ItemAttributes[0]["Author"];
            info['type'] = results[0].ItemAttributes[0]["Binding"];
            info['manufacturer'] = results[0].ItemAttributes[0]["Manufacturer"];
            info['pages'] = results[0].ItemAttributes[0]["NumberOfPages"];
            info['isbn'] = results[0].ItemAttributes[0]["ISBN"];
          }

          res.json(info);
        }
      });

    }else {
      res.json({result: 404}); //PRODUCT NOT FOUND
    }
  }).catch(function(err){
    res.json({result: -1});
  });
});


/**************************POST**************************/

/** New product in user's library using ASIN code
* process : product search on Amazon with ASIN code and insert into Database
*/
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

/** Product search on Amazon using EAN/Keywords/Type/ASIN
* EAN & ASIN return an element
* Keyword & Type return a list
*/
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

/**************************DELETE**************************/

router.delete('/:product_id', function(req, res, next){
  Product.find({
    where: { id : req.params.product_id }
  }).then(function(product) {
    if (product) {
      return product.destroy().then(function(product){
        res.json({result: 1});
      });
    }
    res.json({result: 404}); //PRODUCT NOT FOUND
  }).catch(function(err){
    res.json({result: -1}); //SEQUELIZE ERROR
  });

});

/**************************END**************************/
module.exports = router;
