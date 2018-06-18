const ShopifyImportServices = require('../services/ShopifyImportServices');

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

    const data = {
        title: product.title,
        body_html: product.body_html || "",
        vendor: product.vendor || "",
        product_type: product.product_type || "",
        variants: variantsValidated,
        options: optionsValidated,
        images: imagesValidated
    };

    return ShopifyImportServices.product.create(data)
        .then(product => {
            console.log(product);

            return Promise.resolve(product);
        });
};