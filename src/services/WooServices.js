const WooCommerceAPI = require('woocommerce-api');
const getEnv = require('../helpers/getEnv');

const config = getEnv('/woocommerce');

const WooCommerce = new WooCommerceAPI(config);

module.exports = WooCommerce;