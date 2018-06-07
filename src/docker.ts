import Dockerode, { ContainerCreateOptions } from "dockerode";
import * as config from "./config";
import R from "ramda";
import { Stream } from "stream";
import { readStream } from "./util";

const { IMAGE, PULL_IMAGE } = config.get();

const docker = new Dockerode();

const containerLogs = async (container: Dockerode.Container): Promise<string> => {
  const logsStream = await container.logs({ follow: true, stdout: true });
  return await readStream(logsStream);
}

type Files = Express.Multer.File[];
export const pipe = async (files: Files) => {
  const Binds = filesToBinds(files)
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
  return await containerLogs(container);
};

type Volumes = string[]
const filesToBinds = R.pipe<Files, Volumes>(
  R.map(v => `${v.path}:${v.fieldname}`),
)

export const setup = async () => {
  if (PULL_IMAGE) {
    await docker.pull(IMAGE, {});
    console.log(`Successfully pulled ${IMAGE}.`);
  }
}