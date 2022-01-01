import {request, server} from 'websocket';
import * as http from 'http';
import {Server} from "http";
import {readFileSync} from "fs";

let _httpServer: Server;
let _playlist: unknown[];

export function start (port: number, playlist: unknown[]) {
    _playlist = playlist;

    _httpServer = http.createServer((_request, _response) => {
        // process HTTP request. Since we're writing just WebSockets
        // server we don't have to implement anything.
    });
    _httpServer.listen(port, () => {
        console.log(`WebSocket server is ready: ws://localhost:${port}`);
    });

    // create the server
    const wsServer = new server({
        httpServer: _httpServer
    });

    // WebSocket server
    wsServer.on('request', (request) => handleConnection(request));
}

export function stop() {
    _httpServer.close();
}

function handleConnection(request: request) {
  const connection = request.accept(undefined, request.origin);
  let index = 0;

  console.log("client connected");

  // send the first message
  sendMessageFromPlaylist();

  // send message from playlist every interval
  const interval = setInterval(() => sendMessageFromPlaylist(), 2000);

  // stop the interval upon client close connection
  connection.on('close', (_connection) => {
    console.log("client disconnected");
    clearInterval(interval);
  });

  function sendMessageFromPlaylist() {
    connection.send(JSON.stringify(_playlist[index]));
    index = (index + 1) % _playlist.length;
  }
}


start(1337, JSON.parse(readFileSync('./playlist.json').toString()));
