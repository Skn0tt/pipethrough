import * as React from "react";
import { mount } from "enzyme";
import Upload from "./Upload";
describe("Upload", () => {
  const props = {
    onUpload: jest.fn()
  };
  const comp = mount(<Upload {...props} />);

  it("renders correctly", () => {
    expect(comp.render()).toMatchSnapshot();
  });
});
