# WebSocket Service

---

## **Setup Service**

1. **Install Dependencies**

   - To install dependencies locally from `package.json`:
     ```bash
     npm install
     ```

   - Alternatively, install packages using the Makefile:
     ```bash
     make env
     ```

2. **Install Hot-Reload Tools (Optional)**

   - To install **nodemon** globally:
     ```bash
     npm install -g nodemon
     ```

   - To install **nodemon** locally for development only:
     ```bash
     npm install --only=dev
     ```

---

## **Start Service**

### Starting Options

1. **Run without Hot-Reload (via Makefile)**  
   ```bash
   cd websocket
   make run
   ```

2. **Run with Hot-Reload (via npm)**  
   ```bash
   cd websocket
   npm run dev
   ```

3. **Run via nodemon (installed globally)**  
   ```bash
   cd websocket
   nodemon --watch . --inspect app.js
   ```

### Required Environment Variables
The following environment variables are necessary for the service to function:

- `EXCHANGE_NOTIFICATION_SEND`
- `EXCHANGE_NOTIFICATION_RECEIVED`
- `EXCHANGE_NOTIFICATION_RECEIVED_TYPE`
- `RABBIT_URL`

---