const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let jsonFile;
try {
    jsonFile = require('./ActiveDailyWeatherForecast.json');
} catch {
    jsonFile = {};
    fs.writeFile('ActiveDailyWeatherForecast.json', '{}', (err) => {

    });
}
const { MessageEmbed } = require('discord.js');
const { daily } = require('./api/accuWeather')

const dailyWeatherForecastEmbed = (city, description, tempMin, tempMax, rain, humidity) => {
    return new MessageEmbed()
        .setColor('#e0995e')
        .setTitle(city)
        .setDescription('Daily weather forecast: ' + description)
        .addFields(
            //{ name: '\u200B', value: '\u200B' },
            { name: 'Temperature', value: Math.round(tempMin) + '-' + Math.round(tempMax) + 'ºC', inline: true },
            { name: 'Rain', value: rain ? 'Yes' : 'No', inline: true },
            { name: 'Humidity', value: humidity + ' %', inline: true },
        )
        .setTimestamp()
}

const getMsUntilTime = (specifiedHour) => {
    const minute = new Date().getMinutes();
    const hour = minute > 0 ? new Date().getHours() + 1 : new Date().getHours();

    const diffHour = specifiedHour - hour;
    const diffMinute = minute > 0 ? 60 - minute : 0;

    let delay = diffMinute + (diffHour < 0 ? diffHour + 24 : diffHour) * 60;
    return delay > 0 ? delay * 60 * 1000 : 1440 * 60 * 1000;
}

const sendDailyWeatherForecast = (city, channel, client) => {
    const cityObj = jsonFile[channel][city];
    
    daily(cityObj.index, (json) => {
        weather = json.DailyForecasts[0];
        console.log(weather);
        client.channels.cache.get(channel).send({ embeds: [dailyWeatherForecastEmbed(city, weather.Day.IconPhrase, weather.Temperature.Minimum.Value, weather.Temperature.Maximum.Value, weather.Day.HasPrecipitation, 0)] })
    })    
}

const checker = (client) => {
    console.log('checker: ' + new Date().getHours() + ':' + new Date().getMinutes());
    if (new Date().getMinutes() != 0) {
        setTimeout(checker.bind(null, client), (60 - new Date().getMinutes())/2 * 60 * 1000);
        return;
    }

    jsonFile = JSON.parse(fs.readFileSync('ActiveDailyWeatherForecast.json'));
    for (const channel of Object.keys(jsonFile)) {
        for (const city of Object.keys(jsonFile[channel])) {
            if (new Date().getHours() === jsonFile[channel][city].hour) {
                sendDailyWeatherForecast(city, channel, client);
            }
        }
    }
    setTimeout(checker.bind(null, client), 50*60*1000);
}

module.exports = {checker, sendDailyWeatherForecast}