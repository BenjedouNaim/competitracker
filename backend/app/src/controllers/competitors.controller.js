const { Competitor } = require('../models');
const {Product} = require('../models');



exports.countCompetitors = async (req, res) => {
    try {
        const competitors = await Competitor.find();
        if (!competitors || competitors.length === 0) {
            return res.status(404).json({ message: 'No competitors found' });
        }
        res.status(200).json({ count: competitors.length });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.variationPrix = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        const products = await Product.find({ competitor: competitor.name });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }

        const prices = products.map(product => product.product_price).filter(price => price > 0);

        if (prices.length === 0) {
            return res.status(404).json({ message: 'No valid prices found for this competitor' });
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        const variation = ((maxPrice - minPrice) / avgPrice) * 100;

        res.status(200).json({ minPrice, maxPrice, avgPrice, variation: Number(variation.toFixed(2)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


//count promotions for all competitors 



exports.partDeMarche = async (req, res) => {
    try {
        const competitors = await Competitor.find();
        if (!competitors || competitors.length === 0) {
            return res.status(404).json({ message: 'No competitors found' });
        }

        // Get the total number of products across all competitors
        const totalProductsAcrossAllCompetitors = await Product.countDocuments();

        const competitorsWithMarketShare = await Promise.all(competitors.map(async (competitor) => {
            const totalProductsForCompetitor = await Product.countDocuments({ competitor: competitor.name });
            const marketShare = (totalProductsForCompetitor / totalProductsAcrossAllCompetitors) * 100;
            return { competitor: competitor.name, marketShare: marketShare.toFixed(2) };
        }));

        res.status(200).json(competitorsWithMarketShare);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        if (!competitor) {
            return res.status(404).json({ message: 'Competitor not found' });
        }

        const products = await Product.find({ competitor: competitor.name });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }

        // Calculate market share
        const totalProductsForCompetitor = await Product.countDocuments({ competitor: competitor.name });
        const totalProductsAcrossAllCompetitors = await Product.countDocuments();
        const marketShare = (totalProductsForCompetitor / totalProductsAcrossAllCompetitors) * 100;

        // Calculate discounted products
        const discountedProducts = products.filter(product => product.discount > 0);

        // Calculate average price
        const totalPrice = products.reduce((acc, product) => acc + product.product_price, 0);
        const averagePrice = totalPrice / products.length;

        res.status(200).json({
            products,
            productsCount: products.length,
            discountedProductsCount: discountedProducts.length,
            averagePrice,
            marketShare: marketShare.toFixed(2),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


//indice de prix par category pour tous les competitors


exports.getCompetitors = async (req, res) => {
    try {
        const competitors = await Competitor.find();
        if (!competitors || competitors.length === 0) {
        return res.status(404).json({ message: 'No competitors found' });
        }
        res.status(200).json(competitors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getCompetitor = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        if (!competitor) {
            return res.status(404).json({ message: 'Competitor not found' });
        }   
        res.status(200).json(competitor);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}




exports.PrixMoyenCategory = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        const products = await Product.find({ competitor: competitor.name });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }

        const categories = [...new Set(products.map(product => product.category))];
        const averagePrices = await Promise.all(categories.map(async category => {
            const categoryProducts = products.filter(product => product.category === category);
            const totalPrice = categoryProducts.reduce((acc, product) => acc + product.product_price, 0);
            const averagePriceCompetitor = totalPrice / categoryProducts.length;

            // Calculate market average price for this category
            const allCategoryProducts = await Product.find({ category });
            const totalMarketPrice = allCategoryProducts.reduce((acc, product) => acc + product.product_price, 0);
            const averagePriceMarket = totalMarketPrice / allCategoryProducts.length;

            return { category, averagePriceCompetitor, averagePriceMarket };
        }));

        res.status(200).json(averagePrices);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.PrixMoyenSubCategory = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        const products = await Product.find({ competitor: competitor.name });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }

        const subCategories = [...new Set(products.map(product => product.sub_category))];
        const averagePrices = await Promise.all(subCategories.map(async subCategory => {
            const subCategoryProducts = products.filter(product => product.sub_category === subCategory);
            const totalPrice = subCategoryProducts.reduce((acc, product) => acc + product.product_price, 0);
            const averagePriceCompetitor = totalPrice / subCategoryProducts.length;

            // Calculate market average price for this sub-category
            const allSubCategoryProducts = await Product.find({ sub_category: subCategory });
            const totalMarketPrice = allSubCategoryProducts.reduce((acc, product) => acc + product.product_price, 0);
            const averagePriceMarket = totalMarketPrice / allSubCategoryProducts.length;

            return { subCategory, averagePriceCompetitor, averagePriceMarket };
        }));

        res.status(200).json(averagePrices);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.RepartitionCategory = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        const products = await Product.find({competitor: competitor.name});
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }
        const categories = [...new Set(products.map(product => product.category))];
        const repartition = categories.map(category => {
            const categoryProducts = products.filter(product => product.category === category);
            const percentage = (categoryProducts.length / products.length) * 100;
            return { category, percentage };
        });
        res.status(200).json(repartition);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}


exports.RepartitionSubCategory = async (req, res) => {
    try {
        const { competitor_id } = req.params;
        const competitor = await Competitor.findById(competitor_id);
        const products = await Product.find({competitor: competitor.name});
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this competitor' });
        }
        const subCategories = [...new Set(products.map(product => product.sub_category))];
        const repartition = subCategories.map(subCategory => {
            const subCategoryProducts = products.filter(product => product.sub_category === subCategory);
            const percentage = (subCategoryProducts.length / products.length) * 100;
            return { subCategory, percentage };
        });
        res.status(200).json(repartition);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}







