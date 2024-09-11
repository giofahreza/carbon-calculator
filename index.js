const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Constants for carbon emission factors (in kg CO2 per unit)
const CARBON_EMISSION_FACTORS = {
  electricity: 0.233, // kg CO2 per kWh
  gas: 0.185, // kg CO2 per kWh
  car: 0.271, // kg CO2 per mile
  publicTransport: 0.089, // kg CO2 per mile
};

// Route to calculate carbon footprint
app.post('/calculate', (req, res) => {
  const { energyType, energyAmount, transportType, transportDistance } = req.body;

  if (!CARBON_EMISSION_FACTORS[energyType] || !CARBON_EMISSION_FACTORS[transportType]) {
    return res.status(400).json({ error: 'Invalid energy or transport type. only use : electricity / gas / car / publicTransport' });
  }

  if (typeof energyAmount !== 'number' || typeof transportDistance !== 'number') {
    return res.status(400).json({ error: 'Energy amount and transport distance must be numbers' });
  }

  const energyFootprint = CARBON_EMISSION_FACTORS[energyType] * energyAmount;
  const transportFootprint = CARBON_EMISSION_FACTORS[transportType] * transportDistance;
  const totalFootprint = energyFootprint + transportFootprint;

  res.json({
    status: 'success',
    code: 200,
    data : {
        energyFootprint: energyFootprint.toFixed(2),
        transportFootprint: transportFootprint.toFixed(2),
        totalFootprint: totalFootprint.toFixed(2),
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Carboncentrik Calculator API listening at http://localhost:${port}`);
});
