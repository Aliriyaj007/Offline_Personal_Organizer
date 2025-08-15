import React, { useMemo } from 'react';
import { Measurement } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  measurements: Measurement[];
  selectedMetric: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ measurements, selectedMetric }) => {
  const chartData = useMemo(() => {
    let unit = '';
    const data = measurements
      .map(m => {
        let value: number | undefined;
        if (selectedMetric === 'Weight' && m.weight) {
            value = m.weight.value;
            unit = m.weight.unit;
        } else if (selectedMetric === 'Height' && m.height) {
            value = m.height.value;
            unit = m.height.unit;
        } else if (selectedMetric === 'Body Fat' && m.bodyFat) {
            value = m.bodyFat;
            unit = '%';
        } else if (m.custom[selectedMetric]) {
            value = m.custom[selectedMetric].value;
            unit = m.custom[selectedMetric].unit;
        }
        
        return value !== undefined ? { date: m.date, value } : null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime());

      return { data, unit };
  }, [measurements, selectedMetric]);

  if (chartData.data.length < 2) {
    return (
      <div className="h-72 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <p>Not enough data to display a chart for "{selectedMetric}".<br/>Log at least two entries for this metric.</p>
      </div>
    );
  }

  const formatDateTick = (tickItem: string) => {
      return new Date(tickItem + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={chartData.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis dataKey="date" tickFormatter={formatDateTick} className="text-xs" />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} className="text-xs" unit={chartData.unit} />
          <Tooltip 
            labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString(undefined, {dateStyle: 'long'})}
            formatter={(value: number) => [`${value} ${chartData.unit}`, selectedMetric]}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '0.5rem' }}
          />
          <Legend />
          <Line type="monotone" dataKey="value" name={selectedMetric} stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;