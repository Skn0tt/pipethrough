import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import wrapAsync from "express-wrap-async";
import * as Docker from "./docker";
import http from "http";
import { generateId } from "./util";
import cors from "cors";
import * as socket from "./socket";

const app = express();
const server = new http.Server(app);

app.use(cors())

socket.setup(server);

const upload = multer({ dest: "/usr/app/uploads" });

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
    socket.addClient(id, logs);

    return res.status(200).send(id);
  })
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({ msg: err.message, stack: err.stack });
})

export const start = () => {
  server.listen(3000);
}
