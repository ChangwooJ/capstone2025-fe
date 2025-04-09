import { useEffect, useRef } from 'react';
import { createChart, Time } from 'lightweight-charts';
import { priceDataType } from '../types/priceTypes';

interface PriceTitleProps {
  priceData: priceDataType[];
}

const PriceChart = ({ priceData }: PriceTitleProps) => {
  console.log(priceData);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) {
      console.log("chartRef is null");
      return;
    }
  
    if (priceData.length === 0) {
      console.log("priceData is empty");
      return;
    }
    
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(
      priceData.map(item => ({
        time: Math.floor(new Date(item.datetime).getTime() / 1000) as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );
    
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    volumeSeries.setData(
      priceData.map(item => ({
        time: item.datetime.slice(0, 10),
        value: item.volume,
        color: item.close > item.open ? '#26a69a' : '#ef5350',
      }))
    );

    return () => chart.remove();
  }, [priceData]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default PriceChart;
