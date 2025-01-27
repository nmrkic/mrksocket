const socket = require("../websocket/ws.js"),
    logger = require("../util/logger"),
    wsc = require('ws');

function WaitForPromise(obj) {
    return new Promise((resolve, reject) => {
        obj.onopen = () => resolve();
        obj.onerror = (err) => reject(err);
    });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('test token read from query param', async () => {

    const mockFunction = jest.fn(),
    app = socket.start(8101);
    socket.subscribe(mockFunction);

    const ws = new wsc.WebSocket('ws://localhost:8101?token=testtoken');
    await WaitForPromise(ws);
    ws.close();
    app.close();
    console.log(mockFunction.mock.calls[0][0]['message']);
    expect(mockFunction.mock.calls[0][0]['message']['token']).toBe("testtoken");

});


test('test token read from header', async () => {

    const mockFunction = jest.fn(),
    app = socket.start(8101);
    socket.subscribe(mockFunction);

    const ws = new wsc.WebSocket(
        'ws://localhost:8101', {
            headers: {
                Authorization: "Bearer testtoken",
            }
        }
    );
    await WaitForPromise(ws);
    ws.close();
    app.close();
    console.log(mockFunction.mock.calls[0][0]['message']);
    expect(mockFunction.mock.calls[0][0]['message']['token']).toBe("testtoken");

});

test('test accept connection', async () => {

    const mockFunction = jest.fn(),
    app = socket.start(8101);
    socket.subscribe(mockFunction)

    const ws = new wsc.WebSocket(
        'ws://localhost:8101', {
            headers: {
                Authorization: "Bearer testtoken",
            }
        }
    );
    await WaitForPromise(ws);
    ws.send('{ "message": "this is the new message" }')

    ws.onmessage = (message) => {
        logger.info(`Message on websocket: ${message}`)
    }
    let temp_user_id = mockFunction.mock.calls[0][0]['message']['temp_user_id']
    let accept_conn = {
        "data": {
          "method": "auth",
          "status": "VALID",
          "temp_user_id": temp_user_id,
          "user_id": 1,
          "message": "Connection has been accepted"
        }
    }
    socket.execute(JSON.stringify(accept_conn))
    accept_conn = {
        "data": {
          "method": "direct_message",
          "send_to": 2,
          "message": {
            "from": 1,
            "message": "Direct message"
          }
        }
    }
    socket.execute(JSON.stringify(accept_conn))
    await sleep(500)
    ws.close();
    app.close();

    expect(mockFunction.mock.calls[0][0]['message']['token']).toBe("testtoken");
    expect(mockFunction.mock.calls[1][0]['message']).toBe("this is the new message");
});
