# Shopify to Woocommerce

### Installation
```
npm install
```

### Configuration

Create a file with name: `production.env`:

```
SHOPIFY_SHOP_NAME=site-name
SHOPIFY_API_KEY=api-key-xxxxxxxxxxxxxxxx
SHOPIFY_PASSWORD_KEY=password-key-xxxxxxxxxxxxxxxx

WOO_SITE_URL=wordpress-site-url.com
WOO_CONSUMER_KEY=comsumer-key-xxxxxxxxxxxxxxxx
WOO_CONSUMER_SECRET=comsumer-secret-xxxxxxxxxxxxxxxx

SHOPIFY_PUBLIC_COUNT=https://your-shop.myshopify.com/collections/your-collection-slug/count.json
SHOPIFY_PUBLIC_PRODUCTS=https://your-shop.myshopify.com/collections/your-collection-slug/products.json
```

### Run
```
NODE_ENV=production node index.js
```