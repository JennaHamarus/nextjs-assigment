import React, { useState, useEffect } from 'react';

export default function NextHourPrice({ data }: { data: any }) {
  const [nextHourPrice, setNextHourPrice] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.prices) {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const nextHourISO = nextHour.toISOString();

      const nextHourPriceData = data.prices.find(
        (entry: { price: number; startDate: string; endDate: string }) =>
          entry.startDate <= nextHourISO && entry.endDate >= nextHourISO
      );

      if (nextHourPriceData) {
        setNextHourPrice(nextHourPriceData.price);
      }
    }
  }, [data]);

  return (
    <div className="border p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold">Next Hour Price</h2>
      {nextHourPrice !== null ? (
        <p className="text-2xl mt-2">{nextHourPrice} EUR</p>
      ) : (
        <p className="text-red-500 mt-2">Price data not available</p>
      )}
    </div>
  );
}
