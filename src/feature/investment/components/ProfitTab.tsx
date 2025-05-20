import styled from 'styled-components';
import { SummaryCard, ChartContainer, AssetTable } from '../styles/common';

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
`;

const ProfitChartContainer = styled(ChartContainer)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ChartPlaceholder = styled.div`
  flex: 1;
  min-width: 300px;
  height: 200px;
  background: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: #6c757d;
`;

const ProfitDetailTable = styled(AssetTable)`
  margin-top: 24px;
`;

interface ProfitTabProps {
    token: string | null;
    totalProfit: number;
    profitRate: number | string;
}

const ProfitTab = ({ totalProfit, profitRate }: ProfitTabProps) => {
  return (
    <>
      <DateRange>
        2025년 05월 01일 ~ 2025년 05월 19일의 투자손익
      </DateRange>
      <ProfitSummaryGrid>
        <ProfitSummaryCard>
          <h3>기간 누적 손익</h3>
          <div style={{ color: totalProfit >= 0 ? '#e53935' : '#1e88e5' }}>
            {totalProfit.toLocaleString()} KRW
          </div>
        </ProfitSummaryCard>
        <ProfitSummaryCard>
          <h3>기간 누적 수익률</h3>
          <div style={{ color: totalProfit >= 0 ? '#e53935' : '#1e88e5' }}>
            {profitRate} %
          </div>
        </ProfitSummaryCard>
        <ProfitSummaryCard>
          <h3>기간 평균 투자금액</h3>
          <div>14,374 KRW</div>
        </ProfitSummaryCard>
      </ProfitSummaryGrid>

      <ProfitChartContainer>
        <ChartPlaceholder>누적 수익률 그래프</ChartPlaceholder>
        <ChartPlaceholder>손익 그래프</ChartPlaceholder>
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
            <th>입금</th>
            <th>출금</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>05.19</td>
            <td style={{ color: -122 >= 0 ? '#e53935' : '#1e88e5' }}>-122</td>
            <td style={{ color: -0.47 >= 0 ? '#e53935' : '#1e88e5' }}>-0.47%</td>
            <td style={{ color: 483 >= 0 ? '#e53935' : '#1e88e5' }}>483</td>
            <td style={{ color: 3.36 >= 0 ? '#e53935' : '#1e88e5' }}>3.36%</td>
            <td>25,606</td>
            <td>25,484</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>05.18</td>
            <td style={{ color: 277 >= 0 ? '#e53935' : '#1e88e5' }}>277</td>
            <td style={{ color: 1.09 >= 0 ? '#e53935' : '#1e88e5' }}>1.09%</td>
            <td style={{ color: 605 >= 0 ? '#e53935' : '#1e88e5' }}>605</td>
            <td style={{ color: 4.40 >= 0 ? '#e53935' : '#1e88e5' }}>4.40%</td>
            <td>25,329</td>
            <td>25,606</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </ProfitDetailTable>
    </>
  );
};

export default ProfitTab; 