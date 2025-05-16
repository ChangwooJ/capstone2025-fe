import { useEffect, useState } from "react";
import styled from "styled-components";
import PriceTitle from "./components/PriceTitle";
import PriceChart from "./components/PriceChart";

const PriceInfoWrapper = styled.div`
  width: 100%;
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  padding: 2%;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const PriceInquiry = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://13.60.194.78/api/exchangePrice?interval=minutes/10&count=200');
        
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
        <Loading>{error}</Loading>
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