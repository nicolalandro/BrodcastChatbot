const http = require("http");
const smarketbot = require('./telegram_bot/telegram_bot');
const bot = new smarketbot('telegram_bot/token');


http.createServer(function (request, response) {
    if (request.method == 'POST') {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello Post\n');
    }
    else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello World\n');
    }
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');