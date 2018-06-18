const ShopifyActions = require('../actions/ShopifyActions');
const ShopifyImportActions = require('../actions/ShopifyImportActions');
const MemServices = require('../services/MemServices');
const Promise = require('bluebird');
const ms = require('ms');

const PER_PAGE = 12;
const fileMem = __dirname + '/../../shopify.json';

const _migration = totalPage => (page = 1) => {
    console.log('Page: ', page);
    MemServices.saveCurrentPage(page, fileMem);
    const pages = Math.ceil(totalPage / PER_PAGE) || 1;

    return ShopifyActions.getProducts(page, PER_PAGE)
        .then(products => {
            return Promise.map(products, (product) => {
                return _import(product);
            }, {concurrency: 1});
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
    console.log('TITLE:'.yellow, `${title}`);

    const startTime = Date.now();

    return ShopifyImportActions.createProduct(product)
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

ShopifyActions.getTotalProduct()
    .then(total => {
        console.log('Total products:', total);

        const startTime = Date.now();
        const startPage = MemServices.getStartPage(fileMem);

        _migration(total)(startPage)
            .then(done => {
                console.log('DONE', ms(Date.now() - startTime));
            });
    });

