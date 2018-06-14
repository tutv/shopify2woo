/**
 * Load config.
 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const fileEnv = __dirname + `/${env}.env`;
require('dotenv').config({
    path: fileEnv
});

const WooActions = require('./src/actions/WooActions');


WooActions.checkExistBySlug('a-failure')
.then(exist => {
    console.log(exist);
});