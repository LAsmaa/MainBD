var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var rubrique = require('../models/rubrique');
var profil = require('../models/profil');

var router = express.Router();

//acceder à la présentation
router.get('/', function (req, res) {
    rubrique.findOne({titre: 'presentation'}, function (err, doc) {
        res.render('index', {
            doc:doc,
            user : req.user,
            Active: 'index',
        });
    })
});

//Acceder aux autre rubriques
router.get('/rubrique', function (req, res) {
    rubrique.findOne({titre: req.query.titre}, function (err, rub) {
        res.render('rubrique', {
            rub:rub,
            user : req.user,
            Active: req.query.titre,
        });
    })
});

//Acceder à la liste des membres
router.get('/membres', function(req, res, next) {
    var listeProf = profil.find(function (err, doc) {
        if (err) return console.error(err);
        res.render('membres', {
            user : req.user,
            listeProf: listeProf,
            doc: doc,
            Active: 'membres'
        });
    });
});

//Acceder à un profil d'utilisateur
router.get('/profile', function(req, res) {
    profil.findOne({nom: req.query.nom} ,function (err, doc) {
        res.render('profile', {
            doc: doc,
            user: req.user,
            Active: 'membres'
        });
    });
});

//Connexion d'utilisateur enseignant
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

//Deconnexion d'utilisateur enseignant
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;