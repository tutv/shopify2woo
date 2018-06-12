const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

exports.createProduct = (product) => {
    return WooServices.postAsync('products', product)
        .then(response => {
            return response.toJSON();
        })
        .then(result => {
            const {body} = result;

            try {
                const object = JSON.parse(body);

                return Promise.resolve(object);
            } catch(error) {
                throw new Error('Parse error!');
            }
        })
        .then(product => {
            console.log(product);

            return Promise.resolve(product);
        });
};

const _createVariant = (productId, variant) => {
    return WooServices.postAsync(`products/${productId}/variants`, variant);
};

exports.createVariants = (productId, variants) => {
    return Promise.map(variants, _createVariant, {
        concurrency: 1
    });
};
