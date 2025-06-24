import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAiStatus, postActiveStatus } from "../../apis/tradeApis";

const AiTradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`;

const AiTradeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
`;

const AiTradeDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StatusIndicator = styled.div<{ $isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#22C55E' : '#ef4444'};
  box-shadow: 0 0 0 2px ${props => props.$isActive ? '#dcfce7' : '#fee2e2'};
`;

const StatusText = styled.span<{ $isActive: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$isActive ? '#16a34a' : '#dc2626'};
`;

const Button = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.$isActive ? '#ef4444' : '#3b82f6'};
  color: white;

  &:hover {
    background-color: ${props => props.$isActive ? '#dc2626' : '#2563eb'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

interface AiTradeProps {
  token: string | null;
}

const AiTrade = ({ token }: AiTradeProps) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAiTradeStatus = async () => {
      if (!token) {
        return;
      }

      const response = await getAiStatus(token);
      if (response) {
        setIsActive(response.data.status);
      }
    };

    checkAiTradeStatus();
  }, [token]);

  const handleToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await postActiveStatus(isActive, token);
    if (response) {
      setIsActive(!isActive);
    }
  };

  return (
    <AiTradeWrapper>
      <AiTradeTitle>AI 자동 거래</AiTradeTitle>
      <AiTradeDescription>
        AI가 시장 상황을 분석하여 자동으로 매매를 실행합니다.
        거래 전 반드시 자동 거래의 위험성을 이해하고 이용해주세요.
      </AiTradeDescription>
      <StatusWrapper>
        <StatusIndicator $isActive={isActive} />
        <StatusText $isActive={isActive}>
          {isActive ? "AI 거래 활성화" : "AI 거래 비활성화"}
        </StatusText>
      </StatusWrapper>
      <Button
        onClick={handleToggle}
        $isActive={isActive}
        disabled={!token}
      >
        {isActive ? "AI 거래 중지하기" : "AI 거래 시작하기"}
      </Button>
    </AiTradeWrapper>
  );
};

export default AiTrade;