import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const generateData = (unemploymentRate, inflationRate, federalFundsRate) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    month,
    unemploymentRate: unemploymentRate + (Math.random() - 0.5) * 0.2,
    inflationRate: inflationRate + (Math.random() - 0.5) * 0.1,
    federalFundsRate: federalFundsRate + (Math.random() - 0.5) * 0.05,
  }));
};

const calculatePhillipsCurve = (unemploymentRate, inflationRate) => {
  // Simple Phillips Curve: π = -α(u - u*) + πe
  // Where π is inflation, u is unemployment, u* is natural rate of unemployment,
  // πe is expected inflation, and α is a positive constant
  const naturalUnemploymentRate = 4.0;
  const alpha = 0.5;
  const expectedInflation = 2.0;
  
  return expectedInflation - alpha * (unemploymentRate - naturalUnemploymentRate);
};

const EconomicDashboard = () => {
  const [unemploymentRate, setUnemploymentRate] = useState(4.3);
  const [inflationRate, setInflationRate] = useState(2.0);
  const [federalFundsRate, setFederalFundsRate] = useState(5.25);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateData(unemploymentRate, inflationRate, federalFundsRate));
  }, [unemploymentRate, inflationRate, federalFundsRate]);

  const handleSimulate = () => {
    const newUnemploymentRate = unemploymentRate + (Math.random() - 0.5) * 0.5;
    const newInflationRate = calculatePhillipsCurve(newUnemploymentRate, inflationRate);
    const newFederalFundsRate = federalFundsRate + (newInflationRate > 2 ? 0.25 : -0.25);

    setUnemploymentRate(Number(newUnemploymentRate.toFixed(2)));
    setInflationRate(Number(newInflationRate.toFixed(2)));
    setFederalFundsRate(Number(newFederalFundsRate.toFixed(2)));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Economic Dashboard: Federal Reserve Policy Simulation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center">
            <TrendingUp className="mr-2" />
            Unemployment Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unemploymentRate.toFixed(2)}%</div>
            <Slider
              value={[unemploymentRate]}
              onValueChange={(value) => setUnemploymentRate(value[0])}
              min={3}
              max={6}
              step={0.1}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex items-center">
            <TrendingDown className="mr-2" />
            Inflation Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inflationRate.toFixed(2)}%</div>
            <Slider
              value={[inflationRate]}
              onValueChange={(value) => setInflationRate(value[0])}
              min={0}
              max={5}
              step={0.1}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex items-center">
            <DollarSign className="mr-2" />
            Federal Funds Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{federalFundsRate.toFixed(2)}%</div>
            <Slider
              value={[federalFundsRate]}
              onValueChange={(value) => setFederalFundsRate(value[0])}
              min={0}
              max={8}
              step={0.25}
            />
          </CardContent>
        </Card>
      </div>
      
      <Button onClick={handleSimulate} className="mt-4">
        Simulate Next Period <ArrowRight className="ml-2" />
      </Button>
      
      <div className="mt-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="unemploymentRate" stroke="#8884d8" name="Unemployment Rate" />
            <Line type="monotone" dataKey="inflationRate" stroke="#82ca9d" name="Inflation Rate" />
            <Line type="monotone" dataKey="federalFundsRate" stroke="#ffc658" name="Federal Funds Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Key Economic Equations</h2>
        <p>Phillips Curve: π = -α(u - u*) + πe</p>
        <p>Where:</p>
        <ul className="list-disc list-inside">
          <li>π is inflation</li>
          <li>u is unemployment rate</li>
          <li>u* is natural rate of unemployment (assumed 4.0% in this simulation)</li>
          <li>πe is expected inflation (assumed 2.0% in this simulation)</li>
          <li>α is a positive constant (set to 0.5 in this simulation)</li>
        </ul>
      </div>
    </div>
  );
};

export default EconomicDashboard;
