module.exports = (temp, product) => {
    let output = temp.replace(/{{productName}}/g, product.productName);
    output = output.replace(/{{image}}/g, product.image);
    output = output.replace(/{{price}}/g, product.price);
    output = output.replace(/{{nutrients}}/g, product.nutrients);
    output = output.replace(/{{quantity}}/g, product.quantity);
    output = output.replace(/{{description}}/g, product.description);
    output = output.replace(/{{id}}/g, product.id);
    output = output.replace(/{{notOrganic}}/, product.organic ? '' : 'not-organic');

    return output;
}


