import { useEffect, useState } from "react";
import styled from "styled-components";
import PriceTitle from "./components/PriceTitle";
import PriceChart from "./components/PriceChart";

const PriceInfoWrapper = styled.div`
  width: 70%;
  height: 90%;
  background-color: white;
  border-radius: 10px;
  padding: 2%;
`;

const PriceInquiry = () => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/api/price');
      const data = await res.json();
      setPriceData(data);
    };

    fetchData();
  }, []);

  //console.log(priceData);

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