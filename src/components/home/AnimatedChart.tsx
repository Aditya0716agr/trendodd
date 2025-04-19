
import { useEffect, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const generateData = () => {
  const numberOfDays = 30;
  const data = [];
  
  // Starting price between 30 and 70
  let yesPrice = Math.random() * 40 + 30;
  
  for (let i = 0; i < numberOfDays; i++) {
    // Random price movement between -5 and +5
    const volatility = 5;
    const change = (Math.random() * volatility * 2) - volatility;
    
    // Make sure price stays between 1 and 99
    yesPrice = Math.max(1, Math.min(99, yesPrice + change));
    const noPrice = 100 - yesPrice;
    
    const date = new Date();
    date.setDate(date.getDate() - (numberOfDays - i));
    
    data.push({
      date: date.toLocaleDateString(),
      yes: Math.round(yesPrice),
      no: Math.round(noPrice)
    });
  }
  
  return data;
};

interface AnimatedChartProps {
  className?: string;
}

const AnimatedChart = ({ className = "" }: AnimatedChartProps) => {
  const [chartData, setChartData] = useState(generateData());
  
  // Periodically update chart data for animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const data = [...chartData];
      const lastPoint = data[data.length - 1];
      
      // Create new point with slight variation
      const volatility = 3;
      const change = (Math.random() * volatility * 2) - volatility;
      let newYesPrice = Math.round(Math.max(1, Math.min(99, lastPoint.yes + change)));
      const newNoPrice = 100 - newYesPrice;
      
      // Add new date
      const newDate = new Date();
      
      // Remove first point and add new point
      data.shift();
      data.push({
        date: newDate.toLocaleDateString(),
        yes: newYesPrice,
        no: newNoPrice
      });
      
      setChartData(data);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [chartData]);
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (chartData.length <= 10) return value;
              // Show only some dates to avoid overcrowding
              const idx = chartData.findIndex(item => item.date === value);
              return idx % 5 === 0 ? value : '';
            }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}¢`}
          />
          <Tooltip 
            formatter={(value) => [`${value}¢`, undefined]}
            contentStyle={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="yes" 
            stroke="var(--market-yes)" 
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          <Line 
            type="monotone" 
            dataKey="no" 
            stroke="var(--market-no)" 
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
