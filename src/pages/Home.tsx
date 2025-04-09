import { useNavigate } from "react-router-dom";
import styled from "styled-components"

const HomeWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const IntroduceSection = styled.div`
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  background-color: #0b45c2;
`;

const IntroduceDescription = styled.div`
  font-size: 1.6rem;
  margin-top: 10%;
  font-weight: bold;
  color: white;
`;

const IntroduceSubDescription = styled.div`
  color: white; 
`;

const IntroduceWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const IntroduceButton = styled.button`
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-color: black;
  color: white;
  font-weight: 550;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  width: 150px;
  height: 50px;
  cursor: pointer;
`;

const LoginButton = styled.button`
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-color: white;
  color: black;
  font-weight: 550;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  width: 150px;
  height: 50px;
  cursor: pointer;
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeWrapper>
      <IntroduceSection>
        <IntroduceDescription>
          편리하고 정확한 AI 디지털 자산 거래소
        </IntroduceDescription>
        <IntroduceSubDescription>
          AI를 이용해 편리한 자동매매 거래소를 이용해보세요
        </IntroduceSubDescription>
        <IntroduceWrapper>
          <IntroduceButton onClick={() => navigate("exchange")}>
            거래소 둘러보기
          </IntroduceButton>
          <LoginButton onClick={() => navigate("login")}>
            로그인
          </LoginButton>
        </IntroduceWrapper>
      </IntroduceSection>
    </HomeWrapper>
  );
};

export default Home;