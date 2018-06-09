import * as Dockerode from "dockerode";
import * as config from "./config";
import * as R from "ramda";
import { readStream, streamToReplaySubject } from "./util";
import { Observable } from "rxjs";

const { IMAGE, PULL_IMAGE } = config.get();

const docker = new Dockerode();

const containerLogs = async (
  container: Dockerode.Container
): Promise<string> => {
  const logsStream = await container.logs({ follow: true, stdout: true });
  return await readStream(logsStream);
};

type Files = Express.Multer.File[];
export const pipe = async (files: Files): Promise<String> => {
  const logsStream = await pipeStream(files);
  return await readStream(logsStream);
};

export const pipeRx = async (files: Files): Promise<Observable<string>> => {
  new Observable();
  const logsStream = await pipeStream(files);
  return streamToReplaySubject(logsStream);
};

const pipeStream = async (files: Files): Promise<NodeJS.ReadableStream> => {
  const container = await startContainer(files);
  return container.logs({ follow: true, stdout: true });
};

const startContainer = async (files: Files): Promise<Dockerode.Container> => {
  const Binds = filesToBinds(files);
  const container = await docker.createContainer({
    Image: IMAGE,
    AttachStdout: true,
    Cmd: ["ls", "-Rl", "home"],
    HostConfig: {
      Binds,
      AutoRemove: true
    }
  });
  await container.start();
  return container;
};

type Volumes = string[];
const filesToBinds = R.pipe<Files, Volumes>(
  R.map(v => `${v.path}:${v.fieldname}`)
);

export const setup = async () => {
  if (PULL_IMAGE) {
    await docker.pull(IMAGE, {});
    console.log(`Successfully pulled ${IMAGE}.`);
  }
};
