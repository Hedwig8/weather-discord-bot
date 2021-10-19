const fs = require('fs');
const { locationIndex } = require('../api/accuWeather');

const addToJson = (city, message) => {
    fs.readFile('ActiveDailyWeatherForecast.json', (err, data) => {
        if (err) {
            console.log(err);
            return;
        } 
        let json = JSON.parse(data);
        json[message.channel.id] = json[message.channel.id] || {};
        json[message.channel.id][city.name] = city;
        fs.writeFile('ActiveDailyWeatherForecast.json', JSON.stringify(json, null, 4),function (err) {
            if (err) {
                message.channel.send('Error: \''+ err.message + '\' when trying to add \'' + city.name + '\'. Consequently, this cannot be added in active daily weather forecast. Please try again!');
                return;
            }
            message.channel.send(city.name + ' was successfully included in the active daily weather forecast!');
            console.log(json[message.channel.id][city.name]);
          });
    });
}

const add = (message, args) => {
    if (args.length == 0) {
        message.channel.send('Include location name');
        return;
    }
    let fullNameCity = args.join(' ');
    locationIndex(fullNameCity, (json) => {
        if (json.length > 0) {
            city = json[0];
            addToJson({name: city.LocalizedName, index: city.Key, hour: 9}, message);
        } else {
            message.channel.send('Error: Nothing found when searching for \'' + fullNameCity + '\'. Tip: Try to use the full name of the location. Also using the country code at the end might help. Example: \'.add Porto, PT\'');
        }
    });
}

const remove = (message, args) => {
    let fullNameCity = args.join(' ');
    fs.readFile('ActiveDailyWeatherForecast.json', (err, data) => {
        if (err) {
            console.log(err);
            return;
        } 
        let json = JSON.parse(data);
        if (json.hasOwnProperty(message.channel.id) && json[message.channel.id].hasOwnProperty(fullNameCity)) {
            delete json[message.channel.id][fullNameCity];
            fs.writeFile('ActiveDailyWeatherForecast.json', JSON.stringify(json, null, 4),function (err) {
                if (err) {
                    message.channel.send('Error: \''+ err.message + '\' when trying to remove \'' + city.name + '\'. Consequently, this cannot be removed from active daily weather forecast. Please try again!');
                    return;
                } 
                message.channel.send(fullNameCity + ' was removed from active daily weather forecast!');
            });
        } else {
            message.channel.send(fullNameCity + ' is not in the active daily weather forecast. The included locations are ' + Object.keys(json[message.channel.id]).join(', '));
        }
    });
}

module.exports = {add, remove}