import { readStream } from "./util";
import { Duplex, Writable, Readable } from "stream";
import { read } from "fs";

describe("readStream", () => {
  it("reads the stream", async () => {
    const readable = new Readable();
    readable._read = () => {}
    readable.push("Hallo");
    readable.push(null);

    const result = await readStream(readable);

    expect(result).toBe("Hallo");
  })
})