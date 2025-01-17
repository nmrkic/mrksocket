let activeConnections = {},
    unauthorisedConnections = {};

handleAuthorization = function handleAuthorization(request) {
    let ws = unauthorisedConnections[request?.data?.temp_user_id];
    if (!ws) {
        console.error("Websocket connection not found.")
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
    let ws = activeConnections[request.data.message.send_to];

    if (ws == null) {
        return;
    }

    let message = request.data.message;
    delete message["send_to"];

    let stringifiedMessage = JSON.stringify(message);

    ws.send(stringifiedMessage);
}

handleGroupMessage = function handleMessage(request) {
    request?.data?.message.forEach((message) => {
        let ws = activeConnections[message.user_id];
        if (ws !== null) {
            delete message["user_id"];
            let stringifiedMessage = JSON.stringify(message);
            ws.send(stringifiedMessage);
        }
    });
}

handleTopicMessage = function handleMessage(request) {
    console.log(request.data)
    let ws = activeConnections[request.data.user_id];

    let message = request.data.message;
    let roomId = request.data.room_id;

    let stringifiedMessage = JSON.stringify(message);

    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", roomId, activeConnections)
    ws.publish(roomId, stringifiedMessage);
}

handleTopicAdd = function handleMessage(request) {
    console.log(request.data)
    let ws = activeConnections[request.data.user_id];

    let roomId = request.data.room_id;
    console.log("user", request.data.user_id, "subscribed to room", roomId, ws)

    ws.subscribe(roomId);

    handleTopicMessage(request);
}

handleTopicDiscard = function handleMessage(request) {
    console.log(request.data)
    let ws = activeConnections[request.data.user_id];

    let message = request.data.message;
    let roomId = request.data.room_id;

    let stringifiedMessage = JSON.stringify(message);

    ws.publish(roomId, stringifiedMessage);

    ws.unsubscribe(roomId);
}

module.exports = { activeConnections, unauthorisedConnections, handleMessage, handleAuthorization, handleTopicAdd, handleTopicDiscard,  handleTopicMessage, handleGroupMessage};
