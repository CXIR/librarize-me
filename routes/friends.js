"use strict";

const express = require('express');
const models = require('../models');
const Friends = models.Friends;
const router = express.Router();

/**************************GET**************************/
//Affichage de la liste d'amis d'un utilisateur (statutDemande = 'Valide'& User -> idUser1 & idUser2)
router.get('/:user_id', function(req, res, next){
  let StatutDemande = 'Valide';
  // user -> idUser1 & idUser2

});



//Affichage de la liste des demandes d'amis en cours d'un utilisateur (statutDemande = 'EnAttente' & idUser1)
router.get('/send_request/:user_id', function(req, res, next){
  let StatutDemande = 'EnAttente';
  // user -> idUser1

});


//Affichage des demandes d'amis d'un utilisateur (statutDemande = 'EnAttente' & idUser2)
router.get('/received_request/:user_id', function(req, res, next){
  let StatutDemande = 'EnAttente';
  // user -> idUser2


});


/**************************POST**************************/
//Faire une demande d'amitié (=> Création de la demande)
router.post('/', function(req, res, next) {
  let u = req.body.user; //celui qui fait la demande
  let f = req.body.friend; //celui qui est demandé
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

//Valider une demande d'amitié (statutDemande = 'EnAttente' -> 'Valide')


/**************************DELETE**************************/
//Refuser une demande d'amitié/Supprimer un ami (=> Suppression de la demande)


/**************************END**************************/
module.exports = router;
