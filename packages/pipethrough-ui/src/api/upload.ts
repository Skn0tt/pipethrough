import { Observable } from "rxjs";
import io from "socket.io-client";
import * as R from "ramda";
import * as config from "../config";
import { SOCKET_DATA, SOCKET_COMPLETE, SOCKET_ERROR } from "pipethrough-shared";

const baseUrl = (t: TemplateStringsArray) =>
  `${location.protocol}//${location.hostname}:${config.get().PORT}${t}`;

export type UploadFiles = { [path: string]: File[] };
type Logs = Observable<string>;

export const filesToForm = (files: UploadFiles): FormData => {
  const r = new FormData();

  R.forEachObjIndexed((v, k) => {
    v.forEach(f => {
      r.append("" + k, f, f.name);
    });
  }, files);

  return r;
};

export const upload = async (files: UploadFiles): Promise<Logs> => {
  const res = await fetch(baseUrl`/pipe/socket`, {
    method: "POST",
    body: filesToForm(files)
  });
  const id = await res.text();

  return openSocket(id);
};

const openSocket = async (id: string) =>
  new Observable<string>(observer => {
    const socket = io(baseUrl`/`, { query: `id=${id}` });

    socket.on(SOCKET_DATA, (s: string) => {
      observer.next(s);
    });
    socket.on(SOCKET_COMPLETE, () => observer.complete());
    socket.on(SOCKET_ERROR, () => observer.error());

    return () => socket.disconnect();
  });
