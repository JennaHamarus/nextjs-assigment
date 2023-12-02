'use client'

import { useState, useEffect } from 'react';

interface PriceEntry {
  time: string;
  price: number;
}

function formatPriceList(data: { prices: { price: number; startDate: string }[] }): PriceEntry[] {
  return data.prices.map((entry) => ({
    time: new Date(entry.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: entry.price,
  }));
}

export default function Page() {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/get_prices');

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        const priceList = formatPriceList(data);
        setLoading(false);
        setPrices(priceList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>Tomorrow's Prices</h1>
      <ul role="list" className="divide-y divide-gray-100">
        {prices.map((entry, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">Time: <time>{entry.time}</time></p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">Price: {entry.price} €</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
