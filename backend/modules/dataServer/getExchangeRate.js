const request = require('axios');

function getExchangeRate() {
    const options = {
        methode: "GET",
        url: 'https://www.cbr-xml-daily.ru/daily_json.js',
        json: true
    }
    return request(options)
            .then(responce => {
                let map = new Map();
                map.set('USD', responce.data.Valute.USD.Previous)
                map.set('EUR', responce.data.Valute.EUR.Previous)
                return map;
            })
            .catch(error => {
                console.log("getExchangeRate Error:", error);
            });
}

module.exports = getExchangeRate;