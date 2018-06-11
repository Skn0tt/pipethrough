import * as React from "react";
import Output from "./Output";

import { storiesOf } from "@storybook/react";

const input = `$ man echo
$ man printf
$ man bash
$ man ksh`;

storiesOf("Output").add("Debian", () => <Output text={input} title="debian" />);
