const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

exports.getProduct = (productId) => {
    return WooServices.get(`products/${productId}`)
        .then(product => {
            // console.log(product);

            return Promise.resolve(product);
        });
};

exports.createProduct = (product) => {
    const {name} = product;
    console.log("TITLE:".yellow, `${name}`);

    return WooServices.post('products', product)
        .then(product => {
            // console.log(product);

            return Promise.resolve(product);
        });
};

const _createVariant = (productId, variant) => {
    return WooServices.post(`products/${productId}/variants`, variant);
};

exports.createVariants = (productId, variants) => {
    return Promise.map(variants, _createVariant, {
        concurrency: 1
    });
};

