/**
 * TU KREIRAM SVE LINKOVE NA BE KOJI MI ŠALJU POTREBNE PODATKE
 */
var express = require('express');
var router = express.Router();

const db = require('./queries.js');
const {requiresAuth} = require('express-openid-connect');
const cors = require('cors');
router.use(cors());
router.get('/natjecanja',db.getAllNatjecanje);
router.get('/natjecanje/:naziv',db.getNatjecanje);
router.get('/natjecanjaByKorisnik/:sub', db.getNatjecanjaByKorisnik);
router.get('/natjecatelji/:naziv', db.getNatjecatelji);
router.get('/kolo/:koloid', db.getKolo);
router.get('/kola/:natj', db.getKolaByNatjecanje);
router.post('/kreirajnatjecanje/:sub',  db.createNatjecanje);
router.put('/bodovi/:kolo_id/', db.updateBodovi)
module.exports = router;