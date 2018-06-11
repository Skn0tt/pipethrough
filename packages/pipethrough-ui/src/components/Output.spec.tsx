import * as React from "react";
import { shallow, mount } from "enzyme";
import Output from "./Output";

describe("Output", () => {
  const props = {
    text: "Hallo",
    title: "Title"
  };
  const comp = mount(<Output {...props} />);

  it("renders as expected", () => {
    expect(comp.render()).toMatchSnapshot();
  });

  it("show title and text", () => {
    const text = comp.text();
    expect(text).toContain(props.text);
    expect(text).toContain(props.title);
  });
});
