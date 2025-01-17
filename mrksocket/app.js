"use strict";

(function spawnChannels() {
    const producer = require("./pubsub/producer"),
        consumer = require("./pubsub/consumer"),
        socket = require("./websocket/ws"),
        url = process.env.RABBIT_URL;

    socket.start()

    producer.start(url);
    socket.subscribe(producer.publish);

    consumer.start(url);
    consumer.subscribe(socket.execute);
})();

process.on("uncaughtException", function (error) {
    var logger = require("./util/logger");

    logger.error("Service has crashed. Cause: " + error);
    process.exit(1);
});
