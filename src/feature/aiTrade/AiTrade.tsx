import styled from "styled-components";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fee2e2;
`;

const AiTrade = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // AI 거래 상태 확인
  useEffect(() => {
    const checkAiTradeStatus = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://nexbit.p-e.kr/user/ai/status',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsActive(response.data.status);
      } catch (error: any) {
        setError(error.response?.data?.message || "AI 거래 상태 확인 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAiTradeStatus();
  }, [token]);

  const handleToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isActive ? 'https://nexbit.p-e.kr/user/ai/stop' : 'https://nexbit.p-e.kr/user/ai/start';
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsActive(!isActive);
        setError("");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "AI 거래 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
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