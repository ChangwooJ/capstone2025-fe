export interface priceDataType {
  id: number;
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceTitleProps {
  priceData: priceDataType[];
}