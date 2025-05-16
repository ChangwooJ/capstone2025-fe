import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
`;

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Button = styled.button<{ isRunning: boolean }>`
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    background: ${({ isRunning }) => (isRunning ? '#e53e3e' : '#38a169')};
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: ${({ isRunning }) => (isRunning ? '#c53030' : '#2f855a')};
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3182ce;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${spin} 1s linear infinite;
`;

const AiTrade = () => {
    const token = useAuthStore((state) => state.token);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // AI 거래 상태 확인
    const checkAiTradeStatus = async () => {
        try {
            const response = await axios.get('http://13.60.194.78/user/ai/status');
            setIsRunning(response.data.status);
            console.log(response);
        } catch (error) {
            console.error('AI 거래 상태 확인 중 오류 발생:', error);
        }
    };

    // AI 거래 시작/중지
    const toggleAiTrade = async () => {
        setIsLoading(true);
        try {
            const endpoint = isRunning ? 'http://13.60.194.78/user/ai/stop' : 'http://13.60.194.78/user/ai/start';
            await axios.post(endpoint);
            setIsRunning(!isRunning);
        } catch (error) {
            console.error('AI 거래 상태 변경 중 오류 발생:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 상태 확인
    useEffect(() => {
        checkAiTradeStatus();
        // 주기적으로 상태 확인 (30초마다)
        const interval = setInterval(checkAiTradeStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <StatusContainer>
                {isRunning && <Spinner />}
                {token && (
                    <Button
                        isRunning={isRunning}
                        onClick={toggleAiTrade}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (isRunning ? "중지 중..." : "시작 중...")
                            : (isRunning ? "AI 거래 중지" : "AI 거래 시작")}
                    </Button> 
                )}
            </StatusContainer>
        </Container>
    );
};

export default AiTrade;