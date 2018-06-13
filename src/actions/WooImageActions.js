const WooServices = require('../services/WooServices');

const _delay = (timeout) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, timeout);
    });
};

exports.addImagesToProduct = (productId, images) => {
    console.log("IMAGES:".yellow, images.length);
    const totalImages = images.length;

    const data = {
        images
    };

    return WooServices.put(`products/${productId}`, data)
        .then(response => {
            return response;
        })
        .catch(error => {
            // console.log('PUT_FAILED', error);

            return _delay(totalImages * 2000)
                .then(() => {
                    return WooServices.get(`products/${productId}`);
                })
                .then(product => {
                    const {images} = product;

                    if (totalImages > 1 && images.length <= 1) {
                        return _delay(totalImages * 3000)
                            .then(() => {
                                return WooServices.get(`products/${productId}`);
                            });
                    }

                    return Promise.resolve(product);
                })
                .then(product => {
                    console.log('DOWNLOADED_IMAGES:'.yellow, product.images.length);

                    return Promise.resolve(product);
                });
        });
};