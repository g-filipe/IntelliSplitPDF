import "./App.css";
import styled from "styled-components";
import Upload from "./Upload";

const Title = styled.h1`
  color: #6cf26c;
  font-family: Helvetica;
  font-size: 44px;
`;

function App() {
  return (
    <>
      <Title>IntelliSplitPDF</Title>
      <Upload></Upload>
    </>
  );
}

export default App;
