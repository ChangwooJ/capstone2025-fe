import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import HoldingsTab from './components/HoldingsTab';
import ProfitTab from './components/ProfitTab';
import HistoryTab from './components/HistoryTab';
import styled from 'styled-components';

export enum InvestmentTab {
  HOLDINGS = 'holdings',
  PROFIT = 'profit',
  HISTORY = 'history'
}

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f4f7f9;
  min-height: calc(100vh - 60px);
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  ${props => props.$active && 'border-bottom-color: #007bff; font-weight: bold; color: #007bff;'}
  &:hover {
    color: #0056b3;
  }
`;

const Investment = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState('holdings');
  
  return (
    <Container>
      <TabContainer>
        <TabButton $active={activeTab === 'holdings'} onClick={() => setActiveTab('holdings')}>
          보유 자산
        </TabButton>
        <TabButton $active={activeTab === 'profit'} onClick={() => setActiveTab('profit')}>
          투자 손익
        </TabButton>
        <TabButton $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          거래 내역
        </TabButton>
      </TabContainer>

      {
        activeTab === 'holdings' ? <HoldingsTab token={token} /> : 
        activeTab === 'profit' ? <ProfitTab token={token} /> : 
        activeTab === 'history' ? <HistoryTab token={token} /> : null
      }
    </Container>
  );
};

export default Investment;
