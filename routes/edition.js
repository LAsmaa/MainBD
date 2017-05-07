var express = require('express');
var passport = require('passport');
var profil = require('../models/profil');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof) {
            res.render('edition', {
                doc: prof,
                user: req.user,
                Active: 'index' //Designe la page active
            });
        });
    }else
        res.redirect('/');

});

//Mettre a jou un profil
router.post('/updateProfil', function (req, res) {
    profil.findOne({user: req.user.username}, function (err, doc) {
        doc.nom= req.body.NomPrenom;
        doc.pres= req.body.presentation;
        doc.grade= req.body.grade;
        doc.email= req.body.email;
        doc.bureau= req.body.bureau;
        doc.
        save(function (err) {
            if (err){
                consore.error("******** Erreur lors de la sauvegarde ********");
            }else {
                console.log('******** Profile Mis a jour ********');
                res.redirect('/edition');
            }

        })
    })

});

//Ajouter article
router.post('/addArticle', function (req, res) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.forEach(function (rub, err) {
                var nomRub = rub.titre;
                if (nomRub === req.body.nomRubrique){
                    rub.articles.push({
                        titre: req.body.titreA,
                        contenu: req.body.contenu
                    });
                    var subsubDoc = rub.articles[0];
                    console.log(subsubDoc);
                }
            });
            prof.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde de l'article ********");
                }else {
                    console.log('******** Article ajouté ********');                }

            });
            res.redirect('/edition');
        })
    }else
        res.redirect('/');



});

//Supprimer article
router.get('/deleteArticle', function (req, res) {
    if (req.user){
        var id = req.quey.IDArticle;
        var IDRubrique = req.query.IDRubrique;
        console.log('Article ' + id + ' Rubrique ' + IDRubrique);
        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.forEach(function (rub, err) {
                if (rub._id == IDRubrique) {
                    rub.articles.id(id).remove();
                    console.log('******** Article supprime ********');
                }else{
                    console.log('Pas celle là '+ rub._id + '\n' );
                }
            });
            prof.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la supression de l'article ********");
                }else {
                    res.redirect('/edition');
                }

            })
        })
    }
    else
        res.redirect('/');

});

//Ajouter rubrique
router.post('/AddRubrique', function (req, res) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof) {
            prof.rubriques.push({ titre : req.body.titreR });
            prof.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde de la rubrique ********");
                }else {
                    console.log('******** Rubrique ajouté ********');
                    res.redirect('/edition');}

            })

        })
    }else
        res.redirect('/');
});

//Page de modification d'article ***Erreur _id de l'article undefined
router.post('/article', function (req, res) {
    if (req.user){
        var id = req.body.IDArticle;
        var IDRubrique = req.body.IDRubrique;
        console.log('Article ' + id + ' Rubrique ' + IDRubrique);
        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.forEach(function (rub, err) {
                if (rub._id == IDRubrique) {
                    console.log('***********ICI RUBRIQUE*********');
                    console.log(rub._id);
                    rub.articles.forEach(function (err, art) {
                        console.log(art._id);
                        if (art._id == id){
                            art.titre= req.body.titreA;
                            art.contenu= req.body.contenu;
                            console.log('***********ICI ARTICLE*********')
                        }
                    })
                }else {
                    console.log('***********PAS ICI*********')
                }
            });
            prof.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde ********");
                }else {
                    console.log('******** article Mis a jour ********');
                    res.redirect('/edition');
                }

            })

        })
    }
    else
        res.redirect('/');

});

//Modification d'article
router.get('/article', function (req, res) {
    if (req.user){
        var id = req.query.IDArticle;
        var IDRubrique = req.query.IDRubrique;
        console.log('Article ' + id + ' Rubrique ' + IDRubrique);
        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.forEach(function (rub, err) {
                if (rub._id == IDRubrique) {
                    res.render('article', {
                        IDArticle: id,
                        IDRubrique: IDRubrique,
                        art: rub.articles.id(id),
                        user : req.user,
                        Active: 'index'
                    });

                }else {
                    console.log('***********ERREUR *********')
                }
            })

        })
    }
    else
        res.redirect('/');

});


//Acceder à la page de configuration d'un article
router.get('/configuration', function (req, res, next) {
    if (req.user)
        res.render('configuration', {
            user : req.user
        });
    else
        res.redirect('/');

});

module.exports = router;