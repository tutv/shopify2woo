const Shopify = require('shopify-api-node');
const getEnv = require('../helpers/getEnv');

const config = getEnv('/shopifyDestination');

const shopify = new Shopify(config);

module.exports = shopify;