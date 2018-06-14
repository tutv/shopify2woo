const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

exports.getProduct = (productId) => {
    return WooServices.get(`products/${productId}`)
        .then(product => {
            // console.log(product);

            return Promise.resolve(product);
        });
};

exports.getProductBySlug = slug => {
    const slugValidated = (slug + "").trim();

    return WooServices
        .get(`products?slug=${slugValidated}`)
        .then(products => {
            if (!products || !products.length) {
                throw new Error('Product not found.');
            }

            return products[0];
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

exports.checkExistBySlug = slug => {
    const slugValidated = (slug + "").trim();

    return WooServices
        .get(`products?slug=${slugValidated}`)
        .then(products => {
            return products && !!products.length;
        });
};

