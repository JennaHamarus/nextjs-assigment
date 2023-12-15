import React from 'react';

export default function TodaysPriceAverage({ data }: { data: any }) {
  if (!data || !data.prices) {
    return (
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Today's Price Average</h2>
        <p className="text-red-500 mt-2">Price data not available</p>
      </div>
    );
  }

  // Laske tämän päivän hintojen keskiarvo
  const today = new Date().toISOString().split('T')[0]; // Tämän päivän päivämäärä muodossa "YYYY-MM-DD"
  const todayStartDate = new Date(today + 'T00:00:00.000Z').toISOString(); // Tämän päivän klo 00.00
  const todayEndTime = new Date(today + 'T23:59:59.999Z').toISOString(); // Tämän päivän klo 23.59

  // Suodata vain tämän päivän tiedot, jotka ovat klo 00.00 ja klo 23.59 välillä
  const todayPrices = data.prices.filter(
    (entry: { price: number; startDate: string }) =>
      entry.startDate >= todayStartDate && entry.startDate <= todayEndTime
  );

  if (todayPrices.length === 0) {
    return (
      <div className="border p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold">Today's Price Average</h2>
        <p className="text-red-500 mt-2">No price data available for today</p>
      </div>
    );
  }

  const prices = todayPrices.map((entry: { price: number }) => entry.price);
  const averagePrice = prices.reduce((total: number, price: number) => total + price, 0) / prices.length;

  return (
    <div className="border p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold">Today's Average</h2>
      <p className="text-2xl mt-2">{averagePrice.toFixed(2)} EUR</p>
    </div>
  );
}
