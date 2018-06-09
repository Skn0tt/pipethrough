import { Observable } from "rxjs";
import { Server } from "http";
import * as socket from "socket.io";
import { SOCKET_COMPLETE, SOCKET_DATA, SOCKET_ERROR } from "pipethrough-shared";

let io: socket.Server | null = null;

const clients = new Map<string, Observable<string>>();

export const addClient = (id: string, logs$: Observable<string>) =>
  clients.set(id, logs$);

const error = (s: socket.Socket, id: string) => (e: Error) => {
  s.emit(SOCKET_ERROR, e);
  disconnect(s, id);
};

const complete = (s: socket.Socket, id: string) => () => {
  s.emit(SOCKET_COMPLETE);
  disconnect(s, id);
};

const data = (s: socket.Socket, id: string) => (d: string) => {
  s.emit(SOCKET_DATA, d);
};

const disconnect = (s: socket.Socket, id: string) => () => {
  s.disconnect();
  clients.delete(id);
};

export const setup = (srv: Server) => {
  const io = socket(srv);

  io.on("connection", socket => {
    const id = socket.handshake.query.id as string | undefined;
    if (!id) {
      console.error("No ID given.");
      return;
    }
    console.log(`Client connected: ${id}`);

    const log = clients.get(id);
    if (!log) {
      console.error("ID not found.");
      return;
    }

    log.subscribe(data(socket, id), error(socket, id), complete(socket, id));
  });
};
