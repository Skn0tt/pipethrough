import { Observable } from "rxjs";
import { Server } from "http";
import socket, { Socket } from "socket.io";

let io: socket.Server | null = null;

const clients = new Map<string, Observable<string>>();

export const addClient = (id: string, logs$: Observable<string>) => clients.set(id, logs$);

const ERROR = "error";
const error = (s: Socket, id: string) => (e: Error) => {
  s.emit(ERROR, e);
  disconnect(s, id);
}

const COMPLETE ="complete";
const complete = (s: Socket, id: string) => () => {
  s.emit(COMPLETE);
  disconnect(s, id);
}

const DATA = "data";
const data = (s: Socket, id: string) => (d: string) => {
  s.emit(DATA, d);
}

const disconnect = (s: Socket, id: string) => () => {
  s.disconnect();
  clients.delete(id);
}

export const setup = (srv: Server) => {
  const io = socket(srv);

  io.on("connection", socket => {
    const id = socket.handshake.query.id as string | undefined;
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
  
    log.subscribe(
      data(socket, id),
      error(socket, id),
      complete(socket, id)
    )
  })
}
