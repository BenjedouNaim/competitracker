const { Product } = require('../models');
const { Competitor } = require('../models');
const {ProductHistory} = require('../models');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const axios = require('axios');


exports.getCompetitorProducts = async (req, res) => {
  try {
    const { competitor_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(competitor_id)) {
      return res.status(400).json({ message: 'Invalid competitor ID' });
    }
    const competitorObjectId = new mongoose.Types.ObjectId(competitor_id);
    const products = await Product.find({ competitor: competitorObjectId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this competitor' });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async(req,res)=>{
  try{
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this competitor' });
    }
    res.status(200).json(products);
  }catch(err){
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getProductPricePrediction = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const productObjectId = new mongoose.Types.ObjectId(product_id);

    const productHistory = await ProductHistory.find({ product_id: productObjectId });


    if (!productHistory || productHistory.length === 0) {
      return res.status(404).json({ message: 'No price history found for this product' });
    }

    // Simple prediction logic (e.g., average of last 10 prices)
    const prices = productHistory.map(entry => entry.product_price);
    const predictedPrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;

    res.status(200).json({ predictedPrice });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }

}
//get product_history (all)


exports.countPromotions = async (req, res) => {
    try{
        const allProducts = await Product.find({discount: {$gt: 0}});
        if (!allProducts || allProducts.length === 0) {
            return res.status(404).json({count : 0});
        }
        return res.status(200).json({count : allProducts.length});
    }catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}



exports.getRecentPriceChanges = async (req, res) => {
  try {
    const result = await ProductHistory.aggregate([
      { $sort: { timestamp: -1 } },

      {
        $group: {
          _id: "$product_id",
          prices: {
            $push: {
              product_price: "$product_price",
              timestamp: "$timestamp"
            }
          }
        }
      },

      { $match: { "prices.1": { $exists: true } } },

      {
        $project: {
          recent: { $slice: ["$prices", 2] }
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $project: {
          product_name: "$product.product_name",
          current_price: { $arrayElemAt: ["$recent.product_price", 0] },
          ancien_price: { $arrayElemAt: ["$recent.product_price", 1] },
          date_of_change: { $arrayElemAt: ["$recent.timestamp", 0] },
          variation: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$recent.product_price", 1] }, 0] },
              then: null,
              else: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $subtract: [
                              { $arrayElemAt: ["$recent.product_price", 0] },
                              { $arrayElemAt: ["$recent.product_price", 1] }
                            ]
                          },
                          { $arrayElemAt: ["$recent.product_price", 1] }
                        ]
                      },
                      100
                    ]
                  },
                  2
                ]
              }
            }
          }
        }
      },

      { $sort: { date_of_change: -1 } }, 
      { $limit: 10 } 
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
};






exports.getRecentPriceChangesByCompetitor = async (req, res) => {
  try {
    const { competitor_id } = req.params;

    // 1. Find the competitor by ID
    const competitor = await Competitor.findById(competitor_id);
    if (!competitor) {
      return res.status(404).json({ message: 'Competitor not found' });
    }

    // 2. Find products for that competitor by name
    const products = await Product.find({ competitor: competitor.name }, '_id product_name');
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this competitor.' });
    }

    const productMap = new Map(products.map(p => [p._id.toString(), p.product_name]));
    const productIds = products.map(p => p._id);

    // 3. Aggregate last 2 price changes from product history
    const result = await ProductHistory.aggregate([
      { $match: { product_id: { $in: productIds } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$product_id",
          prices: {
            $push: {
              product_price: "$product_price",
              timestamp: "$timestamp"
            }
          }
        }
      },
      { $match: { "prices.1": { $exists: true } } },
      {
        $project: {
          product_id: "$_id",
          current_price: { $arrayElemAt: ["$prices.product_price", 0] },
          ancien_price: { $arrayElemAt: ["$prices.product_price", 1] },
          date_of_change: { $arrayElemAt: ["$prices.timestamp", 0] },
          variation: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$prices.product_price", 1] }, 0] },
              then: null,
              else: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: [
                              { $arrayElemAt: ["$prices.product_price", 0] },
                              { $arrayElemAt: ["$prices.product_price", 1] }
                          ]},
                          { $arrayElemAt: ["$prices.product_price", 1] }
                        ]
                      },
                      100
                    ]
                  },
                  2
                ]
              }
            }
          }
        }
      }
    ]);

    // 4. Attach product names
    const response = result.map(item => ({
      product_name: productMap.get(item.product_id.toString()),
      current_price: item.current_price,
      ancien_price: item.ancien_price,
      date_of_change: item.date_of_change,
      variation: item.variation
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
};


exports.getProductPriceHistory = async (req, res) => {
  try {
    const { product_id } = req.params;

    const history = await ProductHistory.find({ product_id })
      .sort({ timestamp: 1 }) // oldest to newest
      .select('product_price timestamp');

    const result = history.map(entry => {
      const dateObj = new Date(entry.timestamp);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${
        (dateObj.getMonth() + 1).toString().padStart(2, '0')
      }/${dateObj.getFullYear()}`;

      return {
        x: formattedDate,
        y: entry.product_price
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getProductInsights = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Get product details
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get product price history
    const history = await ProductHistory.find({ product_id })
      .sort({ timestamp: 1 })
      .select('product_price timestamp');

    if (!history || history.length < 2) {
      return res.status(400).json({
        message: 'Insufficient price history for analysis. Need at least 2 data points.'
      });
    }

    // Format history data for analysis
    const formattedHistory = history.map(entry => {
      return {
        date: new Date(entry.timestamp).toISOString().split('T')[0],
        price: entry.product_price
      };
    });

    // Create prompt for analysis
    const promptText = `
    Analyze this product price history and provide useful insights:

    Product Name: ${product.product_name}
    Current Price: ${product.price}
    Original Price: ${product.original_price || 'N/A'}
    Discount: ${product.discount || '0'}%

    Price History:
    ${JSON.stringify(formattedHistory, null, 2)}

    Please provide:
    1. A summary of price trends
    2. Price volatility analysis
    3. Seasonality patterns (if any)
    4. Prediction of future price direction
    5. Best times to purchase based on historical pricing
    6. Comparative analysis with the original price
    7. Any other notable insights

    Format the response as JSON with these sections as keys and insights as values.
    `;
    // Prepare request payload for Gemini API
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };

    // Call Gemini API directly using fetch
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Gemini API:', errorData);
      return res.status(response.status).json({
        message: 'Failed to get insights from Gemini API',
        error: errorData
      });
    }

    const responseData = await response.json();

    // Extract the text from the response
    let textResponse = '';
    if (responseData.candidates && responseData.candidates.length > 0 && responseData.candidates[0].content && responseData.candidates[0].content.parts && responseData.candidates[0].content.parts.length > 0) {
      textResponse = responseData.candidates[0].content.parts[0].text;
    } else {
      return res.status(500).json({ message: 'Unexpected response format from Gemini API', data: responseData });
    }

    // Try to parse the response as JSON
    let insightsJson;
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : textResponse;
      insightsJson = JSON.parse(jsonText);
    } catch (error) {
      // If parsing fails, return the text response
      insightsJson = {
        raw_insights: textResponse,
        parsing_note: "Could not parse AI response as JSON. Displaying raw text."
      };
    }

    // Return insights with some metadata
    res.status(200).json({
      product_name: product.product_name,
      product_id: product._id,
      history_points: history.length,
      analysis_date: new Date(),
      insights: insightsJson
    });

  } catch (err) {
    console.error('Error in getProductInsights:', err);
    res.status(500).json({
      message: 'Server error while generating insights',
      error: err.message
    });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    const { category, stock } = req.query;

    if (!category || stock === undefined) {
      return res.status(400).json({ message: 'Missing category or stock query parameter.' });
    }


    const products = await Product.find({
      category : category,
      stock_status: stock,
    });

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getFilteredProductsByCompetitor = async (req, res) => {
  try {
    const { competitor_id } = req.params;
    const { category, stock } = req.query;
    //find competitor
    const competitor = await Competitor.findById(competitor_id);
    if (!competitor) {
      return res.status(404).json({ message: 'Competitor not found' });
    }

    if (!category || stock === undefined) {
      return res.status(400).json({ message: 'Missing category or stock query parameter.' });
    }

    const products = await Product.find({
      competitor: competitor.name,
      category : category,
      stock_status: stock,
    });

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};




