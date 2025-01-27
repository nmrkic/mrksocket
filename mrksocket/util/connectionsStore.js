const logger = require("../util/logger");
let activeConnections = {},
    unauthorisedConnections = {};

handleAuthorization = function handleAuthorization(request) {
    let ws = unauthorisedConnections[request?.data?.temp_user_id];
    if (!ws) {
        logger.error("Websocket connection not found.")
        return;
    }
    delete unauthorisedConnections[request.data.temp_user_id];
    if(request.data.status === "VALID"){
        ws.userID = request.data.user_id;
        activeConnections[request.data.user_id] = ws;
    }
    else{
        ws.send("401");
        ws.end();
    }
}

handleMessage = function handleMessage(request) {
    let ws = activeConnections[request.data.send_to];

    if (ws == null) {
        return;
    }

    let message = request.data.message;
    delete message["send_to"];

    let stringifiedMessage = JSON.stringify(message);

    ws.send(stringifiedMessage);
}

handleGroupMessage = function handleMessage(request) {
    let message = request?.data?.message
    request?.data?.send_to.forEach((user_id) => {
        let ws = activeConnections[user_id];
        if (ws !== null) {
            let stringifiedMessage = JSON.stringify(message);
            ws.send(stringifiedMessage);
        }
    });
}

handleTopicMessage = function handleMessage(request) {
    let ws = activeConnections[request.data.user_id];

    let message = request.data.message;
    let roomId = request.data.room_id;

    let stringifiedMessage = JSON.stringify(message);

    ws.publish(roomId, stringifiedMessage);
}

handleTopicAdd = function handleMessage(request) {
    let ws = activeConnections[request.data.user_id];

    let roomId = request.data.room_id;

    ws.subscribe(roomId);

    handleTopicMessage(request);
}

handleTopicDiscard = function handleMessage(request) {
    let ws = activeConnections[request.data.user_id];

    let message = request.data.message;
    let roomId = request.data.room_id;

    let stringifiedMessage = JSON.stringify(message);

    ws.publish(roomId, stringifiedMessage);

    ws.unsubscribe(roomId);
}

module.exports = { activeConnections, unauthorisedConnections, handleMessage, handleAuthorization, handleTopicAdd, handleTopicDiscard,  handleTopicMessage, handleGroupMessage};
