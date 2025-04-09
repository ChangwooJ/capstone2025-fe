import { useEffect } from "react";

const PriceTitle = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/api/price');
      const data = await res.json();
      console.log("💡 price data:", data);
    };

    fetchData();
  }, []);

  return (
    <div>Check console for data!</div>
  );
};

export default PriceTitle;
