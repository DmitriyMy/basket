const getExchangeRate = require('../../../dataServer/getExchangeRate');
const { ApolloError } = require('apollo-server-express');

function crossCurs(currency, price, quantity) {
    return getExchangeRate()
        .then(data => {
            let crossCost = {};
            if (currency == 'RUB') {
                crossCost = {
                    RUB: price,
                    EUR: (price / data.get('EUR')).toFixed(2),
                    USD: (price / data.get('USD')).toFixed(2)
                }
            } else if (currency == 'EUR') {
                crossCost = {
                    RUB: (price * data.get('EUR')).toFixed(2),
                    EUR: price,
                    USD: ((data.get('EUR') * price) / data.get('USD')).toFixed(2)
                }
            } else if (currency == 'USD') {
                crossCost = {
                    RUB: (price * data.get('USD')).toFixed(2),
                    EUR: ((data.get('USD') * price) / data.get('EUR')).toFixed(2),
                    USD: price
                }
            } else {
                return {}
            }
            return crossCost;
        });
}

async function getCalculate(args) {
    let promises = [];
    args.input.forEach(element => {
        price = element.price * element.quantity;
        promises.push(crossCurs(element.currency, price)
                        .then(cross => {
                            return {
                                name: element.name,
                                quantity: element.quantity,
                                currency: element.currency,
                                price: element.price,
                                crossCost: cross
                            }
                        })
                        .catch(error => {
                            throw new ApolloError(`crossCurs ${error}`, {
                                timestamp: Date()
                              });
                        })
                )
    });
    return await Promise.all(promises).then(resolve => {
        return resolve;
    })
    .catch(error => {
        throw new ApolloError(`getCalculate ${error}`, {
            timestamp: Date()
          });
    })
}

module.exports = {
    Mutation: {
        getCalculate: (parent, args ,context) =>
            getCalculate(args, context)
    }
}