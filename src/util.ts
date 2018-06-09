import * as crypto from "crypto";
import { streamToStringRx } from 'rxjs-stream';

export const readStream = (stream: NodeJS.ReadableStream) => new Promise<string>((resolve, reject) => {
  let result = "";
  stream.on("data", buf => {
    result += buf.toString()
  })
  stream.on("end", () => {
    resolve(result)
  })
  stream.on("error", () => {
    reject
  })
})

export const streamToObservable = streamToStringRx

export const generateId = () => crypto.randomBytes(48).toString("hex");
