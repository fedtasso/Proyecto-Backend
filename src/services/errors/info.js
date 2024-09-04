export const generateProductErrorInfo = product => {
    return `Uno o más properties están incompletos o no son válidos.
    Lista de properties válidos:
        - title: Must be a string (${product.title})
        - description: Must be a string (${product.description})
        - code: Must be a string (${product.code})
        - price: Must be a number (${product.price})
        - stock: Must be a number (${product.stock})
        - category: Must be a string (${product.category})
    `
}