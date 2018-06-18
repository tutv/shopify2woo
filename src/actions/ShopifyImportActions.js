const ShopifyImportServices = require('../services/ShopifyImportServices');
const Promise = require('bluebird');

const _addImageToVariant = (args) => {
    const {id, image_id} = args;

    return ShopifyImportServices.productVariant.update(id, {
        image_id
    }).then(variant => {
        console.log(variant.id);

        return variant;
    }).catch(error => {
        console.log(error);

        throw error;
    });
};

const _updateVaraints = (productId, variants) => {
    return ShopifyImportServices.product.update(productId, {
        variants
    }).then(product => {
        console.log('update product', productId);

        return product;
    }).catch(error => {
        console.log('update error');

        throw error;
    });
};

exports.createProduct = (product) => {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const images = Array.isArray(product.images) ? product.images : [];
    const options = Array.isArray(product.options) ? product.options : [];
    const variantsValidated = variants.map(variant => {
        return {
            title: variant.title || "",
            price: variant.price || "",
            sku: variant.sku || "",
            position: variant.position || "",
            option1: variant.option1 || "",
            option2: variant.option2 || "",
            option3: variant.option3 || "",
            compare_at_price: variant.compare_at_price || "",
        }
    });

    const imagesValidated = images.map(image => ({
        src: image.src || ""
    }));

    const optionsValidated = options.map(option => ({
        name: option.name || "",
        values: option.values || [],
    }));

    const imageIndexing = variants.map(variant => {
        const image_id = variant.image_id || '';

        if (!image_id) {
            return 0;
        }

        const image = images.find(image => image.id === image_id);
        if (!image || !Number.isInteger(image.position)) {
            return 0;
        }

        return parseInt(image.position, 10) - 1;
    });


    const data = {
        title: product.title,
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_type: product.product_type || "",
        tags: product.tags || "",
        variants: variantsValidated,
        options: optionsValidated,
        images: imagesValidated
    };

    return ShopifyImportServices.product.create(data)
        .then(product => {
            if (typeof product !== "object" || !product.id) {
                throw product;
            }

            return Promise.resolve(product);
        })
        .then(product => {
            const {id, images, image} = product;

            console.log('CREATED_PRODUCT'.yellow, id);

            const variantsWithImages = variantsValidated.map((variant, index) => {
                const indexImage = imageIndexing[index];

                const image = images[indexImage] || image;

                return Object.assign({}, variant, {
                    image_id: image.id,
                });
            });

            return _updateVaraints(id, variantsWithImages);
        });
};