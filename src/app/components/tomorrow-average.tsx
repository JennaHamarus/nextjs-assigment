import React from 'react';

export default function TomorrowsPriceAverage({ data }: { data: any }) {
  if (!data || !data.prices) {
    return (
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Tomorrow's Price Average</h2>
        <p className="text-red-500 mt-2">Price data not available</p>
      </div>
    );
  }

  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowISOStart = tomorrow.toISOString();
  tomorrow.setHours(23, 59, 59, 999);

  const tomorrowISOEnd = tomorrow.toISOString();

  
  const tomorrowPrices = data.prices.filter(
    (entry: { price: number; startDate: string }) =>
      entry.startDate >= tomorrowISOStart && entry.startDate <= tomorrowISOEnd
  );

  if (tomorrowPrices.length === 0) {
    return (
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Tomorrow's Average</h2>
        <p className="text-xl mt-2">Prices available after 14:00</p>
      </div>
    );
  }

  const prices = tomorrowPrices.map((entry: { price: number }) => entry.price);
  const averagePrice = prices.reduce((total: number, price: number) => total + price, 0) / prices.length;

  return (
    <div className="border p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold">Tomorrow's Average</h2>
      <p className="text-2xl mt-2">{averagePrice.toFixed(2)} EUR</p>
    </div>
  );
}
