import styled from "styled-components"
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

const Background = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContentsSection = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 90%;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  align-items: stretch;
`;

const MainContents = styled.div`
  width: 100%;
`;

const CommonComponents = () => {
  return (
    <Background>
      <Header />
      <MainContentsSection>
        <MainContents>
          <Outlet />
        </MainContents>
      </MainContentsSection>
    </Background>
  )
}

export default CommonComponents;