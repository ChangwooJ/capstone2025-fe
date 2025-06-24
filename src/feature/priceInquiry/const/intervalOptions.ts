export interface IntervalOption {
  label: string;
  value: string;
  defaultCount: number;
}

export const intervalOptions: IntervalOption[] = [
  { label: '1분', value: 'minutes/1', defaultCount: 6 * 24 * 1 }, 
  { label: '10분', value: 'minutes/10', defaultCount: 6 * 24 * 1 },
  { label: '30분', value: 'minutes/30', defaultCount: 6 * 24 * 1 }, 
  { label: '1시간', value: 'minutes/60', defaultCount: 6 * 24 * 1 },
  { label: '4시간', value: 'minutes/240', defaultCount: 6 * 6 },
  { label: '일', value: 'days', defaultCount: 30 },
  { label: '주', value: 'weeks', defaultCount: 30 },
  { label: '월', value: 'months', defaultCount: 30 }, 
]; 