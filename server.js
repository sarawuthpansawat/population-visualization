const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
app.use(cors());

// Correct the file path
const filePath = path.join(__dirname, 'population-and-demography.csv');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

// Convert field names to snake case
const toSnakeCase = (str) => {
  return str
    .replace(/\s+/g, '_')            // Replace spaces with underscores
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`) // Convert camel case to snake case
    .replace(/^_/, '');              // Remove leading underscore if it exists
};

const convertKeysToSnakeCase = (data) => {
  return data.map(record => {
    const newRecord = {};
    for (let key in record) {
      const snakeCaseKey = toSnakeCase(key);
      newRecord[snakeCaseKey] = record[key];
    }
    return newRecord;
  });
};

app.get('/api/population', (req, res) => {
  const snakeCaseData = convertKeysToSnakeCase(data);
  // const limitedData = snakeCaseData.slice(0, 217); // Limit to 217 records
  // res.json(limitedData);
   res.json(snakeCaseData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
