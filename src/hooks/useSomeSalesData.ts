import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export interface SalesInsight {
  id: string;
  title: string;
}

export interface SalesData {
  rep: { name: string } | null;
  insights: SalesInsight[];
}

export const useSomeSalesData = () => {
  const [data, setData] = useState<SalesData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Simulate network fetch delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!isMounted) return;
        setData({
          rep: { name: 'Demo Rep' },
          insights: [
            { id: '1', title: 'Follow up with open leads' },
            { id: '2', title: 'Schedule calls with top prospects' },
          ],
        });
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          logger.error('Failed to fetch sales data', err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, isLoading };
};
