import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import jsonData from './Data/Manufac_India_Agro_Dataset.json';
import './App.css';
const App = () => {
  const [yearlyData, setyearlyData] = useState([]);
  const [averageData, setaverageData] = useState([]);
  useEffect(() => {
    const processData = () => {
      const yearData = {};
      const cropData = {};

      jsonData.forEach((entry) => {
        const year = entry.Year.split(', ')[1];
        const production = parseFloat(entry['Crop Production (UOM:t(Tonnes))']) || 0;
        const yieldValue = parseFloat(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']) || 0;
        const area = parseFloat(entry['Area Under Cultivation (UOM:Ha(Hectares))']) || 0;
        const crop = entry['Crop Name'];
        if (!yearData[year]) {
          yearData[year] = [];
        }

        yearData[year].push({
          crop,
          production,
        });

       
      //Calculate max and min crops year
      const processedYearlyData = Object.entries(yearData).map(([year, crops]) => {
        const maxCrop = crops.reduce((max, crop) => (crop.production > max.production ? crop : max), crops[0]);
        const minCrop = crops.reduce((min, crop) => (crop.production < min.production ? crop : min), crops[0]);

        return {
          year,
          maxCrop: maxCrop.crop,
          minCrop: minCrop.crop,
        };
      });

      setyearlyData(processedYearlyData);


       //data for average table
       if (!cropData[crop]) {
        cropData[crop] = { totalYield: 0, totalArea: 0, count: 0 }
      }
      cropData[crop].totalYield += yieldValue;
      cropData[crop].totalArea += area;
      cropData[crop].count += 1;
    });
      // calculate average yield and cultivation area
      const processedAverrageData = Object.entries(cropData).map(([crop, data]) => {
        const averageYield = (data.totalYield / data.count).toFixed(3);
        const averageArea = (data.totalArea / data.count).toFixed(3);

        return {
          crop,
          averageYield,
          averageArea,
        };
      });
      setaverageData(processedAverrageData)
    };
    processData();
  }, []);

  return (
    <div>
      <h1>Indian agricultre analytics</h1>
      <Table highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Maximum Production</th>
            <th>Crop with Minimum Production</th>
          </tr>
        </thead>
        <tbody>
          {yearlyData.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{row.maxCrop}</td>
              <td>{row.minCrop}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Crop Averages</h2>
      <Table>
        <thead>

          <tr>
            <th>Crop</th>
            <th>Average Yield of the crop between(1950-2020)</th>
            <th>Average Cultivation Area of the crop between(1950-2020)</th>
          </tr>
        </thead>
        <tbody>
          {averageData.map((row) => (
            <tr key={row.crop}>
              <td>{row.crop}</td>
              <td>{row.averageYield}</td>
              <td>{row.averageArea}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;
