import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import styled from 'styled-components';
import { SummaryCard, ChartContainer, AssetTable } from '../styles/common';

// HoldingsTab 전용 스타일 컴포넌트
const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
  margin-right: 8px;
  border-radius: 2px;
`;

const COLORS = ['#8ca252', '#3182bd'];

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
  onMetricsUpdate: (totalProfit: number, profitRate: number | string) => void;
}

const HoldingsTab = ({ token, onMetricsUpdate }: HoldingsTabProps) => {
  const [assets, setAssets] = useState<UpbitAsset[] | null>([]);
  const [btcCurrentPrice, setBtcCurrentPrice] = useState(0);

  const fetchAssets = async () => {
    if (!token) {
      console.log("토큰이 없습니다. 자산을 가져올 수 없습니다.");
      return;
    }
    try {
      const response = await axios.get<AssetResponse>('https://nexbit.p-e.kr/user/myasset');
      setAssets(response.data.assets);
      setBtcCurrentPrice(response.data.btc_current_price);
    } catch (error: any) {
      console.error("업비트 자산 불러오기 실패:", error.response?.data || error.message);
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

  // 파이차트 데이터 계산
  let krwBalance = 0;
  let btcBalance = 0;
  if (assets) {
    const krwAsset = assets.find(a => a.currency === "KRW");
    const btcAsset = assets.find(a => a.currency === "BTC");
    krwBalance = krwAsset ? parseFloat(krwAsset.balance) : 0;
    btcBalance = btcAsset ? parseFloat(btcAsset.balance) : 0;
  }
  const btcValue = btcBalance * btcCurrentPrice;

  const totalValue = krwBalance + btcValue; // 파이차트 계산을 위한 전체 평가금액 (KRW + BTC)

  const btcPercent = totalValue > 0 ? (btcValue / totalValue) * 100 : 0;
  const krwPercent = totalValue > 0 ? (krwBalance / totalValue) * 100 : 0;

  const pieData = [
    { name: "BTC", value: btcValue, percent: btcPercent.toFixed(1) },
    { name: "KRW", value: krwBalance, percent: krwPercent.toFixed(1) }
  ];

  // 커스텀 라벨 렌더러
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

  // 커스텀 툴팁 포맷터
  const tooltipFormatter = (value: number, name: string) => {
    const item = pieData.find(d => d.name === name);
    return [
      `${value.toLocaleString()} KRW`,
      `${item?.name} (${item?.percent}%)`
    ];
  };

  return (
    <>
      <SummaryGrid>
        <SummaryCard>
          <h3>총 보유자산</h3>
          <div>{totalAssets.toLocaleString()} KRW</div>
        </SummaryCard>
        <SummaryCard>
          <h3>총 매수금액</h3>
          <div>{totalInvestment.toLocaleString()} KRW</div>
        </SummaryCard>
        <SummaryCard>
          <h3>총 평가손익</h3>
          <div style={{ color: totalProfit >= 0 ? '#e53935' : '#1e88e5' }}>
            {totalProfit.toLocaleString()} KRW ({profitRate}%)
          </div>
        </SummaryCard>
      </SummaryGrid>

      <ChartContainer>
        <h3>보유 비중</h3>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              labelLine={false}
              label={renderCustomizedLabel}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <text
              x={200}
              y={150}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fill="#333"
            >
              보유 비중
              <tspan x={200} dy={20}>(%)</tspan>
            </text>
            <Tooltip formatter={tooltipFormatter} />
          </PieChart>

          <LegendContainer>
            {pieData.map((entry, index) => (
              <LegendItem key={`legend-${index}`}>
                <ColorBox color={COLORS[index % COLORS.length]} />
                <span>{entry.name}</span>
                <span style={{ marginLeft: '8px' }}>{entry.percent}%</span>
              </LegendItem>
            ))}
          </LegendContainer>
        </div>
      </ChartContainer>
      <AssetTable>
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
            .filter(asset => asset.currency !== 'KRW') // KRW 제외
            .map((asset) => {
              const balance = parseFloat(asset.balance);
              const avgBuyPrice = parseFloat(asset.avg_buy_price);
              const currentValue = balance * btcCurrentPrice; // 현재가 기준 평가금액
              const investmentValue = balance * avgBuyPrice; // 매수 금액
              const profit = currentValue - investmentValue; // 평가 손익
              // 투자금액이 0보다 큰 경우에만 수익률 계산, 아니면 0
              const profitRate = investmentValue > 0 ? ((profit / investmentValue) * 100) : 0;

              return (
                <tr key={asset.currency}>
                  <td>{asset.currency}</td>
                  <td>{asset.balance}</td>
                  <td>{avgBuyPrice.toLocaleString()} KRW</td>
                  <td>{btcCurrentPrice.toLocaleString()} KRW</td>
                  <td>{currentValue.toLocaleString()} KRW</td>
                  <td style={{ color: profit >= 0 ? '#e53935' : '#1e88e5' }}>
                    {profit.toLocaleString()} KRW
                  </td>
                  <td style={{ color: profitRate >= 0 ? '#e53935' : '#1e88e5' }}>
                    {profitRate.toFixed(2)}%
                  </td>
                  <td>
                    <button
                      style={{
                        padding: '5px 10px',
                        borderRadius: '10px',
                        backgroundColor: '#72dac8',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer'
                      }}
                    >
                      매도
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </AssetTable>
    </>
  );
};

export default HoldingsTab; 