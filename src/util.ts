import * as crypto from "crypto";
import { streamToStringRx } from 'rxjs-stream';
import { Observable, Subject, ReplaySubject } from "rxjs";

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

const streamToStringObservable = (s: NodeJS.ReadableStream) => streamToStringRx(s)

export const streamToReplaySubject = (s: NodeJS.ReadableStream): ReplaySubject<string> => {
  const stream$ = streamToStringObservable(s);
  const subject$ = new ReplaySubject<string>();

  stream$
    .subscribe(subject$);

  return subject$;
}

export const generateId = () => crypto.randomBytes(48).toString("hex");
