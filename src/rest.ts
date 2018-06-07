import express, { Request, Response } from "express";
import multer from "multer";
import * as config from "./config";
import wrapAsync from "express-wrap-async";
import * as Docker from "./docker";
import { NextFunction } from "express-serve-static-core";

const app = express();

const upload = multer({ dest: "/Users/skn0tt/Documents/dev/tmp/pipethrough/uploads/" });

app.post("/pipe",
  upload.any(),
  wrapAsync(async (req: Request, res: Response) => {
    const { files = {} } = req;

    const logs = await Docker.pipe(files as Express.Multer.File[]);

    return res.status(200).send(logs);
  })
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({ msg: err.message, stack: err.stack });
})

export const start = () => {
  app.listen(3000);
}