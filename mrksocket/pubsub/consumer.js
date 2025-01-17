/* jshint node: true */
"use strict";

const amqp = require("amqplib"),
    events = require("events"),
    logger = require("../util/logger"),
    emitter = new events.EventEmitter(),
    exchange = process.env.EXCHANGE_NOTIFICATION_SEND,
    eventName = "mq-event";
let channel;

exports.start = function start(url) {
    amqp.connect(url)
        .then(makeChannels)
        .then(bindAndConsume)
        .catch(abort);
};

exports.subscribe = function subscribe(callback) {
    emitter.on(eventName, callback);
};

function makeChannels(connection) {
    var promise = connection.createChannel();

    promise = promise.then(function assertExchange(mqChannel) {
        var type = "direct",
            props = { durable: false };

        channel = mqChannel;
        return channel.assertExchange(exchange, type, props);
    });

    promise = promise.then(function assertQueue() {
        var props = { exclusive: true };
        return channel.assertQueue("", props);
    });

    return promise;
}

function bindAndConsume(Q) {
    var promise = channel.bindQueue(Q.queue, exchange, "");

    promise = promise.then(function consume() {
        channel.consume(Q.queue, processMessage);
    });

    return promise;
}

function processMessage(message) {
    logger.info("message", message);
    var payload = message.content.toString();
    logger.info("Consumed: " + payload);

    channel.ack(message);
    emitter.emit(eventName, payload);
}

function abort(reason) {
    logger.error("Failed to initialize the MQ consumer. " + reason);
    process.exit(1);
}
