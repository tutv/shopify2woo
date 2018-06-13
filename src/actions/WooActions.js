const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

exports.createProduct = (product) => {
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

const _convertTags = (tags) => {
    const str = (tags + "").split(',');

    return str.map(str => str.trim())
        .filter(str => !!str);
};

const _searchTag = (tagString) => {
    return WooServices
        .get(`products/tags?search=${tagString}`)
        .then(tags => {
            return tags.filter(tag => {
                const {name} = tag;

                if (!name) {
                    return false;
                }

                return name.toLowerCase() === tagString.toLowerCase();
            });
        })
        .then(tags => {
            if (!tags || !Array.isArray(tags) || !tags.length) {
                return Promise.resolve(false);
            }

            return tags[0]['id'];
        });
};

const _createTag = tag => {
    const data = {
        name: tag
    };

    return WooServices.post('products/tags', data)
        .then(tag => {
            return tag['id'];
        });
};

const _getTagId = (tag) => {
    return _searchTag(tag)
        .then(tagId => {
            if (!tagId) {
                return _createTag(tag);
            }

            return tagId;
        });
};

exports.searchTag = _getTagId;

exports.addTagsToProduct = (productId, tags) => {
    const tagsValidated = Array.isArray(tags) ? tags : _convertTags(tags);

    return Promise.map(tagsValidated, tag => _getTagId(tag))
        .then(tagIds => {
            const data = {
                tags: tagIds.map(id => ({
                    id
                }))
            };

            return WooServices.put(`products/${productId}`, data);
        });
};