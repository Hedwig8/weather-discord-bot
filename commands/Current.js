const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { MessageEmbed } = require('discord.js');
const { locationIndex, currentWeather } = require('../api/accuWeather');

// inside a command, event listener, etc.
const cityEmbed = (city, description, temp, rain, humidity) => {
    return new MessageEmbed()
	    .setColor('#e0995e')
	    .setTitle(city)
        .setDescription('Current weather description: '+description)
	    .addFields(
		    //{ name: '\u200B', value: '\u200B' },
		    { name: 'Temperature', value: Math.round(temp) + 'ºC', inline: true },
		    { name: 'Rain', value: rain ? 'Yes' : 'No', inline: true },
            { name: 'Humidity', value: humidity + ' %', inline : true},
	    )
	    .setTimestamp()
}

module.exports = function current(message, args) {
    if (args.length == 0) {
        message.channel.send('Include location name');
        return;
    }
    let fullNameCity = args.join(' ');
    locationIndex(fullNameCity, (json) => {
        if (json.length > 0) {
            city = json[0];
            currentWeather(city.Key, (json) => {
                weather = json[0];
                message.channel.send({embeds: [cityEmbed(city.LocalizedName, weather.WeatherText, weather.Temperature.Metric.Value, weather.HasPrecipitation , weather.RelativeHumidity)]});
            });
        } else {
            message.channel.send('Error: Nothing found when fetching data of \'' + fullNameCity + '\'');
        }
    });
}