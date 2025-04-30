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

  // 데이터 변환 로직을 useMemo로 캐싱
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

  // 차트 초기 생성은 한 번만
  useEffect(() => {
    if (!chartRef.current) return;

    // 차트 인스턴스가 없을 때만 생성
    if (!chartInstance.current) {
      chartInstance.current = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 350,
        layout: { background: { color: "#ffffff" }, textColor: "#333" },
        grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
        crosshair: { mode: 0 },
        timeScale: { 
          timeVisible: true,
          shiftVisibleRangeOnNewBar: false, // 새 데이터에 따른 자동 이동 방지
          fixLeftEdge: true, // 왼쪽 가장자리 고정
          fixRightEdge: true // 오른쪽 가장자리 고정
        }
      });

      candleSeries.current = chartInstance.current.addCandlestickSeries();
      volumeSeries.current = chartInstance.current.addHistogramSeries({
        color: "#26a69a",
        priceFormat: { type: "volume" },
        priceScaleId: "",
        scaleMargins: { top: 0.85, bottom: 0 },
      });

      // 창 크기 변경 시 차트 크기 조정
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

  // 데이터만 업데이트
  useEffect(() => {
    if (!candleSeries.current || !volumeSeries.current || priceData.length === 0) return;
    
    candleSeries.current.setData(chartData);
    volumeSeries.current.setData(volumeData);
    
    // 최신 데이터로 시간축 조정
    chartInstance.current?.timeScale().fitContent();
  }, [chartData, volumeData]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "350px", // fit-content 대신 고정 높이 사용
        border: "1px solid black",
        overflow: "hidden", // 오버플로우 숨김
        position: "relative", // 포지션 설정
      }}
    />
  );
});

export default PriceChart;
