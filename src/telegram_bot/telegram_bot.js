'use strict';
process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');


class smarketbot {
    constructor(tokenPath) {
        this.tokenIsNotPresent = ! fs.existsSync(tokenPath);
        if (this.tokenIsNotPresent) {
            console.error('The bot can not be created without token');
        }
        else{
            let token = fs.readFileSync(tokenPath).toString().split('\n')[0];
            let options = {
                port: 443,
                polling: true
            };
            this.bot = new TelegramBot(token, options);
            this.arrayOfChat = [];
            this.setUpSubscribeAction();
            this.setUpUnsubscribeAction();
        }
    }

    setUpUnsubscribeAction() {
        this.bot.onText(/^(\/unsubscribe$)/, (msg, match) => {
            const chatId = msg.chat.id;
            if (this.arrayOfChat.includes(chatId)) {
                this.arrayOfChat.splice(this.arrayOfChat.indexOf(chatId), 1);
                console.log('bot subscribers number: ' + this.arrayOfChat.length);
                this.bot.sendMessage(chatId, 'Your subscription is removed');
            }
            else {
                this.bot.sendMessage(chatId, 'Your subscription was removed yet');
            }
        });
    }

    setUpSubscribeAction() {
        this.bot.onText(/^(\/subscribe$)/, (msg, match) => {
            const chatId = msg.chat.id;
            if (this.arrayOfChat.includes(chatId)) {
                this.bot.sendMessage(chatId, 'Your subscription was accepted yet');
            }
            else {
                this.arrayOfChat.push(chatId);
                console.log('bot subscribers number: ' + this.arrayOfChat.length);
                this.bot.sendMessage(chatId, 'Your subscription is accepted');
            }
        });
    }

    brodcastMessage(message) {
        if (this.tokenIsNotPresent) {
            console.error('The bot can not brodcast a message without token');
        }
        else {
            for (let i = 0, len = this.arrayOfChat.length; i < len; i++) {
                let chatId = this.arrayOfChat[i];
                this.bot.sendMessage(chatId, message);
            }
        }
    }
}

module.exports = smarketbot;