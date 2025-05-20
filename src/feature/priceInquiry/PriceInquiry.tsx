import { useEffect, useState } from "react";
import styled from "styled-components";
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

const PriceInquiry = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://nexbit.p-e.kr/api/exchangePrice?interval=minutes/10&count=200');
        
        if (!res.ok) {
          throw new Error('API 요청 실패');
        }
        
        const data = await res.json();
        // 날짜 기준으로 오름차순 정렬 (최신 데이터가 마지막에 오도록)
        setPriceData(data.reverse());
      } catch (err) {
        console.error('데이터 가져오기 오류:', err);
        setError('비트코인 시세 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PriceInfoWrapper>
      {loading ? (
        <Loading>데이터를 불러오는 중입니다...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <PriceTitle priceData={priceData} />
          {priceData.length > 0 && <PriceChart priceData={priceData} />}
        </>
      )}
    </PriceInfoWrapper>
  );
};

export default PriceInquiry;