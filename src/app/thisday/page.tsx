'use client'

import { Inter } from 'next/font/google';
import { Chart as ChartJS, Tooltip, Legend, ChartOptions } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import 'chartjs-adapter-moment';
import NextHourPrice from '../components/nexthour';
import TodaysPriceAverage from '../components/today-average';
import TomorrowsPriceAverage from '../components/tomorrow-average';

// Tyyppimäärittelyt
export const inter = Inter({ subsets: ['latin'] });

export type CustomError = {
  message: string;
};


// Komponentti
export default function TodaysPrices() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/latest-prices.json')
      .then((res) => res.json())
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch ((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if(isLoading)
  return(
    <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Today's Prices</h1>
        <p>Loading...</p>
      </main>
  )


  if (!data) {
    console.log("no profile data", data)
    return (
      <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Today's Prices</h1>
        <p>No data</p>
      </main>
    );
  }

  

  // Käytetään tyypitettyä ChartOptionsia
  const chartOptions: ChartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm', // Asetetaan näyttömuoto 'HH:mm' 24-tuntiselle ajanformaatille
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Funktio datan muotoilemiseksi Chart-komponentin tarpeisiin
  function formatChartData(data: { prices: { price: number; startDate: string }[] }): any {
  const today = new Date().toISOString().split('T')[0]; // Tämän päivän päivämäärä muodossa "YYYY-MM-DD"

  // Suodata vain tämän päivän tiedot
  const todayPrices = data.prices.filter((entry) => entry.startDate.startsWith(today));

  const prices = todayPrices.map((entry) => entry.price);
  const labels = todayPrices.map((entry) => entry.startDate);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Prices',
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  }


  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Today's Prices</h1>
      <div className="chart-container">
        <Bar data={formatChartData(data)} options={chartOptions as any} plugins={[Tooltip, Legend]} />
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 p-4">
          <NextHourPrice data={data} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <TodaysPriceAverage data={data} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <TomorrowsPriceAverage data={data} />
        </div>
      </div>
    </main>
  );
}