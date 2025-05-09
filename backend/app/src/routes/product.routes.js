const controller = require('../controllers/product.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.use(auth);
router.use(authorize('marketing_analyst'));

router.get('/competitorProducts/:competitor_id', controller.getCompetitorProducts);
router.get('/productPricePrediction/:product_id', controller.getProductPricePrediction);
router.get('/countPromotions',controller.countPromotions);
router.get('/getRecentPriceChanges',controller.getRecentPriceChanges);
router.get('/getRecentPriceChanges/:competitor_id',controller.getRecentPriceChangesByCompetitor);
router.get('/getProductPriceHistory/:product_id',controller.getProductPriceHistory);
router.get('/:product_id/insights', controller.getProductInsights);
router.get('/filteredProducts', controller.getFilteredProducts);
router.get('/filteredProducts/:competitor_id', controller.getFilteredProductsByCompetitor);

// Add this line to export the router
module.exports = router;