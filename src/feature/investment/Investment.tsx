import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import HoldingsTab from './components/HoldingsTab';
import ProfitTab from './components/ProfitTab';
import HistoryTab from './components/HistoryTab';
import { DashboardContainer, Tabs, Tab } from './styles/common';

export enum InvestmentTab {
  HOLDINGS = 'holdings',
  PROFIT = 'profit',
  HISTORY = 'history'
}

interface TabConfig {
  id: InvestmentTab;
  label: string;
  component: React.ReactNode;
}

const Investment = () => {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState<InvestmentTab>(InvestmentTab.HOLDINGS);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [profitRate, setProfitRate] = useState<number | string>(0);

  const onHoldingsMetricsUpdate = (newTotalProfit: number, newProfitRate: number | string) => {
    setTotalProfit(newTotalProfit);
    setProfitRate(newProfitRate);
  };

  const tabs: TabConfig[] = [
    {
      id: InvestmentTab.HOLDINGS,
      label: '보유자산',
      component: <HoldingsTab token={token} onMetricsUpdate={onHoldingsMetricsUpdate} />
    },
    {
      id: InvestmentTab.PROFIT,
      label: '투자손익',
      component: <ProfitTab token={token} totalProfit={totalProfit} profitRate={profitRate} />
    },
    {
      id: InvestmentTab.HISTORY,
      label: '거래내역',
      component: <HistoryTab token={token} />
    }
  ];

  return (
    <DashboardContainer>
      <Tabs>
        {tabs.map(({ id, label }) => (
          <Tab 
            key={id}
            active={activeTab === id}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </Tab>
        ))}
      </Tabs>

      {tabs.find(tab => tab.id === activeTab)?.component}
    </DashboardContainer>
  );
};

export default Investment;
