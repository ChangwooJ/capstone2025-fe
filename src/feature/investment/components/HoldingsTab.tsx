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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  grid-template-columns: 1fr 300px;
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
`;

const ChartInfo = styled.div`
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

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  height: fit-content;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;

  .asset-name {
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asset-value {
    font-size: 0.875rem;
    color: #64748b;
  }

  .asset-percent {
    font-size: 0.875rem;
    font-weight: 600;
    color: #3b82f6;
    background: #eff6ff;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    width: fit-content;
  }
`;

const AssetIcon = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ColorBox = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${props => props.color};
  margin-right: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      font-size: 0.75rem;
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

const HoldingsTab = ({ token }: HoldingsTabProps) => {
  const [assets, setAssets] = useState<UpbitAsset[] | null>([]);
  const [btcCurrentPrice, setBtcCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const getAssetIcon = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return '₿';
      case 'KRW':
        return '₩';
      default:
        return currency.charAt(0);
    }
  };

  return (
    <TableContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      <SummaryGrid>
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
      </SummaryGrid>

      <ChartWrapper>
        <h3>자산 비중</h3>
        <ChartContent>
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
                <span>{assets?.find(a => a.currency === 'KRW')?.balance || '0'} KRW</span>
              </InfoItem>
            </ChartInfo>
          </ChartSection>

          <LegendContainer>
            {pieData.map(({ name, value, percent }: { name: string; value: number; percent: string }, index: number) => (
              <LegendItem key={`legend-${index}`}>
                <ColorBox color={COLORS[index % COLORS.length]} />
                <LegendText>
                  <div className="asset-name">
                    <AssetIcon $color={COLORS[index % COLORS.length]}>
                      {getAssetIcon(name)}
                    </AssetIcon>
                    {name}
                  </div>
                  <div className="asset-value">
                    {value.toLocaleString()} KRW
                  </div>
                  <div className="asset-percent">
                    {percent}%
                  </div>
                </LegendText>
              </LegendItem>
            ))}
          </LegendContainer>
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
                  <td>{parseFloat(asset.balance).toFixed(8)}</td>
                  <td>{avgBuyPrice.toLocaleString()} KRW</td>
                  <td>{btcCurrentPrice.toLocaleString()} KRW</td>
                  <td>{currentValue.toLocaleString()} KRW</td>
                  <td style={{ 
                    color: profit >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {profit.toLocaleString()} KRW
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