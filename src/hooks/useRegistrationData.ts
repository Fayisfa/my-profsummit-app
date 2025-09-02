// src/hooks/useRegistrationData.ts
import { useMemo } from 'react';
import { format, subDays, startOfDay } from 'date-fns';
import type { RegistrationData } from '../utils/types';

export type TimeFilter = '7d' | '30d' | '90d';

/**
 * A custom hook to process registration data for charting.
 * @param data - The raw array of registration data.
 * @param timeFilter - The active time filter ('7d', '30d', '90d').
 * @returns An object containing formatted labels and data points for the chart.
 */
export const useRegistrationData = (data: RegistrationData[], timeFilter: TimeFilter) => {
  return useMemo(() => {
    const filterDays = { '7d': 7, '30d': 30, '90d': 90 };
    const now = new Date();
    const cutoffDate = startOfDay(subDays(now, filterDays[timeFilter]));

    // Filter data and group registrations by date
    const countsByDate = data
      .filter(d => new Date(d.updated_at) >= cutoffDate)
      .reduce((acc, current) => {
        const date = format(new Date(current.updated_at), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Create labels and data points for every day in the range
    const labels: string[] = [];
    const dataPoints: number[] = [];
    for (let i = filterDays[timeFilter] - 1; i >= 0; i--) {
      const date = startOfDay(subDays(now, i));
      const formattedDate = format(date, 'yyyy-MM-dd');
      // Use a more compact date format for mobile
      const labelFormat = filterDays[timeFilter] > 7 ? 'MMM d' : 'EEE'; // e.g., "Sep 02" or "Wed"
      labels.push(format(date, labelFormat));
      dataPoints.push(countsByDate[formattedDate] || 0);
    }

    return { labels, dataPoints };
  }, [data, timeFilter]);
};