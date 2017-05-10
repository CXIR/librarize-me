"use strict";

const express = require('express');
const models = require('../models');
const Loan = models.Loan;
const router = express.Router();


/**************************GET**************************/
//Liste des emprunts en cours de l'utilisateur (ses produits empruntés)


//Liste des emprunts en cours de l'utilisateur (les produits qu'ils a empruntés)


//Liste des emprunts passés de l'utilisateur (ses produits empruntés)


//Liste des emprunts passés de l'utilisateur (les produits qu'ils a empruntés)


/**************************POST**************************/
//Création d'un emprunt
router.post('/', function(req, res, next) {
  let p = req.body.productID;
  let u = req.body.userID;
  let d = req.body.date;

  Loan.create({
    loanDate: d,
    renderingDate : null,
    UserId: u,
    ProductId : p
  }).then(function(loan){
    res.json(loan);
  }).catch(function(err){
    res.json({result: -1});
  });

});


//Rendre un produit




/**************************END**************************/
module.exports = router;
