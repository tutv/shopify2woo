const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

const _addVariationToProduct = (productId, variation) => {
    return WooServices.post(`products/${productId}/variations`, variation);
};

exports.addVariationsToProduct = (productId, variations) => {
    return Promise.map(variations, variation => {
        return _addVariationToProduct(productId, variation);
    }, {concurrency: 10});
};