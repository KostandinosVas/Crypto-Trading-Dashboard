'use client';

import { useEffect, useRef } from 'react';
import { createChart, AreaSeries, type IChartApi, type UTCTimestamp  } from 'lightweight-charts';
import type { Candle } from '@/lib/types';
import { AREA_COLORS } from '@/lib/colors';

export function CandlestickChart({ data, isUp = true }: { data: Candle[]; isUp?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
    });
    chartRef.current = chart;

  const colors = AREA_COLORS[isUp ? 'up' : 'down'];

  const areaSeries = chart.addSeries(AreaSeries, {
    lineColor: colors.line,
    topColor: colors.top,
    bottomColor: colors.bottom,
    lineWidth: 2,
  });

    areaSeries.setData(
      data.map((candle) => ({
        time: (candle.openTime / 1000) as UTCTimestamp,
        value: candle.close,
      }))
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data, isUp]);

  return <div ref={containerRef} />;
}



/*
Εξήγηση γραμμή-γραμμή:

useRef<HTMLDivElement> → Το lightweight-charts δεν είναι React component,
 είναι imperative βιβλιοθήκη (ζωγραφίζει σε <canvas> απευθείας με JS, όχι μέσω React re-renders). 
 Χρειαζόμαστε ένα πραγματικό DOM node να του δώσουμε, γι' αυτό useRef — είναι το "καταπάκτι" (escape hatch) που δίνει το React για να αγγίξεις DOM/βιβλιοθήκες εκτός React model.

chartRef → κρατάει reference στο ίδιο το chart instance, ώστε να μπορούμε να το κάνουμε cleanup αργότερα.

useEffect(() => {...}, [data]) → Το chart δημιουργείται μέσα σε effect, όχι απευθείας στο render, 
 γιατί χρειάζεται πραγματικό DOM node να υπάρχει ήδη (το containerRef.current). 
 Τρέχει ξανά κάθε φορά που αλλάζει το data (π.χ. αν αργότερα αλλάξεις symbol).

chart.addSeries(CandlestickSeries, {...}) → το v5 API που ανέφερα. 
 Τα χρώματα (upColor/downColor) καθορίζουν πράσινο για ανοδικά κεριά, κόκκινο για πτωτικά — industry standard convention.

time: (candle.openTime / 1000) as any → σημαντικό σημείο: το Binance δίνει openTime σε milliseconds, 
 αλλά το lightweight-charts περιμένει Unix timestamp σε seconds. 
  Γι' αυτό διαιρούμε με 1000. Το as any είναι προσωρινό compromise λόγω αυστηρού TypeScript type του lightweight-charts (θα το καθαρίσουμε αν χρειαστεί αργότερα).
  
return () => { chart.remove(); } → αυτό είναι το cleanup function του useEffect.
 Όταν το component unmount-άρει (ή ξανατρέξει το effect), καταστρέφουμε το παλιό chart instance πρώτα.
  Χωρίς αυτό, θα είχες memory leak — κάθε φορά που το effect ξανατρέχει,
   θα δημιουργούνταν νέο chart πάνω στο ίδιο DOM node χωρίς να καθαρίζει το προηγούμενο.
*/ 