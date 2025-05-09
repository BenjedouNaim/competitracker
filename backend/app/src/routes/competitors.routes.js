const controller = require('../controllers/competitors.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.use(auth);
router.use(authorize('marketing_analyst'));

router.get('/competitors',controller.getCompetitors);//all competitors
router.get('/countCompetitors', controller.countCompetitors);//count competitors
router.get('/competitor/:competitor_id', controller.getCompetitor);//competitor by id
router.get('/competitorProducts/:competitor_id', controller.getProducts);//products of a competitor
router.get('/prixMoyenCategory/:competitor_id',controller.PrixMoyenCategory);//average price of a category for a competitor
router.get('/prixMoyenSubCategory/:competitor_id',  controller.PrixMoyenSubCategory);//average price of a category for a competitor
router.get('/repartitionCategory/:competitor_id', controller.RepartitionCategory);//repartition of categories for a competitor
router.get('/repartitionSubCategory/:competitor_id', controller.RepartitionSubCategory);//repartition of subcategories for a competitor
router.get('/variationPrix/:competitor_id', controller.variationPrix);//variation of prices for a competitor(min,max,variation)
router.get('/partMarche',controller.partDeMarche);//part de marche for all competitors


module.exports = router;