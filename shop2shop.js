require('colors');

/**
 * Load config.
 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const fileEnv = __dirname + `/${env}.env`;
require('dotenv').config({
    path: fileEnv
});

/**
 * Production migrations.
 */
require('./src/migrations/productToShopify');