import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const generateData = () => {
  const numberOfDays = 30;
  const data = [];

  let yesPrice = Math.random() * 40 + 30;

  for (let i = 0; i < numberOfDays; i++) {
    const volatility = 5;
    const change = (Math.random() * volatility * 2) - volatility;

    yesPrice = Math.max(1, Math.min(99, yesPrice + change));
    const noPrice = 100 - yesPrice;

    const date = new Date();
    date.setDate(date.getDate() - (numberOfDays - i));

    data.push({
      date: date.toLocaleDateString(),
      yes: Math.round(yesPrice),
      no: Math.round(noPrice),
    });
  }

  return data;
};

interface AnimatedChartProps {
  className?: string;
}

const AnimatedChart = ({ className = '' }: AnimatedChartProps) => {
  const [chartData, setChartData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];

        const volatility = 3;
        const change = (Math.random() * volatility * 2) - volatility;
        const newYesPrice = Math.round(Math.max(1, Math.min(99, lastPoint.yes + change)));
        const newNoPrice = 100 - newYesPrice;
        const newDate = new Date();

        newData.shift(); // remove first
        newData.push({
          date: newDate.toLocaleDateString(),
          yes: newYesPrice,
          no: newNoPrice,
        });

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#ccc' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value, index) =>
              chartData.length <= 10 || index % 5 === 0 ? value : ''
            }
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#ccc' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}¢`}
          />
          <Tooltip
            formatter={(value) => [`${value}¢`, undefined]}
            contentStyle={{
              backgroundColor: '#111',
              borderColor: '#444',
              borderRadius: '6px',
            }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Line
            type="monotone"
            dataKey="yes"
            stroke="#00C49F"
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="no"
            stroke="#FF8042"
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
