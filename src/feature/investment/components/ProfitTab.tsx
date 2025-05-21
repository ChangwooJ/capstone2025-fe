import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SummaryCard, ChartContainer, AssetTable } from '../styles/common';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DateRange = styled.div`
  margin-bottom: 24px;
  font-size: 1rem;
  color: #333;
`;

const ProfitSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ProfitSummaryCard = styled(SummaryCard)`
  h3 {
    font-size: 0.9rem;
    margin-bottom: 8px;
    color: #555;
  }

  div {
    font-size: 1.2rem;
    font-weight: 600;
  }

  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProfitChartContainer = styled(ChartContainer)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ProfitDetailTable = styled(AssetTable)`
  margin-top: 24px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #72dac8;
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

interface UpbitAsset {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
}

interface AssetResponse {
  assets: UpbitAsset[];
  btc_current_price: number;
}

interface PriceData {
  id: number;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface DailyProfit {
  date: string;
  dailyProfit: number;
  dailyProfitRate: number;
  cumulativeProfit: number;
  cumulativeProfitRate: number;
  openingBalance: number;
  closingBalance: number;
  negativeCumulativeProfitRate?: number;
}

interface ProfitTabProps {
  token: string | null;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}.${date.getDate()}`;
};

const ProfitTab = ({ token }: ProfitTabProps) => {
  const [dailyProfits, setDailyProfits] = useState<DailyProfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [btcBalance, setBtcBalance] = useState(0);
  const [btcAvgPrice, setBtcAvgPrice] = useState(0);
  const [btcCurrentPrice, setBtcCurrentPrice] = useState(0);

  useEffect(() => {
    console.log('상태 업데이트:', { btcBalance, btcAvgPrice, btcCurrentPrice });
  }, [btcBalance, btcAvgPrice, btcCurrentPrice]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const assetResponse = await axios.get<AssetResponse>('https://nexbit.p-e.kr/user/myasset');
        const btcAsset = assetResponse.data.assets.find(a => a.currency === 'BTC');

        if (!btcAsset) {
          console.log('BTC 자산이 없습니다.');
          return;
        }

        setBtcBalance(Number(btcAsset.balance));
        setBtcAvgPrice(Number(btcAsset.avg_buy_price));
        setBtcCurrentPrice(assetResponse.data.btc_current_price);

        const balance = Number(btcAsset.balance);
        const avgPrice = Number(btcAsset.avg_buy_price);
        const currentPrice = assetResponse.data.btc_current_price;

        const priceResponse = await axios.get<PriceData[]>('https://nexbit.p-e.kr/api/exchangePrice', {
          params: {
            interval: 'days',
            count: 30,
            market: 'KRW-BTC'
          }
        });

        const priceData = priceResponse.data;
        const investmentValue = balance * avgPrice;
        const profits: DailyProfit[] = [];

        priceData.reverse().forEach((day, index) => {
          const closingPrice = index === priceData.length - 1 ? currentPrice : day.close;
          const currentValue = balance * closingPrice;
          const cumulativeProfit = currentValue - investmentValue;
          const prevCumulativeProfit = index > 0 ? 
            (balance * priceData[index - 1].close) - investmentValue : 0;
          const dailyProfit = cumulativeProfit - prevCumulativeProfit;

          profits.push({
            date: day.datetime,
            dailyProfit,
            dailyProfitRate: (dailyProfit / investmentValue) * 100,
            cumulativeProfit,
            cumulativeProfitRate: (cumulativeProfit / investmentValue) * 100,
            openingBalance: index === 0 ? investmentValue : balance * priceData[index - 1].close,
            closingBalance: currentValue
          });
        });

        setDailyProfits(profits);
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <TableContainer>
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      </TableContainer>
    );
  }

  if (!btcBalance || !btcAvgPrice || !btcCurrentPrice) {
    return <div>BTC 자산이 없습니다.</div>;
  }

  const latestProfit = dailyProfits[dailyProfits.length - 1];
  const totalInvestment = btcBalance * btcAvgPrice;

  return (
    <>
      <DateRange>
        {dailyProfits.length > 0 ? 
          `${formatDate(dailyProfits[0].date)} ~ ${formatDate(dailyProfits[dailyProfits.length - 1].date)}의 투자손익` : 
          '데이터 없음'}
      </DateRange>
      
      <ProfitSummaryGrid>
        <ProfitSummaryCard>
          <h3>누적 손익</h3>
          <div style={{ color: latestProfit?.cumulativeProfit >= 0 ? '#e53935' : '#1e88e5' }}>
            {Math.round(latestProfit?.cumulativeProfit || 0).toLocaleString()} KRW
          </div>
        </ProfitSummaryCard>
        <ProfitSummaryCard>
          <h3>누적 수익률</h3>
          <div style={{ color: latestProfit?.cumulativeProfitRate >= 0 ? '#e53935' : '#1e88e5' }}>
            {latestProfit?.cumulativeProfitRate.toFixed(2)}%
          </div>
        </ProfitSummaryCard>
        <ProfitSummaryCard>
          <h3>총 투자금액</h3>
          <div>{Math.round(totalInvestment).toLocaleString()} KRW</div>
        </ProfitSummaryCard>
      </ProfitSummaryGrid>

      <ProfitChartContainer>
        <ChartContainer style={{ flex: 1, minWidth: '300px' }}>
          <h3>누적 수익률 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyProfits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, '수익률']}
                labelFormatter={formatDate}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cumulativeProfitRate"
                stroke="#e53935"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer style={{ flex: 1, minWidth: '300px' }}>
          <h3>일별 손익 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyProfits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={formatDate}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} KRW`, '손익']}
                labelFormatter={formatDate}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="dailyProfit"
                stroke="#1e88e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ProfitChartContainer>

      <ProfitDetailTable>
        <thead>
          <tr>
            <th>일자</th>
            <th>일일 손익</th>
            <th>일일 수익률</th>
            <th>누적 손익</th>
            <th>누적 수익률</th>
            <th>기초 자산</th>
            <th>기말 자산</th>
          </tr>
        </thead>
        <tbody>
          {[...dailyProfits].reverse().map((profit) => (
            <tr key={profit.date}>
              <td>{formatDate(profit.date)}</td>
              <td style={{ color: profit.dailyProfit >= 0 ? '#e53935' : '#1e88e5' }}>
                {Math.round(profit.dailyProfit).toLocaleString()} KRW
              </td>
              <td style={{ color: profit.dailyProfitRate >= 0 ? '#e53935' : '#1e88e5' }}>
                {profit.dailyProfitRate.toFixed(2)}%
              </td>
              <td style={{ color: profit.cumulativeProfit >= 0 ? '#e53935' : '#1e88e5' }}>
                {Math.round(profit.cumulativeProfit).toLocaleString()} KRW
              </td>
              <td style={{ color: profit.cumulativeProfitRate >= 0 ? '#e53935' : '#1e88e5' }}>
                {profit.cumulativeProfitRate.toFixed(2)}%
              </td>
              <td>{Math.round(profit.openingBalance).toLocaleString()} KRW</td>
              <td>{Math.round(profit.closingBalance).toLocaleString()} KRW</td>
            </tr>
          ))}
        </tbody>
      </ProfitDetailTable>
    </>
  );
};

export default ProfitTab; 