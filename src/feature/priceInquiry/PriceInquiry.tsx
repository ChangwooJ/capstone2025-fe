import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import PriceTitle from "./components/PriceTitle";
import PriceChart from "./components/PriceChart";

const PriceInfoWrapper = styled.div`
  width: 100%;
  height: fit-content;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff9800;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const TableContainer = styled.div`
  position: relative;
  min-height: 400px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
`;

const ErrorMessage = styled(Loading)`
  color: #dc3545;
  background-color: #fff5f5;
  border: 1px solid #ffcdd2;
`;

const IntervalSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  align-items: center;
`;

const IntervalButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: ${props => (props.$active ? '#007bff' : '#fff')};
  color: ${props => (props.$active ? '#fff' : '#333')};
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PriceInquiry = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedInterval, setSelectedInterval] = useState('1시간');

  const intervalOptions: { label: string; value: string; defaultCount: number }[] = [
    { label: '1분', value: 'minutes/1', defaultCount: 6 * 24 * 1 }, 
    { label: '10분', value: 'minutes/10', defaultCount: 6 * 24 * 1 },
    { label: '30분', value: 'minutes/30', defaultCount: 6 * 24 * 1 }, 
    { label: '1시간', value: 'minutes/60', defaultCount: 6 * 24 * 1 },
    { label: '4시간', value: 'minutes/240', defaultCount: 6 * 6 },
    { label: '일', value: 'days', defaultCount: 30 },
    { label: '주', value: 'weeks', defaultCount: 30 },
    { label: '월', value: 'months', defaultCount: 30 }, 
  ];

  const currentCount = intervalOptions.find(opt => opt.label === selectedInterval)?.defaultCount || 200;
  const currentIntervalValue = intervalOptions.find(opt => opt.label === selectedInterval)?.value || 'minutes/60';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`https://nexbit.p-e.kr/api/exchangePrice?interval=${currentIntervalValue}&count=${currentCount}&market=KRW-BTC`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const data = await res.json();
        setPriceData(data.reverse());
      } catch (err: any) {
        console.error('데이터 가져오기 오류:', err);
        setError(`비트코인 시세 데이터를 불러오는데 실패했습니다: ${err.message}`);
        setPriceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [selectedInterval, currentCount, currentIntervalValue]);

  return (
    <PriceInfoWrapper>
      <IntervalSelector>
        <label style={{ marginRight: '8px', fontWeight: '600' }}>간격:</label>
        {intervalOptions.map(option => (
          <IntervalButton
            key={option.label}
            $active={selectedInterval === option.label}
            onClick={() => setSelectedInterval(option.label)}
            disabled={loading}
          >
            {option.label}
          </IntervalButton>
        ))}
      </IntervalSelector>

      <TableContainer>
        {loading ? (
          <LoadingOverlay>
            <Spinner />
          </LoadingOverlay>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            {priceData && priceData.length > 0 ? (
              <>
                <PriceTitle priceData={priceData} />
                <PriceChart priceData={priceData} />
              </>
            ) : (
               <Loading>데이터가 없습니다.</Loading>
            )}
          </>
        )}
      </TableContainer>
    </PriceInfoWrapper>
  );
};

export default PriceInquiry;