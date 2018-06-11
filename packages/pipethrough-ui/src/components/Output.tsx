import * as React from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import * as R from "ramda";

const Container = styled(Paper)`
  padding: 1px 10px 0px;
  height: 120px;
`;

const Header = styled.h1`
  margin-left: 5px;
`;

const BlackPaper = styled(Paper)`
  color: white;
  overflow-wrap: break-word;
  padding: 10px;
`;

type OwnProps = {
  title: string;
  text: string;
};

const Output: React.SFC<OwnProps> = props => {
  const { title, text } = props;

  return (
    <Container>
      <Header>{title}</Header>
      <BlackPaper style={{ backgroundColor: "#424242" }}>
        {text.split("\n").map((t, i) => (
          <React.Fragment key={i}>
            {t}
            <br />
          </React.Fragment>
        ))}
      </BlackPaper>
    </Container>
  );
};

export default Output;
