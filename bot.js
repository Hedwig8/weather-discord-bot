// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { checker } = require('./dailyWeatherForecastChecker');

require('dotenv').config()

// Create a new client instance
const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	checker(client);
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// When the server receives a message
const commandHandler = require('./commands/Command');
client.on('messageCreate', commandHandler);