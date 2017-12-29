const functions = require('firebase-functions');
const {DialogflowApp} = require('actions-on-google');
const fetch = require('node-fetch');

exports.getCryptoCurrencyPrices = functions.https.onRequest((request, response) => {

    const app = new DialogflowApp({request: request, response: response});

    const segregateData = (app) => {
        const actions = {action: app.getArgument("actions"), action1: app.getArgument("actions1")};
        const coin = app.getArgument("coins");
        const exchange = app.getArgument("exchanges");
        switch (exchange) {
            case "Koinex":
                fetch("https://koinex.in/api/ticker").then(
                    data=> {
                        return data.json()
                    }
                ).then(json => {
                    const prices = json.prices;
                    let coinPrice = "";
                    switch (coin) {
                        case "Bitcoin":
                            coinPrice = prices.BTC;
                            break;
                        case "Ethereum":
                            coinPrice = prices.ETH;
                            break;
                        case "Ripple":
                            coinPrice = prices.XRP;
                            break;
                        case "Bitcoin Cash":
                            coinPrice = prices.BCH;
                            break;
                        case "Litecoin":
                            coinPrice = prices.LTC;
                    }
                    app.ask(`<speak>Koinex supports only trading. The trade price for ${coin} is ${coinPrice} <sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                }).catch(error => {
                    console.log(error);
                    app.ask(`Sorry, there was some issue getting the price for ${coin} on ${exchange}. Please try some other exchange.`)
                });
                break;

            case "Zebpay":
                switch (coin) {
                    case "Bitcoin":
                        fetch("https://www.zebapi.com/api/v1/market/ticker/btc/inr")
                            .then(data => {
                                return data.json()
                            }).then(json => {
                            if ((((actions.action1 === "sell") || (actions.action1 === "buy")) && ((actions.action === "sell") || (actions.action === "buy"))) || actions.action === "both") {
                                app.ask(`<speak>On Zebpay, the buy price of ${coin} is ${json.buy}<sub alias="Indian Standar Rupees">INR</sub> and sell price is ${json.sell}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`)
                            } else {
                                switch (actions.action) {
                                    case "buy":
                                        app.ask(`<speak>On Zebpay, the buy price of ${coin} is ${json.buy}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                        break;
                                    case "sell":
                                        app.ask(`<speak>On Zebpay, the sell price of ${coin} is ${json.sell}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                        break;
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                            app.ask(`Sorry, there was some issue getting the price for ${coin} on ${exchange}. Please try some other exchange.`)
                        });
                        break;
                    default:
                        app.ask("Sorry, Zebpay only supports Bitcoin. For other crypto currencies try Throughbit or koinex");
                }
                break;

            case "Unocoin":
                switch (coin) {
                    case "Bitcoin":
                        fetch("https://www.unocoin.com/trade?all")
                            .then(data => {
                                return data.json()
                            }).then(json => {
                            if ((((actions.action1 === "sell") || (actions.action1 === "buy")) && ((actions.action === "sell") || (actions.action === "buy"))) || actions.action === "both") {
                                app.ask(`<speak>On Unocoin, the buy price of ${coin} is ${json.buy}<sub alias="Indian Standar Rupees">INR</sub> and sell price is ${json.sell}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`)
                            } else {
                                switch (actions.action) {
                                    case "buy":
                                        app.ask(`<speak>On Unocoin, the buy price of ${coin} is ${json.buy}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                        break;
                                    case "sell":
                                        app.ask(`<speak>On Unocoin, the sell price of ${coin} is ${json.sell}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                        break;
                                }
                            }
                        }).catch(error => {
                            console.log(error);
                            app.ask(`Sorry, there was some issue getting the price for ${coin} on ${exchange}. Please try some other exchange.`)
                        });
                        break;
                    default:
                        app.ask("Sorry, Unocoin only supports Bitcoin. For other crypto currencies try Throughbit or koinex");
                }
                break;

            case "Throughbit":
                let coinInitials = "";
                switch (coin) {
                    case "Bitcoin":
                        coinInitials = "btc";
                        break;
                    case "Ethereum":
                        coinInitials = "eth";
                        break;
                    default:
                        app.ask("Sorry, Throughbit only supports Bitcoin and Ethereum. For other crypto currencies try Koinex");
                }
                fetch(`https://www.throughbit.com/tbit_ci/index.php/cryptoprice/type/${coinInitials}/inr`)
                    .then(data => {
                        return data.json()
                    }).then(json => {
                    const data = json.data.price[0];
                    if ((((actions.action1 === "sell") || (actions.action1 === "buy")) && ((actions.action === "sell") || (actions.action === "buy"))) || actions.action === "both") {
                        app.ask(`<speak>On throughbit, the buy price of ${coin} is ${data.buy_price}<sub alias="Indian Standar Rupees">INR</sub> and sell price is ${data.sell_price}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`)
                    } else {
                        switch (actions.action) {
                            case "buy":
                                app.ask(`<speak>On throughbit, the buy price of ${coin} is ${data.buy_price}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                break;
                            case "sell":
                                app.ask(`<speak>On throughbit, the sell price of ${coin} is ${data.sell_price}<sub alias="Indian Standar Rupees">INR</sub>. Do you want to know anything else?</speak>`);
                                break;
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    app.ask(`Sorry, there was some issue getting the price for ${coin} on ${exchange}. Please try some other exchange.`)
                });
                break;
            default:
                app.ask(`Sorry, selected exchange is not supported. Please try some other exchange.`)
        }
    };

    app.handleRequest(segregateData)
});