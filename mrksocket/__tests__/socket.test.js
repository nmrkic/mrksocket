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

test('test group message', async () => {
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
    const ws1 = new wsc.WebSocket(
        'ws://localhost:8101', {
            headers: {
                Authorization: "Bearer testtoken2",
            }
        }
    );
    await WaitForPromise(ws);
    await WaitForPromise(ws1);
    ws.onmessage = jest.fn()
    ws1.onmessage = jest.fn()
    jest.spyOn(ws, "onmessage").mockImplementation(() => {});
    jest.spyOn(ws1, "onmessage").mockImplementation(() => {});

    let temp_user_id = mockFunction.mock.calls[0][0]['message']['temp_user_id']
    let temp_user_id_2 = mockFunction.mock.calls[1][0]['message']['temp_user_id']
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
          "method": "auth",
          "status": "VALID",
          "temp_user_id": temp_user_id_2,
          "user_id": 2,
          "message": "Connection has been accepted"
        }
    }
    socket.execute(JSON.stringify(accept_conn))
    accept_conn = {
        "data": {
          "method": "group_message",
          "send_to": [1,2],
          "message": {
            "from": 1,
            "message": "Direct message"
          }
        }
    }
    socket.execute(JSON.stringify(accept_conn))
    await sleep(500)
    logger.info("ws send has been called", ws.onmessage.mock.calls)
    logger.info("ws send has been called", ws1.onmessage.mock.calls)
    ws.close();
    app.close();

    expect(ws.onmessage.mock.calls.length).toBe(1);
    expect(ws1.onmessage.mock.calls.length).toBe(1);
    jest.restoreAllMocks()
});
