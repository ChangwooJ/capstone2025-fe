import styled from "styled-components";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TradingSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`;

const TradingTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
`;

const TradingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: 'buy' | 'sell' }>`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.$variant === 'buy' ? '#22C55E' : '#ef4444'};
  color: white;

  &:hover {
    background-color: ${props => props.$variant === 'buy' ? '#16a34a' : '#dc2626'};
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

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const CurrentPrice = styled.span`
  color: #3b82f6;
  font-weight: 600;
`;

const PredictionCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PredictionIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const PredictionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const PredictionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PredictionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PredictionLabel = styled.span`
  color: #64748b;
  font-size: 0.875rem;
`;

const PredictionValue = styled.span<{ $isPositive?: boolean }>`
  font-weight: 600;
  color: ${props => props.$isPositive ? '#22c55e' : '#ef4444'};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #1e293b;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const OrderInfo = styled.div`
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: #64748b;
`;

const InfoValue = styled.span<{ $isPositive?: boolean }>`
  font-weight: 600;
  color: ${props => props.$isPositive ? '#22c55e' : '#ef4444'};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$variant === 'primary' ? `
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  ` : `
    background-color: #f1f5f9;
    color: #64748b;

    &:hover {
      background-color: #e2e8f0;
    }
  `}
`;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: "buy" | "sell";
  price: number;
  amount: number;
}

const OrderModal = ({ isOpen, onClose, orderType, price, amount }: OrderModalProps) => {
  if (!isOpen) return null;

  const formattedPrice = price.toLocaleString();
  const formattedAmount = amount.toLocaleString();
  const quantity = amount / price;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{orderType === "buy" ? "매수" : "매도"} 주문 상세</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <OrderInfo>
            <InfoRow>
              <InfoLabel>거래 유형</InfoLabel>
              <InfoValue $isPositive={orderType === "buy"}>
                {orderType === "buy" ? "매수" : "매도"}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>거래 가격</InfoLabel>
              <InfoValue>{formattedPrice} KRW</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>거래 수량</InfoLabel>
              <InfoValue>{quantity.toFixed(8)} BTC</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>거래 금액</InfoLabel>
              <InfoValue>{formattedAmount} KRW</InfoValue>
            </InfoRow>
          </OrderInfo>
        </ModalBody>
        <ModalFooter>
          <ModalButton $variant="secondary" onClick={onClose}>
            닫기
          </ModalButton>
          <ModalButton $variant="primary" onClick={onClose}>
            확인
          </ModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

interface PredictionResponse {
  success: boolean;
  predicted_price: number;
}

interface PredictionProbabilityResponse {
  up_probability: number;
}

const TradingSection = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [predictionData, setPredictionData] = useState({
    profitProbability: 50.00,
    expectedReturn: 0.0,
    predictedPrice: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{
    type: "buy" | "sell";
    price: number;
    amount: number;
  } | null>(null);
  const [timeUntilNextPrediction, setTimeUntilNextPrediction] = useState('');

  const getTimeUntilNextPrediction = () => {
    const now = new Date();
    const nextPrediction = new Date(now);
    nextPrediction.setHours(Math.ceil(now.getHours() / 4) * 4, 0, 0, 0);
    if (nextPrediction <= now) {
      nextPrediction.setHours(nextPrediction.getHours() + 4);
    }
    return nextPrediction.getTime() - now.getTime();
  };

  const fetchPredictedPrice = async () => {
    try {
      const response = await axios.get<PredictionResponse>('https://nexbit.p-e.kr/api/predict_price');
      if (response.data.success) {
        const predictedPrice = response.data.predicted_price;
        const currentPriceValue = currentPrice || 0;
        const expectedReturn = ((predictedPrice - currentPriceValue) / currentPriceValue) * 100;
        setPredictionData(prev => ({
          ...prev,
          predictedPrice,
          expectedReturn: Number(expectedReturn.toFixed(2))
        }));
      }
    } catch (error) {
      console.error('예측 가격을 가져오는데 실패했습니다:', error);
    }
  };

  const fetchPredictedProbability = async () => {
    try {
      const response = await axios.get<PredictionProbabilityResponse>('https://nexbit.p-e.kr/api/predict_probabtility');
      if (response.data) {
        const predictedProbability = response.data.up_probability * 100;
        setPredictionData(prev => ({
          ...prev,
          profitProbability: Number(predictedProbability.toFixed(2))
        }))
      }
    } catch (error) {
      console.error('예측 확률을 가져오는데 실패했습니다:', error);
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchPredictedPrice(),
        fetchPredictedProbability()
      ]);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const updatePrediction = async () => {
      await Promise.all([
        fetchPredictedPrice(),
        fetchPredictedProbability()
      ]);
      
      const timeUntilNext = getTimeUntilNextPrediction();
      setTimeout(updatePrediction, timeUntilNext);
    };

    updatePrediction();

    return () => {};
  }, [currentPrice]);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        console.log('가격 정보 요청 시작...');
        const response = await axios.get(
          'https://nexbit.p-e.kr/api/exchangePrice?interval=minutes/10&count=1'
        );
        
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          console.error('API 응답이 올바르지 않습니다:', response.data);
          setError('가격 정보를 받아올 수 없습니다.');
          return;
        }

        const latestData = response.data[0];

        const price = latestData.close;
        
        if (typeof price === 'number' && !isNaN(price) && price > 0) {
          setCurrentPrice(price);
          setPrice(price.toString());
          setError('');
        } else {
          console.error('가격 데이터가 올바르지 않습니다:', {
            price,
            type: typeof price,
            latestData
          });
          setError('가격 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('현재 가격을 가져오는데 실패했습니다:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios 에러 상세:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
          });
          if (error.response?.status === 404) {
            setError('가격 정보 API를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
          } else if (error.response?.status === 401) {
            setError('인증이 필요합니다. 로그인해주세요.');
          } else {
            setError(`가격 정보 조회 실패: ${error.response?.data?.message || error.message}`);
          }
        } else {
          setError('현재 가격을 가져오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 10000);

    return () => clearInterval(interval);
  }, []);

  const calculateQuantity = (price: number, amount: number): number => {
    return amount / price;
  };

  const handleSubmit = async (e: React.FormEvent, type: "buy" | "sell") => {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!price || !amount) {
      setError("가격과 거래 금액을 모두 입력해주세요.");
      return;
    }

    const numPrice = parseFloat(price);
    const numAmount = parseFloat(amount);

    if (isNaN(numPrice) || isNaN(numAmount) || numPrice <= 0 || numAmount <= 0) {
      setError("유효한 가격과 거래 금액을 입력해주세요.");
      return;
    }

    if (numAmount < 5000) {
      setError("최소 거래 금액은 5,000원입니다.");
      return;
    }

    const formattedPrice = numPrice.toLocaleString();
    
    // 토스트 클릭 시 모달을 열기 위한 데이터 저장
    setCurrentOrder({
      type,
      price: numPrice,
      amount: numAmount
    });

    toast.success(
      `${type === "buy" ? "매수" : "매도"} 주문을 요청했습니다.\n` +
      `가격: ${formattedPrice} KRW`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClick: () => setIsModalOpen(true)
      }
    );

    const quantity = calculateQuantity(numPrice, numAmount);

    try {
      const response = await axios.post(
        'https://nexbit.p-e.kr/api/order',
        {
          market: "KRW-BTC",
          side: type === "buy" ? "bid" : "ask",
          price: numPrice.toFixed(0),
          volume: quantity.toFixed(8),
          ord_type: "limit"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.status === 200) {
        setAmount("");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "거래 실행 중 오류가 발생했습니다.";
      setError(errorMessage);
    }
  };

  // 다음 예측 시간까지 남은 시간 계산 및 포맷팅
  const updateTimeUntilNextPrediction = () => {
    const now = new Date();
    const nextPrediction = new Date(now);
    nextPrediction.setHours(Math.ceil(now.getHours() / 4) * 4, 0, 0, 0);
    if (nextPrediction <= now) {
      nextPrediction.setHours(nextPrediction.getHours() + 4);
    }
    const diff = nextPrediction.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setTimeUntilNextPrediction(`${hours}시간 ${minutes}분 ${seconds}초`);
  };

  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    updateTimeUntilNextPrediction();
    const interval = setInterval(updateTimeUntilNextPrediction, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <TradingSectionWrapper>
        <TradingTitle>거래하기</TradingTitle>
        <div>현재 가격을 불러오는 중...</div>
      </TradingSectionWrapper>
    );
  }

  return (
    <TradingSectionWrapper>
      <TradingTitle>거래하기</TradingTitle>
      
      <PredictionCard>
        <PredictionHeader>
          <PredictionIcon>🤖</PredictionIcon>
          <PredictionTitle>AI 매수 예측</PredictionTitle>
        </PredictionHeader>
        <PredictionContent>
          <PredictionItem>
            <PredictionLabel>다음 예측까지 남은 시간</PredictionLabel>
            <PredictionValue style={{ color: "black" }}>
              {timeUntilNextPrediction}
            </PredictionValue>
          </PredictionItem>
          <PredictionItem>
            <PredictionLabel>이익 확률</PredictionLabel>
            <PredictionValue $isPositive={predictionData.profitProbability > 50}>
              {predictionData.profitProbability}%
            </PredictionValue>
          </PredictionItem>
          <PredictionItem>
            <PredictionLabel>예상 수익률</PredictionLabel>
            <PredictionValue $isPositive={predictionData.expectedReturn > 0}>
              {predictionData.expectedReturn > 0 ? '+' : ''}{predictionData.expectedReturn}%
            </PredictionValue>
          </PredictionItem>
          <PredictionItem>
            <PredictionLabel>예측 가격</PredictionLabel>
            <PredictionValue $isPositive={predictionData.predictedPrice > currentPrice}>
              {predictionData.predictedPrice.toLocaleString()} KRW
            </PredictionValue>
          </PredictionItem>
        </PredictionContent>
      </PredictionCard>

      <TradingForm>
        <InputGroup>
          <Label htmlFor="price">거래 가격 (KRW)</Label>
          <PriceInfo>
            현재 가격: <CurrentPrice>{currentPrice.toLocaleString()} KRW</CurrentPrice>
          </PriceInfo>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="거래 가격을 입력하세요"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="amount">거래 금액 (KRW)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="거래할 금액을 입력하세요 (최소 5,000원)"
            min="5000"
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <Button
            type="submit"
            $variant="buy"
            onClick={(e) => handleSubmit(e, "buy")}
            disabled={!token}
          >
            매수하기
          </Button>
          <Button
            type="submit"
            $variant="sell"
            onClick={(e) => handleSubmit(e, "sell")}
            disabled={!token}
          >
            매도하기
          </Button>
        </ButtonGroup>
      </TradingForm>

      {currentOrder && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderType={currentOrder.type}
          price={currentOrder.price}
          amount={currentOrder.amount}
        />
      )}
    </TradingSectionWrapper>
  );
};

export default TradingSection;