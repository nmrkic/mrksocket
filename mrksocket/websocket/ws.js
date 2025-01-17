const uWS = require("uWebSockets.js"),
  logger = require("../util/logger"),
  events = require("events"),
  eventName = "ws-received",
  connectionsStore = require("../util/connectionsStore"),
  emitter = new events.EventEmitter(),
  { v4: uuidv4 } = require('uuid'),
  port = 8100;

function start() {
  const app = uWS
    .App()
    .ws("/*", {
      upgrade: (res, req, context) => {
        logger.info("Connecting..");
        let token = req.getQuery("token");
        if (!token) {
          const authHeader = req.getHeader("authorization");
          token = authHeader && authHeader.split(" ")[1];
        }

        const userID = uuidv4();

        res.upgrade(
          { userID, token },
          req.getHeader("sec-websocket-key"),
          req.getHeader("sec-websocket-protocol"),
          req.getHeader("sec-websocket-extensions"),
          context
        );
      },
      open: (ws) => {
        connectionsStore.unauthorisedConnections[ws.userID] = ws;
        data = {
          method: "auth",
          message: {
            token: ws.token,
            temp_user_id: ws.userID,
          },
        };
        emitter.emit(eventName, data);
        logger.info(`User connected: ${ws.userID}`);
      },
      message: (ws, message, isBinary) => {
        let receivedMessage;
        if (isBinary) {
          receivedMessage = Buffer.from(message).toString();
        } else {
          receivedMessage = message;
        }
        const decoder = new TextDecoder();
        receivedMessage = decoder.decode(message);
        let jsonReceivedMessage = JSON.parse(receivedMessage);
        logger.info(`Message from user ${ws.userID}: ${receivedMessage}`);

        ws.subscribe();

        jsonReceivedMessage["message"]["token"] = ws.token;

        emitter.emit(eventName, jsonReceivedMessage);
      },
      close: (ws) => {
        data = {
          method: "close_connection",
          message: {
            user_id: ws.userID,
            token: ws.token,
          },
        };

        emitter.emit(eventName, data);
        delete connectionsStore.activeConnections[ws.userID];
        logger.info(`User deleted: ${ws.userID}`);
      },
    })
    .listen(port, (token) => {
      if (token) {
        logger.info(`WebSocket server listening on port ${port}`);
      } else {
        logger.error(`Failed to listen on port ${port}`);
      }
    });
}

subscribe = function subscribe(callback) {
  emitter.on(eventName, callback);
};

execute = function execute(request) {
  try {
    logger.info(`Received from rabbit ${request}`);
    request = JSON.parse(request);
    if (request.data.method === "auth") {
      connectionsStore.handleAuthorization(request);
    } else if (request.data.method === "direct_message") {
      connectionsStore.handleMessage(request);
    } else if (request.data.method === "group_message") {
      connectionsStore.handleGroupMessage(request);
    } else if (request.data.method === "topic_send") {
      connectionsStore.handleTopicMessage(request);
    } else if (request.data.method === "topic_add") {
      connectionsStore.handleTopicAdd(request);
    } else if (request.data.method === "topic_discard") {
      connectionsStore.handleTopicDiscard(request);
    }
  } catch (e) {
    logger.error(`Application caught an error in application handlers: ${e}`);
  }
};

module.exports = { start, subscribe, execute };
