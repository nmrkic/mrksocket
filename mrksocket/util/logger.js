/* jshint node: true */
"use strict";

var bunyan = require("bunyan"),
    logger = bunyan.createLogger({
        name: "rabbit-ws",
        streams: [
            {
                level: "info",
                stream: process.stdout
            }
        ]
    });

module.exports = logger;
