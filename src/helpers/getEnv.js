const Confidence = require('confidence');

const data = {
    woocommerce: {
        $filter: 'env',
        $default: {
            url: process.env.WOO_SITE_URL || '',
            consumerKey: process.env.WOO_CONSUMER_KEY || '',
            consumerSecret: process.env.WOO_CONSUMER_SECRET || '',
            wpAPI: true,
            version: 'wc/v2',
            timeout: 300 * 1000
        },
        development: {
            url: 'http://shopify.loc',
            consumerKey: 'ck_80f4515beb3cecb5452affae2942c7bcda631e68',
            consumerSecret: 'cs_dfc4bd2942307c514fef038d3a2f4de3ddc380e5',
            wpAPI: true,
            version: 'wc/v2',
            timeout: 300 * 1000
        },
        production: {
            url: process.env.WOO_SITE_URL || '',
            consumerKey: process.env.WOO_CONSUMER_KEY || '',
            consumerSecret: process.env.WOO_CONSUMER_SECRET || '',
            wpAPI: true,
            version: 'wc/v2',
            timeout: 300 * 1000
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
    },
    shopifyDestination: {
        $filter: 'env',
        $default: {
            shopName: process.env.SHOPIFY_DES_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_DES_API_KEY || '',
            password: process.env.SHOPIFY_DES_PASSWORD_KEY || '',
            autoLimit: true
        },
        development: {
            shopName: process.env.SHOPIFY_DES_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_DES_API_KEY || '',
            password: process.env.SHOPIFY_DES_PASSWORD_KEY || '',
            autoLimit: true
        },
        production: {
            shopName: process.env.SHOPIFY_DES_SHOP_NAME || '',
            apiKey: process.env.SHOPIFY_DES_API_KEY || '',
            password: process.env.SHOPIFY_DES_PASSWORD_KEY || '',
            autoLimit: true
        }
    },
    wordpress: {
        $filter: 'env',
        $default: {
            endpoint: process.env.WORDPRESS_SITE_URL || '',
            username: process.env.WORDPRESS_USERNAME || '',
            password: process.env.WORDPRESS_PASSWORD || '',
        },
        development: {
            endpoint: process.env.WORDPRESS_SITE_URL || '',
            username: process.env.WORDPRESS_USERNAME || '',
            password: process.env.WORDPRESS_PASSWORD || '',
        },
        production: {
            endpoint: process.env.WORDPRESS_SITE_URL || '',
            username: process.env.WORDPRESS_USERNAME || '',
            password: process.env.WORDPRESS_PASSWORD || '',
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