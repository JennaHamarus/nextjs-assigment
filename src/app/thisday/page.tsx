'use client'

import { Inter } from 'next/font/google';
import { Chart as ChartJS, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

// Tyyppimäärittelyt
export const inter = Inter({ subsets: ['latin'] });

export type CustomError = {
  message: string;
};

// Käytetään tyypitettyä ChartOptionsia
const chartOptions: ChartOptions = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

// Funktio datan noutamiseksi
async function getData() {
  try {
    const res = await fetch('http://localhost:5000/get_prices'); // Käytä serverin osoitetta

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

// Funktio datan muotoilemiseksi Chart-komponentin tarpeisiin
function formatChartData(data: { prices: { price: number; startDate: string }[] }): any {
  const prices = data.prices.map((entry) => entry.price);
  const labels = data.prices.map((entry) => entry.startDate);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Hinta',
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
}

// Komponentti
export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <main>
        <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Todays Prices</h1>
        <p>Loading data...</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Todays Prices</h1>
      <div className="chart-container">
        <Bar data={formatChartData(data)} options={chartOptions as any} plugins={[Tooltip, Legend]} />
      </div>
    </main>
  );
}