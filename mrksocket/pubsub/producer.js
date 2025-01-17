/* jshint node: true */
"use strict";

const amqp = require("amqplib"),
    logger = require("../util/logger"),
    { v4: uuidv4 } = require('uuid'),
    exchange = process.env.EXCHANGE_NOTIFICATION_RECIEVED,
    exchange_type = process.env.EXCHANGE_NOTIFICATION_RECIEVED_TYPE,
    exchange_listen = process.env.EXCHANGE_NOTIFICATION_SEND;
let channel;

exports.start = function start(url) {
    amqp.connect(url).then(assertExchange).catch(abort);
};

exports.publish = function publish(data) {
    var text = JSON.stringify(data),
        context;

    logger.info(`Publishing ${text}`);
    context = new Buffer(JSON.stringify({
        "meta": {
            "correlationId": uuidv4(),
            "source": exchange_listen
        },
        "data": data
    }));
    channel.publish(exchange, "", context);
};

function assertExchange(connection) {
    var promise = connection.createChannel();

    return promise.then(function (ch) {
        var type = exchange_type,
            props = { durable: false };

        channel = ch;
        return channel.assertExchange(exchange, type, props);
    });
}

function abort(reason) {
    logger.error("Failed to initialize the MQ producer. " + reason);
    process.exit(1);
}
