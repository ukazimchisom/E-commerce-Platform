"use client";

import { useEffect, useState } from "react";

interface UseExchangeRateReturn {
  rate: number | null;
  isLoading: boolean;
  error: string | null;
}

// Module-level cache so we only fetch once per browser session
let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function useExchangeRate(): UseExchangeRateReturn {
  const [rate, setRate] = useState<number | null>(cachedRate);
  const [isLoading, setIsLoading] = useState(cachedRate === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use cache if fresh
    const isCacheFresh =
      cachedRate !== null &&
      cacheTimestamp !== null &&
      Date.now() - cacheTimestamp < CACHE_DURATION_MS;

    if (isCacheFresh) {
      setRate(cachedRate);
      setIsLoading(false);
      return;
    }

    const fetchRate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

        if (!apiKey) {
          throw new Error("Exchange rate API key is not set.");
        }

        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/NGN`,
        );

        if (!res.ok) {
          throw new Error(`Exchange rate API error: ${res.status}`);
        }

        const data = await res.json();

        if (data.result !== "success") {
          throw new Error(data["error-type"] ?? "Unknown API error");
        }

        const fetchedRate: number = data.conversion_rate;

        // Update module-level cache
        cachedRate = fetchedRate;
        cacheTimestamp = Date.now();

        setRate(fetchedRate);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch exchange rate";
        console.error("[useExchangeRate]", message);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, isLoading, error };
}
