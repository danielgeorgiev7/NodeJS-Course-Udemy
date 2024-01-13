const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
// const slugify = require('slugify');

// //SYNC
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
// console.log(textOut);
// fs.writeFileSync('./txt/output.txt', textOut);

// //ASYNC
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR! 💥');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!😁');
//             });
//         });
//     });
// });

// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // Overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{{productCards}}', cardsHtml);

        res.end(output);
    }

    // Product
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }

    // Api
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    }

    // Not Found
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('Page not found!');
    }

});

server.listen(5000, '127.0.0.1', () => {
    console.log('Listening to requests on port 5000');
});