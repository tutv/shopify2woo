/**
 * Load config.
 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const fileEnv = __dirname + `/${env}.env`;
require('dotenv').config({
    path: fileEnv
});

/**
 * Run app.
 */
require('./src/app');