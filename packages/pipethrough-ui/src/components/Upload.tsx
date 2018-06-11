import * as React from "react";
import { UploadFiles } from "../api/upload";
import * as R from "ramda";
import { ListItem, ListItemText, List } from "@material-ui/core";

const fileListToArr = (f: FileList | null): File[] =>
  !!f
    ? Array(f.length)
        .fill(0)
        .map((_, i) => f.item(i)!)
    : [];

interface Props {
  onUpload(files: UploadFiles): void;
}
interface State {
  files: UploadFiles;
  addDir: string;
  addFiles?: File[];
}
class Upload extends React.PureComponent<Props, State> {
  state: State = {
    files: {},
    addDir: "",
    addFiles: undefined
  };

  onUpload = () => this.props.onUpload(this.state.files);

  onAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { addDir, addFiles, files } = this.state;
    const newFiles = {
      ...files,
      [addDir]: (files[addDir] || []).concat(addFiles || [])
    };
    this.setState({ files: newFiles, addFiles: undefined });
  };

  onChangeDirInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ addDir: event.target.value });

  onChangeFileInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ addFiles: fileListToArr(event.target.files) });

  render() {
    const { files } = this.state;

    return (
      <>
        <List>
          {R.toPairs(files).map(([dir, files]) => (
            <ListItem key={dir}>
              <ListItemText
                primary={dir}
                secondary={files.map(f => f.name).join(", ")}
              />
            </ListItem>
          ))}
        </List>
        <form onSubmit={this.onAdd}>
          <input onChange={this.onChangeDirInput} />
          <input type="file" onChange={this.onChangeFileInput} />
          <button>Add</button>
        </form>
        <button onClick={this.onUpload}>Upload!</button>
      </>
    );
  }
}

export default Upload;
