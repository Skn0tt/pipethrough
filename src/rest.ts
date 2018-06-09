import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import wrapAsync from "express-wrap-async";
import * as Docker from "./docker";
import socket from "socket.io";
import http from "http";
import { generateId } from "./util";
import { Observable } from "rxjs";
import cors from "cors";

const app = express();
const server = new http.Server(app);

app.use(cors())

const io = socket(server);

const clients = new Map<string, Observable<string>>();

io.on("connection", socket => {
  const id = socket.handshake.query.id as string | undefined;
  if (!id) {
    console.error("No ID given.");
    return;
  }
  console.log(`Client connected: ${id}`)

  const log = clients.get(id);
  if (!log) {
    console.error("ID not found.");
    return;
  }

  log.subscribe(
    s => socket.emit("data", s),
    e => socket.emit("error", e),
    () => socket.emit("complete")
  )
})

const upload = multer({ dest: "/Users/skn0tt/Documents/dev/tmp/pipethrough/uploads/" });

app.post("/pipe",
  upload.any(),
  wrapAsync(async (req: Request, res: Response) => {
    const { files = [] } = req;

    const logs = await Docker.pipe(files as Express.Multer.File[]);

    return res.status(200).send(logs);
  })
)

app.post("/pipe/socket",
  upload.any(),
  wrapAsync(async (req: Request, res: Response) => {
    const { files = [] } = req;

    const logs = await Docker.pipeRx(files as Express.Multer.File[]);
    const id = generateId();
    clients.set(id, logs);

    return res.status(200).send(id);
  })
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({ msg: err.message, stack: err.stack });
})

export const start = () => {
  server.listen(3000);
}