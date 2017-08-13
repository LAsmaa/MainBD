var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var rubrique = require('../models/rubrique');
var profil = require('../models/profil');

var router = express.Router();



// ================================//
// ****** Accés aux pages ******** //
// ================================//

//acceder à la présentation
router.get('/', function (req, res) {
    rubrique.findOne({titreRubrique: 'Présentation'}, function (err, rub) {
        rubrique.find(function (err, nav) {
            res.render('index', {
                rub:rub,
                user : req.user,
                Active: 'index',
                nav: nav
            });
        })
    })
});

//Acceder aux autre rubriques
router.get('/rubrique', function (req, res) {
    rubrique.findOne({titreRubrique: req.query.titre}, function (err, rub) {
        rubrique.find(function (err, nav) {
            res.render('rubrique', {
                rub:rub,
                nav: nav,
                user : req.user,
                Active: req.query.titre,
            });
        })

    })
});

//Acceder à la liste des membres
router.get('/membres', function(req, res, next) {
    var listeProf = profil.find(function (err, doc) {
        if (err) return console.error(err);
        rubrique.find(function (err, nav) {
            res.render('membres', {
                user : req.user,
                listeProf: listeProf,
                nav: nav,
                doc: doc,
                Active: 'membres'
            });
        })

    });
});

//Acceder à un profil d'utilisateur
router.get('/profile', function(req, res) {
    profil.findOne({nom: req.query.nom} ,function (err, doc) {
        rubrique.find(function (err, nav) {
            res.render('profile', {
                doc: doc,
                user: req.user,
                nav: nav,
                Active: 'membres'
            });
        })
    });
});





// ================================//
// ********* Connexion *********** //
// ================================//

//Connexion d'utilisateur enseignant
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/edition');
});

//Deconnexion d'utilisateur enseignant
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;