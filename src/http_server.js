const http = require("http");
var CryptoJS = require("crypto-js");
const smarketbot = require('./telegram_bot/telegram_bot');
const bot = new smarketbot('telegram_bot/token');
const server = http.createServer();

server.on('request', (request, response) => {
    const {headers, method, url} = request;
    console.log(`[${method}] \n\turl: ${url}, \n\tuser_agent: ${headers['user-agent']}, \n\tremote_address: ${response.socket.remoteAddress}`);
    if (method == 'POST') {
        let body = [];
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            let bytes = CryptoJS.AES.decrypt(body.toString(), 'password');
            let plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if(plaintext !== '') {
                bot.brodcastMessage(plaintext);
            }
        });
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Done\n');
    }
    else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('You Made a GET\n');
    }
});

server.listen(8081);
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');