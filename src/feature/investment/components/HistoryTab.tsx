import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AssetTable, FilterButton, FilterGroup } from '../styles/common';
import { getTradeLogs } from '../../../apis/tradeApis';

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
  min-height: 200px;
`;

const HistoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
`;

const HistoryTable = styled(AssetTable)`
  th:last-child,
  td:last-child {
    text-align: left;
  }
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: #495057;
  margin-right: 12px;
  min-width: 40px;
`;

const DateRangeDisplay = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 12px;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return '-';
  
  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

interface HistoryTabProps {
  token: string | null;
}

const HistoryTab = ({ token }: HistoryTabProps) => {
  const [tradeLogs, setTradeLogs] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1개월');
  const [selectedType, setSelectedType] = useState('전체');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchTradeLogs = async () => {
    if (!token) {
      console.log("토큰이 없습니다. 거래내역을 가져올 수 없습니다.");
      return;
    }

    setLoading(true);
    
    const logData = await getTradeLogs({token, selectedType, startDate, endDate});
    setTradeLogs(logData);
    if (tradeLogs) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (selectedPeriod) {
      case '1주':
        start.setDate(today.getDate() - 7);
        break;
      case '1개월':
        start.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        start.setMonth(today.getMonth() - 3);
        break;
      case '6개월':
        start.setMonth(today.getMonth() - 6);
        break;
      default:
        setStartDate(undefined);
        setEndDate(undefined);
        return;
    }

    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');
    const formattedStartDate = `${yyyy}-${mm}-${dd}`;

    const endYyyy = end.getFullYear();
    const endMm = String(end.getMonth() + 1).padStart(2, '0');
    const endDd = String(end.getDate()).padStart(2, '0');
    const formattedEndDate = `${endYyyy}-${endMm}-${endDd}`;

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  }, [selectedPeriod]);

  useEffect(() => {
    fetchTradeLogs();
  }, [token, selectedType, startDate, endDate]);

  return (
    <>
      <HistoryFilters>
        <FilterGroup>
          <FilterLabel>기간</FilterLabel>
          <FilterButton
            $active={selectedPeriod === '1주'}
            onClick={() => setSelectedPeriod('1주')}
            disabled={loading}
          >1주</FilterButton>
          <FilterButton
            $active={selectedPeriod === '1개월'}
            onClick={() => setSelectedPeriod('1개월')}
            disabled={loading}
          >1개월</FilterButton>
          <FilterButton
            $active={selectedPeriod === '3개월'}
            onClick={() => setSelectedPeriod('3개월')}
            disabled={loading}
          >3개월</FilterButton>
          <FilterButton
            $active={selectedPeriod === '6개월'}
            onClick={() => setSelectedPeriod('6개월')}
            disabled={loading}
          >6개월</FilterButton>
          {startDate && endDate && (
            <DateRangeDisplay>
              {startDate} ~ {endDate}
            </DateRangeDisplay>
          )}
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>종류</FilterLabel>
          <FilterButton
            $active={selectedType === '전체'}
            onClick={() => setSelectedType('전체')}
            disabled={loading}
          >전체</FilterButton>
          <FilterButton
            $active={selectedType === '매수'}
            onClick={() => setSelectedType('매수')}
            disabled={loading}
          >매수</FilterButton>
          <FilterButton
            $active={selectedType === '매도'}
            onClick={() => setSelectedType('매도')}
            disabled={loading}
          >매도</FilterButton>
        </FilterGroup>
      </HistoryFilters>

      <TableContainer>
        {loading && (
          <LoadingOverlay>
            <Spinner />
          </LoadingOverlay>
        )}
        <HistoryTable>
          <thead>
            <tr>
              <th>체결시간</th>
              <th>코인</th>
              <th>마켓</th>
              <th>종류</th>
              <th>거래수량</th>
              <th>거래단가</th>
              <th>거래금액</th>
              <th>수수료</th>
              <th>정산금액</th>
              <th>주문시간</th>
            </tr>
          </thead>
          <tbody>
            {tradeLogs.map((log, index) => (
              <tr key={index}>
                <td>{formatDateTime(log.executed_at || log.created_at)}</td>
                <td>{log.market ? log.market.split('-')[1] : '?'}</td>
                <td>{log.market || '?'}</td>
                <td style={{ color: log.side === 'ask' ? '#e53935' : '#1e88e5' }}>
                  {log.side === 'bid' ? '매수' : log.side === 'ask' ? '매도' : '알 수 없음'}
                </td>
                <td>{log.volume}</td>
                <td>{log.price}</td>
                <td>{(parseFloat(log.volume) * parseFloat(log.price)).toLocaleString()}</td>
                <td>{log.paid_fee}</td>
                <td>{log.executed_volume}</td>
                <td>{formatDateTime(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </HistoryTable>
      </TableContainer>
    </>
  );
};

export default HistoryTab; 