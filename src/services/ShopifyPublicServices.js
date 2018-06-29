const request = require('request-promise-native');

const _requestJSON = (url, query = {}) => {
    return request({
        uri: url,
        qs: query,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        },
        json: true
    }).catch(error => {
        console.log(error);
    });
};

exports.getProductsByUrl = (url, options) => {
    const defaultOptions = {
        page: 1,
        limit: 2
    };

    const {page, limit} = Object.assign({}, defaultOptions, options);
    const maxLimit = 250;

    const pageValidated = page && page > 0 ? parseInt(page, 10) : 1;
    const limitValidated = limit && limit > 0 && limit <= maxLimit ? parseInt(limit, 10) : 50;

    return _requestJSON(url, {page: pageValidated, limit: limitValidated})
        .then(response => {
            if (response && response.products && Array.isArray(response.products)) {
                return response.products;
            }

            return [];
        });
};

exports.countProductsByUrl = (url) => {
    return _requestJSON(url)
        .then(response => {
            if (response && response.collection) {
                const {collection} = response;

                if (collection && collection.products_count) {
                    return parseInt(collection.products_count, 10);
                }
            }

            return 0;
        });
};