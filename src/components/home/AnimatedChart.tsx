
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Generate premium data for the chart
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
      yes: Math.round(yesPrice * 100) / 100,  // up to 2 decimals, for aesthetics
      no: Math.round(noPrice * 100) / 100,
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
        const newYesPrice = Math.round(Math.max(1, Math.min(99, lastPoint.yes + change)) * 100) / 100;
        const newNoPrice = Math.round((100 - newYesPrice) * 100) / 100;
        const newDate = new Date();
        newData.shift();
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

  // Premium tooltip style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-card/95 backdrop-blur border border-border/70 p-3 rounded-xl shadow-xl min-w-[110px]">
          <p className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-200">{label}</p>
          <div className="flex flex-col gap-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
              Yes: <span className="font-medium">{Number(payload[0].value).toFixed(2)}¢</span>
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
              No: <span className="font-medium">{Number(payload[1].value).toFixed(2)}¢</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto my-6 glass-card shadow-lg border border-primary/20 rounded-2xl py-4 px-3 ${className}`}
      style={{
        background: 'linear-gradient(109.6deg, rgba(223, 234, 247, 0.9) 11.2%, rgba(244, 248, 252, 0.9) 91.1%)',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.05)',
      }}
    >
      <ResponsiveContainer width="100%" height={270}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="lineYes" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
            <linearGradient id="lineNo" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7777"/>
              <stop offset="100%" stopColor="#fbafba"/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#8389a4' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value, index) =>
              chartData.length <= 10 || index % 5 === 0 ? value : ''
            }
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#a3b0c9' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}¢`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="yes"
            stroke="url(#lineYes)"
            strokeWidth={3}
            dot={false}
            animationDuration={1200}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="no"
            stroke="url(#lineNo)"
            strokeWidth={3}
            dot={false}
            animationDuration={1200}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
