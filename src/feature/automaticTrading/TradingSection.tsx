import styled from "styled-components";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const TradingSection = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 현재 BTC 가격 가져오기
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        console.log('가격 정보 요청 시작...');
        const response = await axios.get(
          'https://nexbit.p-e.kr/api/exchangePrice?interval=minutes/10&count=1'
        );
        
        // 응답 데이터 구조 확인 및 안전한 처리
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          console.error('API 응답이 올바르지 않습니다:', response.data);
          setError('가격 정보를 받아올 수 없습니다.');
          return;
        }

        const latestData = response.data[0];
        console.log('최신 가격 데이터:', latestData);

        // close 필드에서 현재 가격 가져오기
        const price = latestData.close;
        
        if (typeof price === 'number' && !isNaN(price) && price > 0) {
          console.log('현재 가격 설정:', price);
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
        alert(`${type === "buy" ? "매수" : "매도"} 주문이 성공적으로 실행되었습니다.`);
        setAmount("");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "거래 실행 중 오류가 발생했습니다.");
    }
  };

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
    </TradingSectionWrapper>
  );
};

export { TradingSection };
export default TradingSection;