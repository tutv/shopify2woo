const WooServices = require('../services/WooServices');
const Promise = require('bluebird');

const _convertTags = (tags) => {
    const str = (tags + "").split(',');

    return str.map(str => str.trim())
        .filter(str => !!str);
};

const _searchTags = (tagString) => {
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
        });
};

const _createTag = tag => {
    if (!tag) {
        return Promise.resolve(false);
    }

    const data = {
        name: tag
    };

    return WooServices.post('products/tags', data)
        .then(tag => {
            return tag['id'];
        });
};

const _getTagId = (tag) => {
    if (!tag) {
        return Promise.resolve(false);
    }

    return _searchTags(tag)
        .then(tags => {
            if (!tags || !Array.isArray(tags) || !tags.length) {
                return false;
            }

            return tags[0]['id'];
        })
        .then(tagId => {
            if (!tagId) {
                return _createTag(tag);
            }

            return tagId;
        });
};

exports.addTagsToProduct = (productId, tags) => {
    console.log("TAGS:".yellow, tags);
    const tagsValidated = Array.isArray(tags) ? tags : _convertTags(tags);

    return Promise.map(tagsValidated, tag => _getTagId(tag), {concurrency: 1})
        .then(tagIds => {
            const data = {
                tags: tagIds
                    .filter(id => !!id)
                    .map(id => ({
                        id
                    }))
            };

            return WooServices.put(`products/${productId}`, data);
        });
};