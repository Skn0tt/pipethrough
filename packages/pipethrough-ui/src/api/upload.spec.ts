import { filesToForm } from "./upload";

const input = {
  "home/var/srv": [new File(["testtest"], "test.txt")]
};

describe("filesToForm", () => {
  it("adds all files", () => {
    const form = filesToForm(input);

    expect((form.get("home/var/srv") as File).name).toEqual("test.txt");
  });
});
