const WooCommerceAPI = require('woocommerce-api');
const getEnv = require('../helpers/getEnv');

const config = getEnv('/woocommerce');

const WooCommerce = new WooCommerceAPI(config);

const _handleResponse = (raw) => {
    const response = raw.toJSON();
    const {body} = response;

    try {
        const object = JSON.parse(body);

        return Promise.resolve(object);
    } catch (error) {
        throw new Error('Parse error!');
    }
};

exports.get = url => {
    return WooCommerce.getAsync(url)
        .then(_handleResponse);
};

exports.post = (url, data = {}) => {
    return WooCommerce.postAsync(url, data)
        .then(_handleResponse);
};

exports.put = (url, data = {}) => {
    return WooCommerce.putAsync(url, data)
        .then(_handleResponse);
};