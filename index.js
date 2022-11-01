const TelegramApi = require("node-telegram-bot-api")
const {gameOptions, againOptions} = require("./options.js")

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const token = "token"
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = (chatId) => {
    const randomNumber = randomInteger(1, 3)
    chats[chatId] = randomNumber
    return bot.sendMessage(chatId, "Я загадал цифру от 1 до 3, угадай ее", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Начало"},
        {command: "/info", description: "Информация"},
        {command: "/game", description: "Игра"},
    ])
    
    bot.on("message", msg => {
        const text = msg.text
        const chatId = msg.chat.id
        console.log(msg)
        if (text === "/start") {
            bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp")
            return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name} ${msg.from.last_name}`)
        }
    
        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === "/game") {
            return startGame(chatId)
        }
    
        return bot.sendMessage(chatId, "Я тебя не понял")
    })

    bot.on("callback_query", msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === "/again") {
            return startGame(chatId)
        }

        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожелению ты не отгадал цифру ${chats[chatId]}`, againOptions)
        }

        
    })
}

start()
