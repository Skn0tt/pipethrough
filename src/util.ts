import { Readable } from "stream";

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