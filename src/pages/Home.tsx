import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a365d 0%, #2a4365 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/grid-pattern.svg') center/cover;
    opacity: 0.1;
    pointer-events: none;
  }
`;

const IntroduceSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
`;

const IntroduceDescription = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const IntroduceSubDescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 200px;
  position: relative;
  overflow: hidden;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: translateX(100%);
  }
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeWrapper>
      <IntroduceSection>
        <ContentWrapper>
          <IntroduceDescription>
            편리하고 정확한<br />
            AI 디지털 자산 거래소
          </IntroduceDescription>
          <IntroduceSubDescription>
            최신 AI 기술을 활용한 자동매매 시스템으로<br />
            더 스마트하고 효율적인 거래를 경험해보세요
          </IntroduceSubDescription>
          <ButtonGroup>
            <Button 
              $variant="primary"
              onClick={() => navigate("exchange")}
            >
              거래소 둘러보기
            </Button>
            <Button 
              $variant="secondary"
              onClick={() => navigate("login")}
            >
              로그인
            </Button>
          </ButtonGroup>
        </ContentWrapper>
      </IntroduceSection>
    </HomeWrapper>
  );
};

export default Home;