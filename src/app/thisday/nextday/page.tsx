'use client'

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

interface FormattedPrice {
  time: string;
  price: number;
}

interface PriceData {
  prices: { price: number; startDate: string; endDate: string }[];
}

export default function NextDaysPrices() {
  const [data, setData] = useState<PriceData>({ prices: [] });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/latest-prices.json')
      .then((res) => res.json())
      .then((responseData: PriceData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Tomorrow's Prices</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (data) {
    console.log("dataa löytyy", data);
  }

  

  const formattedPrices: FormattedPrice[] = data.prices.map((entry) => ({
    time: new Date(entry.startDate).toISOString(),
    price: entry.price,
  }));

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const tomorrowDateString = tomorrow.toISOString().split('T')[0];

  const tomorrowPrices: FormattedPrice[] = formattedPrices.filter((entry) => {
    const entryDateString = entry.time.split('T')[0];
    return entryDateString === tomorrowDateString;
  })
  .map((entry) => ({
    time: new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC'  }),
    price: entry.price,
  }))
  .sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a.time}`).getTime();
    const timeB = new Date(`2000-01-01T${b.time}`).getTime();
    return timeA - timeB;
  })
  .reverse();

  if (tomorrowPrices.length === 0) {
    console.log("no profile data", data);
    return (
      <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Tomorrow's Prices</h1>
        <p>Prices available after 14.00</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Tomorrow's Prices</h1>
      <ul role="list" className="divide-y divide-gray-100">
        {tomorrowPrices.map((entry, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-teal-600">Time: <time>{entry.time}</time></p>
                <p className="mt-1 truncate text-s leading-5 text-gray-500">Price: {entry.price} cents/kwh</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
