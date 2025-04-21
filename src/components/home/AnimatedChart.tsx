
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
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
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

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

    // Toggle chart type every 10 seconds for a dynamic effect
    const typeInterval = setInterval(() => {
      setChartType(prev => prev === 'line' ? 'area' : 'line');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(typeInterval);
    };
  }, []);

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-1">{label}</p>
          <div className="flex flex-col gap-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
              Yes: <span className="font-medium">{payload[0].value}¢</span>
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              No: <span className="font-medium">{payload[1].value}¢</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F87171" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) =>
                chartData.length <= 10 || index % 5 === 0 ? value : ''
              }
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}¢`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="yes"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
              animationDuration={1000}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="no"
              stroke="#F87171"
              strokeWidth={3}
              dot={false}
              animationDuration={1000}
              isAnimationActive={true}
            />
          </LineChart>
        ) : (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F87171" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) =>
                chartData.length <= 10 || index % 5 === 0 ? value : ''
              }
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}¢`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="yes"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#yesGradient)"
              animationDuration={1000}
              isAnimationActive={true}
            />
            <Area
              type="monotone"
              dataKey="no"
              stroke="#F87171"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#noGradient)"
              animationDuration={1000}
              isAnimationActive={true}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
