import styled from 'styled-components';

export const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const ChartContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const AssetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  th:last-child, td:last-child {
    text-align: center;
  }
`;

export const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#1e88e5' : '#ced4da'};
  background-color: ${props => props.active ? '#1e88e5' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    opacity: 0.9;
  }
`;

export const DateInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 0.9rem;
`;

export const SelectInput = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 0.9rem;
`;

export const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0 8px;
  background-color: white;
`;

export const SearchInput = styled.input`
  border: none;
  padding: 8px 0;
  font-size: 0.9rem;
  outline: none;
`;

export const SearchIcon = styled.span`
  margin-left: 5px;
  color: #6c757d;
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const DashboardContainer = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e9ecef;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#1e88e5' : '#6c757d'};
  border-bottom: 2px solid ${props => props.active ? '#1e88e5' : 'transparent'};
`; 