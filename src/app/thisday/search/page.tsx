'use client'
import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Inter } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });

const PRICE_ENDPOINT = "/api/latest-prices.json";

interface Price {
  price: number;
  startDate: string;
  endDate: string;
}

interface ApiResponse {
  prices: Price[];
}

export default function MenuWithSearchInput() {
  const [selectedPrices, setSelectedPrices] = useState<ApiResponse["prices"]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [dateSuggestions, setDateSuggestions] = useState<
    { label: string; value: string }[]
  >([]);
  const [hourSuggestions, setHourSuggestions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const apiResponse = await fetch(PRICE_ENDPOINT);
      const data: ApiResponse = await apiResponse.json();

      if ("prices" in data) {
        setSelectedPrices(data.prices);

        const formattedDates = data.prices.map((entry: Price) => ({
          label: new Date(entry.startDate).toLocaleDateString(),
          value: entry.startDate,
        }));
        const formattedHours = data.prices.map((entry: Price) => ({
          label: new Date(entry.startDate).getUTCHours().toString(),
          value: new Date(entry.startDate).getUTCHours().toString(),
        }));

        setDateSuggestions(formattedDates);
        setHourSuggestions(formattedHours);
      } else {
        console.error("Invalid API response:", data);
      }
    } catch (error) {
      console.error("Error searching for prices:", error);
    }
  };
  fetchData();
  }, []);

  useEffect(() => {
    if (selectedPrice !== null && selectedPrices.length > 0) {
      const selectedPriceData = selectedPrices.find((price) => price.price === selectedPrice);

      if (selectedPriceData) {
        const formattedDateTime = `${formatDate(selectedPriceData.startDate)} at ${new Date(
          selectedPriceData.startDate
        ).getUTCHours() + 2}:00`;
        setSelectedDateTime(formattedDateTime);
      }
    } else {
      setSelectedDateTime(null);
    }
  }, [selectedPrice, selectedPrices]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}`;
  };

  const handlePriceSelect = (price: ApiResponse["prices"][0]) => {
    setSelectedPrice(price.price);
    console.log(`Selected price is ${price.price}`);
    console.log(`Selected date is ${formatDate(price.startDate)}`);
  };

  return (
    
    <Menu
      dismiss={{
        itemPress: true,
      }}
      >
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>Search</h1>
      <div>
      <MenuHandler>
        <Button 
          className="bg-transparent  text-teal-600 font-semibold hover:text-white py-2 px-4 border border-teal-600 hover:border-teal-600 rounded"
        >
          Select hour
        </Button>
      </MenuHandler>
      </div>
      
      <br/>
      <MenuList 
        className="w-40 text-sm font-semibold leading-6 text-gray-500 bg-black bg-opacity-100 border-gray-500 divide-y divide-gray-100">
        {selectedPrices.map((price, index) => (
          <MenuItem 
            className="border-gray-500 hover:text-teal-600"
            key={index} onClick={() => handlePriceSelect(price)}>
              {`${formatDate(price.startDate)}`} <br/> {`${new Date(
              price.startDate
              ).getUTCHours() +2}:00 - ${new Date(price.endDate).getUTCHours() +2}:00`}
          </MenuItem>
        ))}
      </MenuList>
      {selectedPrice !== null && (
        <p> {selectedDateTime} <br /> Price: {selectedPrice}</p>
      )}
    </Menu>
    
  );
}





