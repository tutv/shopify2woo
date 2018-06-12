const ShopifyServices = require('../services/ShopifyServices');

exports.getProducts = (page = 1, limit = 50) => {
    return ShopifyServices.product.list({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    });
};

exports.getTotalProduct = () => {
    return ShopifyServices.product.count();
};