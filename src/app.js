const ShopifyServices = require('./services/ShopifyServices');

ShopifyServices.on('callLimits', limits => console.log(limits));


const _count = () => {
    ShopifyServices.product.count().then(response => {
        console.log(response);
    });
};


setInterval(_count, 500);

