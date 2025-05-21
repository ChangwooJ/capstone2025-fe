import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { priceDataType } from '../types/priceTypes';

interface PriceTitleProps {
  priceData: priceDataType[];
}

const PriceChart = React.memo(({ priceData }: PriceTitleProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeries = useRef<ISeriesApi<'Histogram'> | null>(null);

  const chartData = useMemo(() => {
    return priceData.map((item) => ({
      time: Math.floor(new Date(item.datetime).getTime() / 1000) as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
  }, [priceData]);

  const volumeData = useMemo(() => {
    return priceData.map((item) => ({
      time: Math.floor(new Date(item.datetime).getTime() / 1000) as Time,
      value: item.volume,
      color: item.close > item.open ? "#26a69a" : "#ef5350",
    }));
  }, [priceData]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 350,
        layout: { background: { color: "#ffffff" }, textColor: "#333" },
        grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
        crosshair: { mode: 0 },
        timeScale: { 
          timeVisible: true,
          shiftVisibleRangeOnNewBar: false,
          fixLeftEdge: true,
          fixRightEdge: true 
        }
      });

      candleSeries.current = chartInstance.current.addCandlestickSeries();
      volumeSeries.current = chartInstance.current.addHistogramSeries({
        color: "#26a69a",
        priceFormat: { type: "volume" },
        priceScaleId: "",
        scaleMargins: { top: 0.85, bottom: 0 },
      });

      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current && chartInstance.current) {
          chartInstance.current.applyOptions({
            width: chartRef.current.clientWidth
          });
        }
      });
      resizeObserver.observe(chartRef.current);

      return () => {
        resizeObserver.disconnect();
        chartInstance.current?.remove();
        chartInstance.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (!candleSeries.current || !volumeSeries.current || priceData.length === 0) return;
    
    candleSeries.current.setData(chartData);
    volumeSeries.current.setData(volumeData);
    
    chartInstance.current?.timeScale().fitContent();
  }, [chartData, volumeData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "350px",
        border: "1px solid black",
        overflow: "hidden",
        position: "relative",
      }}
    />
  );
});

export default PriceChart;
