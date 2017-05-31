var express = require('express');
var passport = require('passport');
var profil = require('../models/profil');
var rubrique = require('../models/RubriqueSite');
var account = require('../models/account');
var router = express.Router();


// ================================//
// ***** Accés à l'édition ******* //
// ================================//
// ********** Acceder a la page de modification ***** //  ================================> OK
router.get('/', function(req, res, next) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof) {
            rubrique.find(function (err, nav) {
                res.render('edition', {
                    nav: nav,
                    doc: prof,
                    user: req.user,
                    Active: 'index' //Designe la page active
                });
            })
        });
    }else
        res.redirect('/');

});




// ================================//
// ************ Profil *********** //
// ================================//

// ****** Mettre a jou un profil *******  // ============================================> OK
router.post('/updateProfil', function (req, res) {
    profil.findOne({user: req.user.username}, function (err, doc) {

        doc.pres    = req.body.presentation;
        doc.nom     = req.body.NomPrenom;
        doc.grade   = req.body.grade;
        doc.email   = req.body.email;
        doc.bureau  = req.body.bureau;
        doc.save(function (err) {
            if (err){
                consore.error("******** Erreur lors de la sauvegarde ********");
            }else {
                console.log('******** Profile Mis a jour ********');
                res.redirect('/edition');
            }

        })
    })

});


// ****** Modification du mot de passe *******  //
router.post('/configuration', function (req, res, next) {
    if (req.user){
        var username = req.user.username;
        var password = req.user.password;
        var newpassword = req.body.newPassword;
        var user = req.user;

        account.findByUsername(username).then(function(sanitizedUser) {
            if (sanitizedUser) {
                sanitizedUser.setPassword(newpassword, function() {
                    sanitizedUser.save();
                    console.log('password reset successful');
                });
            } else {
                console.log('user does not exist');
            }
        }, function(err) {
            console.error(err);
        })
        res.redirect('/edition');
    }

    else
        res.redirect('/');

});

//Acceder à la page de configuration d'un article
router.get('/configuration', function (req, res, next) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof) {
            rubrique.find(function (err, nav) {
                res.render('configuration', {
                    nav: nav,
                    doc: prof,
                    user: req.user,
                    Active: 'index' //Designe la page active
                });
            })
        });
    }else
        res.redirect('/');
});


// ================================//
// ******** RUBRIQUES ******** //
// ================================//

// ****** Ajouter rubrique *******  // ================================================> OK
router.post('/AddRubrique', function (req, res) {
    if (req.user){
        profil.findOne({user: req.user.username}, function (err, prof) {
            prof.rubriques.push({ titre : req.body.titreRubrique });
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

// ****** Delete Rubrique ******* // ==================================================> OK
router.get('/DeleteRubrique', function (req, res) {
    if (req.user){
        var id = req.query.IDRubrique;
        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.id(id).remove();
            prof.save(function (err) {
                if (err){
                    consore.error("******** Erreur lors de la supression de la rubrique ********");
                }else {
                    res.redirect('/edition');
                }

            })
        })
    }
    else
        res.redirect('/');

});

// ****** Update Rubrique ****** //
router.post('/updateRubrique', function (req, res) {
    if (req.user){
        profil.update(
            {
                user: req.user.username,
                "rubriques._id": req.body.IdRubrique
            },{
                "$set": {
                    "rubriques.$.titre": req.body.NewTitre
                }
            },
            function(err, doc){
                if (err){
                    consore.error("******** Erreur lors de la sauvegarde de la mise a jour  ********");
                }else {
                    console.log('******** Rubrique Mise à jour ********');
                    res.redirect('/edition');
                }

            }

        )

    }else
        res.redirect('/');


})


// ================================//
// ********** Articles *********** //
// ================================//

// ******* Ajouter article *********// ================================================> OK
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

// ******* Supprimer article  *********// ==============================================> OK
router.get('/deleteArticle', function (req, res) {
    if (req.user){
        var id = req.query.IDArticle;
        var IDRubrique = req.query.IDRubrique;

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


//****** modification d'article *******// ==============================================> OK
router.post('/updateArticle', function (req, res) {
    if (req.user){
        var id = req.body.idArticle;
        var IDRubrique = req.body.idRubrique;

        profil.findOne({user: req.user.username}, function (err, prof){
            prof.rubriques.forEach(function (rub, err) {
                if (rub._id == IDRubrique) {
                    rub.articles.id(id).remove();
                    console.log('******** Article supprime ********');
                    rub.articles.push({
                        titre: req.body.titreA,
                        contenu: req.body.Contenu
                    });
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






module.exports = router;