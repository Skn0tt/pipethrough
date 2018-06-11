import * as React from "react";
import Output from "./Output";
import Upload from "./Upload";
import { reduce } from "rxjs/operators";
import { UploadFiles, upload } from "../api/upload";

interface State {
  logs: string;
}

class Main extends React.PureComponent<{}, State> {
  state: State = {
    logs: ""
  };

  upload = async (files: UploadFiles) => {
    const $logs = await upload(files);
    $logs
      .pipe(reduce((acc, v) => acc + v))
      .subscribe(logs => this.setState({ logs }));
  };

  render() {
    const { logs } = this.state;
    return (
      <>
        <Upload onUpload={this.upload} />
        <Output text={logs} title="Output" />
      </>
    );
  }
}

export default Main;
