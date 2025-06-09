import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styled, { keyframes } from 'styled-components';
import { SummaryCard, ChartContainer, AssetTable } from '../styles/common';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
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

const StyledSummaryCard = styled(SummaryCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
  }

  h3 {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  div {
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const ChartWrapper = styled(ChartContainer)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;

  h3 {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, #e2e8f0, transparent);
    }
  }
`;

const ChartContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  min-height: 400px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  grid-column: 2;
`;

const InfoSection = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SummarySection = styled.div`
  grid-column: 3;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ChartInfo = styled.div`
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  gap: 0.25rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  span:first-child {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span:last-child {
    font-size: 1.125rem;
    color: #1e293b;
    font-weight: 600;
  }
`;

const StyledAssetTable = styled(AssetTable)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);

  thead {
    background: #f8fafc;
    
    th {
      padding: 1rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f8fafc;
      }

      td {
        padding: 1rem;
        color: #1e293b;
        border-bottom: 1px solid #e2e8f0;
      }
    }
  }
`;

const SellButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const COLORS = ['#3b82f6', '#10b981'];

interface UpbitAsset {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  unit_currency: string;
}

interface AssetResponse {
  assets: UpbitAsset[];
  btc_current_price: number;
}

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

interface HoldingsTabProps {
  token: string | null;
}

const PredictionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
`;

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PredictionIcon = styled.div`
  font-size: 1.5rem;
`;

const PredictionTitle = styled.h4`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const PredictionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const PredictionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
`;

const PredictionLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const PredictionValue = styled.span<{ $isPositive?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.$isPositive === undefined ? '#1e293b' : props.$isPositive ? '#10b981' : '#ef4444'};
`;

interface PredictionResponse {
  success: boolean;
  predicted_price: number;
}

const HoldingsTab = ({ token }: HoldingsTabProps) => {
  const [assets, setAssets] = useState<UpbitAsset[] | null>([]);
  const [btcCurrentPrice, setBtcCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeUntilNextCandle, setTimeUntilNextCandle] = useState('');
  const [predictionData, setPredictionData] = useState({
    predictedPrice: 0,
    expectedReturn: 0
  });

  const fetchAssets = async () => {
    if (!token) {
      console.log("토큰이 없습니다. 자산을 가져올 수 없습니다.");
      setAssets(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get<AssetResponse>('https://nexbit.p-e.kr/user/myasset');
      setAssets(response.data.assets);
      setBtcCurrentPrice(response.data.btc_current_price);
    } catch (error: any) {
      console.error("업비트 자산 불러오기 실패:", error.response?.data || error.message);
      setAssets(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [token]);

  const calculateInvestmentMetrics = () => {
    if (!assets) return { totalAssets: 0, totalInvestment: 0, totalProfit: 0, profitRate: 0 };

    let totalAssets = 0;
    let totalInvestment = 0;
    let totalProfit = 0;

    assets.forEach((asset) => {
      const balance = parseFloat(asset.balance);
      const currency = asset.currency;
      const avgBuyPrice = parseFloat(asset.avg_buy_price);

      if (currency === "KRW") {
        totalAssets += balance;
      } else if (currency === "BTC") {
        const currentValue = balance * btcCurrentPrice;
        const investmentValue = balance * avgBuyPrice;
        totalAssets += currentValue;
        totalInvestment += investmentValue;
        totalProfit += currentValue - investmentValue;
      }
    });

    const profitRate = totalInvestment > 0
      ? ((totalProfit / totalInvestment) * 100).toFixed(2)
      : 0;

    return {
      totalAssets: Math.floor(totalAssets),
      totalInvestment: Math.floor(totalInvestment),
      totalProfit: Math.floor(totalProfit),
      profitRate: profitRate
    };
  };

  const { totalAssets, totalInvestment, totalProfit, profitRate } = calculateInvestmentMetrics();

  let krwBalance = 0;
  let btcBalance = 0;
  if (assets) {
    const krwAsset = assets.find(a => a.currency === "KRW");
    const btcAsset = assets.find(a => a.currency === "BTC");
    krwBalance = krwAsset ? parseFloat(krwAsset.balance) : 0;
    btcBalance = btcAsset ? parseFloat(btcAsset.balance) : 0;
  }
  const btcValue = btcBalance * btcCurrentPrice;

  const totalValue = krwBalance + btcValue;

  const btcPercent = totalValue > 0 ? (btcValue / totalValue) * 100 : 0;
  const krwPercent = totalValue > 0 ? (krwBalance / totalValue) * 100 : 0;

  const pieData = [
    { name: "BTC", value: btcValue, percent: btcPercent.toFixed(1) },
    { name: "KRW", value: krwBalance, percent: krwPercent.toFixed(1) }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: CustomizedLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${pieData[index].percent}%`}
      </text>
    );
  };

  const tooltipFormatter = (value: number, name: string) => {
    const item = pieData.find(d => d.name === name);
    return [
      `${value.toLocaleString()} KRW`,
      `${item?.name} (${item?.percent}%)`
    ];
  };

  // 다음 봉까지 남은 시간 계산 함수
  const calculateTimeUntilNextCandle = () => {
    const now = new Date();
    const nextCandle = new Date(now);
    nextCandle.setHours(Math.ceil(now.getHours() / 4) * 4, 0, 0, 0);
    if (nextCandle <= now) {
      nextCandle.setHours(nextCandle.getHours() + 4);
    }
    const diff = nextCandle.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      setTimeUntilNextCandle(calculateTimeUntilNextCandle());
    };
    
    updateTime(); // 초기 업데이트
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPredictedPrice = async () => {
    try {
      const response = await axios.get<PredictionResponse>('https://nexbit.p-e.kr/api/predict_price');
      if (response.data.success) {
        const predictedPrice = response.data.predicted_price;
        const expectedReturn = ((predictedPrice - btcCurrentPrice) / btcCurrentPrice) * 100;
        
        setPredictionData({
          predictedPrice,
          expectedReturn: Number(expectedReturn.toFixed(2))
        });
      }
    } catch (error) {
      console.error('예측 가격을 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    const updatePrediction = () => {
      fetchPredictedPrice();
      const timeUntilNext = getTimeUntilNextPrediction();
      setTimeout(updatePrediction, timeUntilNext);
    };

    updatePrediction();
  }, [btcCurrentPrice]);

  const getTimeUntilNextPrediction = () => {
    const now = new Date();
    const nextPrediction = new Date(now);
    nextPrediction.setHours(Math.ceil(now.getHours() / 4) * 4, 0, 0, 0);
    if (nextPrediction <= now) {
      nextPrediction.setHours(nextPrediction.getHours() + 4);
    }
    return nextPrediction.getTime() - now.getTime();
  };

  return (
    <TableContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      <ChartWrapper>
        <h3>자산 비중</h3>
        <ChartContent>
          <InfoSection>
            <ChartInfo>
              <InfoItem>
                <span>총 자산 가치</span>
                <span>{totalAssets.toLocaleString()} KRW</span>
              </InfoItem>
              <InfoItem>
                <span>BTC 보유량</span>
                <span>{assets?.find(a => a.currency === 'BTC')?.balance || '0'} BTC</span>
              </InfoItem>
              <InfoItem>
                <span>현재 BTC 가격</span>
                <span>{btcCurrentPrice.toLocaleString()} KRW</span>
              </InfoItem>
              <InfoItem>
                <span>KRW 보유액</span>
                <span>{Math.floor(parseFloat(assets?.find(a => a.currency === 'KRW')?.balance || '0'))} KRW</span>
              </InfoItem>
            </ChartInfo>
          </InfoSection>

          <ChartSection>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={tooltipFormatter}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '0.75rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <PredictionCard>
              <PredictionHeader>
                <PredictionIcon>📈</PredictionIcon>
                <PredictionTitle>다음 4시간 봉 예측</PredictionTitle>
              </PredictionHeader>
              <PredictionContent>
                <PredictionItem>
                  <PredictionLabel>다음 봉까지 남은 시간</PredictionLabel>
                  <PredictionValue style={{ color: "black" }}>
                    {timeUntilNextCandle}
                  </PredictionValue>
                </PredictionItem>
                <PredictionItem>
                  <PredictionLabel>예측 가격</PredictionLabel>
                  <PredictionValue $isPositive={predictionData.predictedPrice > btcCurrentPrice}>
                    {predictionData.predictedPrice.toLocaleString()} KRW
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: '0.875rem',
                      color: predictionData.expectedReturn > 0 ? '#10b981' : '#ef4444'
                    }}>
                      ({predictionData.expectedReturn > 0 ? '+' : ''}{predictionData.expectedReturn}%)
                    </span>
                  </PredictionValue>
                </PredictionItem>
              </PredictionContent>
            </PredictionCard>
          </ChartSection>

          <SummarySection>
            <StyledSummaryCard>
              <h3>총 보유자산</h3>
              <div>{totalAssets.toLocaleString()} KRW</div>
            </StyledSummaryCard>
            <StyledSummaryCard>
              <h3>총 매수금액</h3>
              <div>{totalInvestment.toLocaleString()} KRW</div>
            </StyledSummaryCard>
            <StyledSummaryCard>
              <h3>총 평가손익</h3>
              <div style={{ 
                color: totalProfit >= 0 ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem'
              }}>
                {totalProfit.toLocaleString()} KRW
                <span style={{ 
                  fontSize: '0.875rem',
                  color: totalProfit >= 0 ? '#059669' : '#dc2626',
                  fontWeight: '500'
                }}>
                  ({profitRate}%)
                </span>
              </div>
            </StyledSummaryCard>
          </SummarySection>
        </ChartContent>
      </ChartWrapper>

      <StyledAssetTable>
        <thead>
          <tr>
            <th>자산</th>
            <th>보유수량</th>
            <th>평균매입가</th>
            <th>현재가</th>
            <th>평가금액</th>
            <th>평가손익</th>
            <th>수익률</th>
            <th>주문</th>
          </tr>
        </thead>
        <tbody>
          {assets!
            .filter(asset => asset.currency !== 'KRW')
            .map((asset) => {
              const balance = parseFloat(asset.balance);
              const avgBuyPrice = parseFloat(asset.avg_buy_price);
              const currentValue = balance * btcCurrentPrice;
              const investmentValue = balance * avgBuyPrice;
              const profit = currentValue - investmentValue;
              const profitRate = investmentValue > 0 ? ((profit / investmentValue) * 100) : 0;

              return (
                <tr key={asset.currency}>
                  <td style={{ fontWeight: '600' }}>{asset.currency}</td>
                  <td>{parseFloat(asset.balance).toFixed(8)} BTC</td>
                  <td>{Math.floor(avgBuyPrice).toLocaleString()} KRW</td>
                  <td>{btcCurrentPrice.toLocaleString()} KRW</td>
                  <td>{Math.floor(currentValue).toLocaleString()} KRW</td>
                  <td style={{ 
                    color: Math.floor(profit) >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {Math.floor(profit).toLocaleString()} KRW
                  </td>
                  <td style={{ 
                    color: profitRate >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {profitRate.toFixed(2)}%
                  </td>
                  <td>
                    <SellButton>매도</SellButton>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </StyledAssetTable>
    </TableContainer>
  );
};

export default HoldingsTab; 