const WooCommerceAPI = require('woocommerce-api');
const getEnv = require('../helpers/getEnv');

const config = getEnv('/woocommerce');

const WooCommerce = new WooCommerceAPI(config);

const _handleResponse = (raw) => {
    const response = raw.toJSON();
    const {body, statusCode} = response;

    if (parseInt(statusCode, 10) >= 300) {
        console.error('CODE', statusCode);
        console.error(body);

        throw new Error('RESPONSE FAILED');
    }

    try {
        const object = JSON.parse(body);

        return Promise.resolve(object);
    } catch (error) {
        console.log('PARSE_ERROR', JSON.stringify(response));

        throw error;
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

exports.delete = (url, data = {}) => {
    return WooCommerce.deleteAsync(url, data)
        .then(_handleResponse);
};