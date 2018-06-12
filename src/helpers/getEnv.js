const Confidence = require('confidence');

const data = {
    woocommerce: {
        $filter: 'env',
        $default: {
            url: process.env.WOO_SITE_URL || '',
            consumerKey: process.env.WOO_CONSUMER_KEY || '',
            consumerSecret: process.env.WOO_CONSUMER_SECRET || '',
            wpAPI: true,
            version: 'wc/v2'
        },
        development: {
            url: 'http://shopify.loc',
            consumerKey: 'ck_80f4515beb3cecb5452affae2942c7bcda631e68',
            consumerSecret: 'cs_dfc4bd2942307c514fef038d3a2f4de3ddc380e5',
            wpAPI: true,
            version: 'wc/v2'
        },
        production: {
            url: process.env.WOO_SITE_URL || '',
            consumerKey: process.env.WOO_CONSUMER_KEY || '',
            consumerSecret: process.env.WOO_CONSUMER_SECRET || '',
            wpAPI: true,
            version: 'wc/v2'
        }
    },
    shopify: {
        $filter: 'env',
        $default: {
            shopName: process.env.SHOPIFY_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_API_KEY || '',
            password: process.env.SHOPIFY_PASSWORD_KEY || '',
        },
        development: {
            shopName: process.env.SHOPIFY_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_API_KEY || '',
            password: process.env.SHOPIFY_PASSWORD_KEY || '',
        },
        production: {
            shopName: process.env.SHOPIFY_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_API_KEY || '',
            password: process.env.SHOPIFY_PASSWORD_KEY || '',
        }
    }
};

const store = new Confidence.Store(data);
const criteria = {
    env: process.env.NODE_ENV || 'development'
};

module.exports = (key, defaultValue = null) => {
    return store.get(key, criteria) || defaultValue;
};