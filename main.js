import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, TrendingUp, TrendingDown, DollarSign, Loader } from 'lucide-react';

const generateData = (state) => {
  const { unemploymentRate, inflationRate, federalFundsRate } = state;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return months.map((month, index) => ({
    month,
    unemploymentRate: unemploymentRate + (Math.random() - 0.5) * 0.1,
    inflationRate: inflationRate + (Math.random() - 0.5) * 0.05,
    federalFundsRate: federalFundsRate + (Math.random() - 0.25) * 0.1,
  }));
};

const calculatePhillipsCurve = (unemploymentRate) => {
  const naturalUnemploymentRate = 4.0;
  const alpha = 0.5;
  const expectedInflation = 2.0;
  return expectedInflation - alpha * (unemploymentRate - naturalUnemploymentRate);
};

const scenarioPresets = {
  normal: { unemploymentRate: 4.3, inflationRate: 2.0, federalFundsRate: 5.25 },
  recession: { unemploymentRate: 7.5, inflationRate: 0.5, federalFundsRate: 0.25 },
  recovery: { unemploymentRate: 5.8, inflationRate: 3.2, federalFundsRate: 2.5 },
  boom: { unemploymentRate: 3.2, inflationRate: 4.5, federalFundsRate: 6.5 },
  stagflation: { unemploymentRate: 6.5, inflationRate: 7.0, federalFundsRate: 8.0 },
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EconomicDashboard = () => {
  const [state, setState] = useState(scenarioPresets.normal);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const debouncedState = useDebounce(state, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const generatedData = generateData(debouncedState);
      setData(generatedData);
    } catch (error) {
      console.error("Error generating data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSimulate = () => {
    const newUnemploymentRate = Math.max(
      3,
      Math.min(6, state.unemploymentRate + (Math.random() - 0.5) * 0.5)
    );

    const newInflationRate = Math.max(
      0,
      Math.min(5, calculatePhillipsCurve(newUnemploymentRate))
    );

    const newFederalFundsRate = Math.max(
      0,
      Math.min(8, state.federalFundsRate + (newInflationRate > 2 ? 0.25 : -0.25))
    );

    setState({
      unemploymentRate: newUnemploymentRate,
      inflationRate: newInflationRate,
      federalFundsRate: newFederalFundsRate,
    });
  };

  const handleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    setState(scenarioPresets[scenario]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        Economic Dashboard: Federal Reserve Policy Simulation
      </h1>

      <div className="mb-4">
        <Select value={selectedScenario} onValueChange={handleScenarioChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="recession">Recession</SelectItem>
            <SelectItem value="recovery">Recovery</SelectItem>
            <SelectItem value="boom">Economic Boom</SelectItem>
            <SelectItem value="stagflation">Stagflation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center">
            <TrendingUp className="mr-2" />
            Unemployment Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{state.unemploymentRate.toFixed(2)}%</div>
            <Slider
              value={[state.unemploymentRate]}
              onValueChange={(value) => handleChange('unemploymentRate', value[0])}
              min={3}
              max={6}
              step={0.1}
            />
            <div className="text-sm mt-2">Current: {state.unemploymentRate.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center">
            <TrendingDown className="mr-2" />
            Inflation Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{state.inflationRate.toFixed(2)}%</div>
            <Slider
              value={[state.inflationRate]}
              onValueChange={(value) => handleChange('inflationRate', value[0])}
              min={0}
              max={5}
              step={0.1}
            />
            <div className="text-sm mt-2">Current: {state.inflationRate.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center">
            <DollarSign className="mr-2" />
            Federal Funds Rate
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{state.federalFundsRate.toFixed(2)}%</div>
            <Slider
              value={[state.federalFundsRate]}
              onValueChange={(value) => handleChange('federalFundsRate', value[0])}
              min={0}
              max={8}
              step={0.25}
            />
            <div className="text-sm mt-2">Current: {state.federalFundsRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSimulate} className="mt-4">
        Simulate Next Period <ArrowRight className="ml-2" />
      </Button>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 8]} />
              <Tooltip formatter={(value, name) => `${value.toFixed(2)}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="unemploymentRate"
                stroke="#8884d8"
                name="Unemployment Rate"
              />
              <Line
                type="monotone"
                dataKey="inflationRate"
                stroke="#82ca9d"
                name="Inflation Rate"
              />
              <Line
                type="monotone"
                dataKey="federalFundsRate"
                stroke="#ffc658"
                name="Federal Funds Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Key Economic Equations</h2>
        <p>Phillips Curve: π = πe - α(u - u*)</p>
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
