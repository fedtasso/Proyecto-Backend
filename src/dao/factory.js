import config from '../config/config.js'

export let Product

switch (config.persistence) {
    case 'MONGO':
        const { default: ProductMongoDAO } = await import('./product.mongo.dao.js')
        Product = ProductMongoDAO
        break;
    case 'FILE':
        const { default: ProductFileDAO } = await import('./product.file.dao.js')
        Product = ProductFileDAO
        break;

    default:
        break;
}