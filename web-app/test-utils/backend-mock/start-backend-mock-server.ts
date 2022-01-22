import {request, server} from 'websocket';
import * as serveStatic from 'serve-static';
import * as finalhandler from 'finalhandler';
import * as http from 'http';
import {Server} from "http";

let _httpServer: Server;

function start (port: number) {
    const serve = serveStatic('static/', {});

    _httpServer = http.createServer((req, res) => {
        // serve static files
        console.log((new Date()) + ' Received request for ' + req.url);
        serve(req, res, finalhandler(req, res));
    });
    _httpServer.listen(port, () => {
        console.log(`Backend server mock is ready: http://localhost:${port} and ws://localhost:${port}/ws`);
    });

    // create the server
    const wsServer = new server({
        httpServer: _httpServer,
    });

    // WebSocket server
    wsServer.on('request', (request) => handleConnection(request));
}

function handleConnection(request: request) {
  const connection = request.accept(undefined, request.origin);
  let isNextMessageIsLoading: boolean = true;
  let nextResultAvailable: boolean = true;
  let interval: NodeJS.Timeout;

  console.log("client connected");

  scheduleNextMessage(2);

  // stop the interval upon client close connection
  connection.on('close', (_connection) => {
    console.log("client disconnected");
    clearInterval(interval);
  });

  function sendMessageAndScheduleNextMessage() {
    let message: any;
    let timeoutSeconds: number;

    if (isNextMessageIsLoading) {
      message = {"type": "loading"};
      timeoutSeconds = 5;
    } else {
      message = getNextResult();
      timeoutSeconds = 15;
    }

    connection.send(JSON.stringify(message));

    isNextMessageIsLoading = !isNextMessageIsLoading;
    scheduleNextMessage(timeoutSeconds);
  }

  function scheduleNextMessage(timeoutSeconds) {
    interval = setTimeout(() => sendMessageAndScheduleNextMessage(), timeoutSeconds * 1000);
  }

  function getNextResult() {
    let result: any = {
      "type":"update",
      "lastUpdate": new Date().getTime()
    };

    if (nextResultAvailable) {
      result = {
        ...result,
        "slots": [
          {"available": true},
          {"available": false},
          {"available": true},
          {"available": true},
          {"available": true},
        ],
        "image": "images/image--available.jpeg",
      };
    } else {
      result = {
        ...result,
        "slots": [
          {"available": false},
          {"available": false},
          {"available": false},
          {"available": false},
          {"available": false},
        ],
        "image": "images/image--not-available.jpeg",
      };
    }

    nextResultAvailable = !nextResultAvailable;
    return result;
  }
}

start(1337);
