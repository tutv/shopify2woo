const WooActions = require('../actions/WooActions');
const WooTagActions = require('../actions/WooTagActions');
const WooImageActions = require('../actions/WooImageActions');
const WooVariationActions = require('../actions/WooVariationActions');
const MemServices = require('../services/MemServices');
const Promise = require('bluebird');
const ms = require('ms');
const ShopifyPublicServices = require('../services/ShopifyPublicServices');

const PER_PAGE = 12;
const concurrency = 1;
const fileMem = __dirname + '/../../shopify-v2.json';

const URL_COUNT = process.env.SHOPIFY_PUBLIC_COUNT || '';
const URL_PRODUCTS = process.env.SHOPIFY_PUBLIC_PRODUCTS || '';

const _migration = totalPage => (page = 1) => {
    console.log('Page: ', page);
    MemServices.saveCurrentPage(page);
    const pages = Math.ceil(totalPage / PER_PAGE) || 1;

    return ShopifyPublicServices
        .getProductsByUrl(URL_PRODUCTS, {
            limit: PER_PAGE,
            page
        })
        .then(products => {
            return Promise.map(products, (product) => {
                return _import(product);
            }, {concurrency});
        })
        .then(() => {
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

    console.log('START_IMPORT_PRODUCT:'.green, id);

    const productImages = images.map((image, index) => {
        return {
            position: index,
            src: image.src,
            alt: ''
        };
    });

    const attributes = options.map((option, index) => {
        const {values, name, position} = option;

        return {
            name,
            position,
            options: values,
            visible: false,
            variation: true,
        }
    });

    const args = {
        name: title || '',
        type: 'variable',
        description: body_html,
        slug: handle,
        attributes
    };

    const startTime = Date.now();

    return WooActions.checkExistBySlug(handle)
        .then(exist => {
            console.log('PRODUCT_EXIST:'.yellow, exist);

            if (exist) {
                return WooActions.getProductBySlug(handle);
            }

            return WooActions.createProduct(args)
        })
        .then(product => {
            if (product.code) {
                console.error(product.message);

                throw new Error(product.message);
            }

            const productId = product.id;
            console.log('PRODUCT_WOO:'.yellow, productId);

            return WooTagActions.addTagsToProduct(productId, tags)
                .then(() => {
                    return WooImageActions.addImagesToProduct(productId, productImages);
                })
                .then((product) => {
                    const imagesProduct = product.images || [];

                    const productVariants = variants.map(variant => {
                        const {sku, price, option1, option2, option3, compare_at_price, image_id} = variant;
                        const img = images.find(image => image.id === image_id);
                        const imagePosition = img ? img['position'] : false;

                        const attributes = [];

                        if (options[0] && options[0].name) {
                            attributes.push({
                                id: 0,
                                name: options[0].name,
                                option: option1,
                            });
                        }

                        if (options[1] && options[1].name) {
                            attributes.push({
                                id: 0,
                                name: options[1].name,
                                option: option2,
                            });
                        }

                        if (options[2] && options[2].name) {
                            attributes.push({
                                id: 0,
                                name: options[2].name,
                                option: option3,
                            });
                        }

                        return {
                            image: {
                                id: (imagePosition !== false && imagesProduct[imagePosition - 1]) ? imagesProduct[imagePosition - 1].id : null
                            },
                            regular_price: price,
                            sale_price: compare_at_price ? compare_at_price : '',
                            sku,
                            attributes
                        };
                    });

                    return WooVariationActions.addVariationsToProduct(productId, productVariants);
                });
        })
        .then(result => {
            const stopTime = Date.now();
            const totalTime = stopTime - startTime;
            console.log('TIME:'.yellow, ms(totalTime));
            console.log('----------------------------------\n'.green);

            return Promise.resolve(result);
        })
        .catch(error => {
            console.error('IMPORT_PRODUCT_ERROR:'.red, id);
            console.error('ERROR'.red, error);

            console.error('----------------------------------\n'.red);
        });
};

/**
 * Run now.
 */
ShopifyPublicServices.countProductsByUrl(URL_COUNT)
    .then(total => {
        console.log('Total products:', total);

        const startTime = Date.now();
        const startPage = MemServices.getStartPage(fileMem);

        _migration(total)(startPage)
            .then(done => {
                console.log('DONE', ms(Date.now() - startTime));
            });
    });
