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

const PriceInquiry = () => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/api/exchange_price');
      const data = await res.json();
      setPriceData(data);
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <PriceInfoWrapper>
        <PriceTitle priceData={priceData} />
        {priceData.length > 0 && <PriceChart priceData={priceData} />}
      </PriceInfoWrapper>
    </>
  )
}

export default PriceInquiry;