const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let currentWeather = (locationIndex, callback, err) => {
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locationIndex}?apikey=${process.env.ACCUWEATHER}&details=true`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        callback(json);
    })
    .catch((error) => {
        if (err !== undefined) err(error);
        else console.log(error);
    });
}

let daily = (locationIndex, callback, err) => {
    fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationIndex}?apikey=${process.env.ACCUWEATHER}&metric=true`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        callback(json);
    })
    .catch((error) => {
        if (err !== undefined) err(error);
        else console.log(error);
    });
}

let locationIndex = (search, callback, err) => {
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCUWEATHER}&q=${search}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        callback(json);
    })
    .catch((error) => {
        if (err !== undefined) err(error);
        else console.log(error);
    });
}

module.exports = {
    currentWeather,
    daily,
    locationIndex
}