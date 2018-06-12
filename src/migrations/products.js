const ShopifyActions = require('../actions/ShopifyActions');
const WooActions = require('../actions/WooActions');
const Promise = require('bluebird');

const PER_PAGE = 1;

const _migration = totalPage => (page = 1) => {
    console.log('Page: ', page);
    const pages = Math.ceil(totalPage / PER_PAGE) || 1;

    return ShopifyActions.getProducts(page, PER_PAGE)
        .then(products => {
            return Promise.map(products, (product) => {
                return _import(product);
            }, {concurrency: 1});
        })
        .then(imports => {
            if (page < pages) {
                return _migration(totalPage)(page + 1);
            }

            return Promise.resolve(true);
        });
};

const _import = (product) => {
    const defaultProduct = {
        id: '',
        title: '',
        body_html: '',
        variants: [],
        options: [],
        handle: '',
        images: [],
        image: {},
        published_at: '',
        tags: '',
    };

    const {title, handle, body_html, id, options, variants, tags, images} = Object.assign({}, defaultProduct, product);

    const productImages = images.map((image, index) => {
        return {
            position: index,
            src: image.src
        };
    });

    const attributes = options.map((option, index) => {
        const {values, name, position} = option;

        return {
            name,
            position,
            options: values,
            visible: true,
            variation: true,
        }
    });

    const args = {
        name: title || '',
        type: 'variable',
        short_description: body_html,
        images: productImages,
        slug: handle,
        attributes,
    };

    const productVariants = variants.map(variant => {
        const {sku, price, option1, option2, option3, compare_at_price} = variant;

        return {
            regular_price: price,
            sale_price: compare_at_price ? compare_at_price : '',
            sku,
            attributes: [
                {
                    option: option1,
                },
                {
                    option: option2,
                },
                {
                    option: option3,
                }
            ]
        };
    });

    return WooActions.createProduct(args)
        .then(product => {
            const productId = product.id;

            return WooActions.createVariants(productId, productVariants);
        });
};

ShopifyActions.getTotalProduct()
    .then(total => {
        console.log('Total products:', total);

        _migration(total)(1);
    });