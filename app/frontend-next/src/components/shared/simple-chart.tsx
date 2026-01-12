'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ChartDataItem {
  label: string;
  value: number;
}

interface SimpleChartProps {
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartDataItem[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
];

function formatValue(value: number): string {
  return value.toLocaleString('ro-RO');
}

function getColor(index: number, colors: string[]): string {
  return colors[index % colors.length];
}

function BarChart({
  data,
  height,
  colors,
}: {
  data: ChartDataItem[];
  height: number;
  colors: string[];
}) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value || 0), 1), [data]);

  return (
    <div className="flex items-end justify-around h-full gap-2 px-2" style={{ height: height - 80 }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center min-w-[50px] flex-1 max-w-[80px]">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {formatValue(item.value)}
          </div>
          <div className="flex-1 flex items-end w-full">
            <div
              className="w-full min-h-[2px] rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${Math.max((item.value / maxValue) * 100, 2)}%`,
                backgroundColor: getColor(index, colors),
              }}
              title={`${item.label}: ${formatValue(item.value)}`}
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 truncate w-full">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  data,
  height,
  colors,
}: {
  data: ChartDataItem[];
  height: number;
  colors: string[];
}) {
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value || 0), 1), [data]);
  const chartHeight = height - 60;

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Minim 2 puncte de date necesare
      </div>
    );
  }

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 380 + 10;
      const y = chartHeight - 10 - ((d.value || 0) / maxValue) * (chartHeight - 20);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative" style={{ height: chartHeight }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        <line x1="10" y1="10" x2="10" y2="190" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="10" y1="190" x2="390" y2="190" stroke="#e2e8f0" strokeWidth="1" />

        {/* Line path */}
        <polyline fill="none" stroke={colors[0]} strokeWidth="2" points={points} />

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 380 + 10;
          const y = chartHeight - 10 - ((item.value || 0) / maxValue) * (chartHeight - 20);
          return (
            <g key={index}>
              <circle cx={x} cy={y} r="5" fill={colors[0]} className="hover:r-7 transition-all" />
              <title>
                {item.label}: {formatValue(item.value)}
              </title>
            </g>
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PieChart({
  data,
  height,
  colors,
  showLegend,
  isDoughnut = false,
}: {
  data: ChartDataItem[];
  height: number;
  colors: string[];
  showLegend: boolean;
  isDoughnut?: boolean;
}) {
  const totalValue = useMemo(() => data.reduce((sum, d) => sum + (d.value || 0), 0), [data]);

  const slices = useMemo(() => {
    if (totalValue === 0) return [];
    let cumulativeAngle = -90;
    return data.map((item, index) => {
      const percentage = (item.value || 0) / totalValue;
      const angle = percentage * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const largeArcFlag = angle > 180 ? 1 : 0;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const outerRadius = 80;
      const innerRadius = isDoughnut ? 40 : 0;
      const cx = 100;
      const cy = 100;

      const x1 = cx + outerRadius * Math.cos(startRad);
      const y1 = cy + outerRadius * Math.sin(startRad);
      const x2 = cx + outerRadius * Math.cos(endRad);
      const y2 = cy + outerRadius * Math.sin(endRad);

      let path: string;

      if (isDoughnut) {
        const x3 = cx + innerRadius * Math.cos(endRad);
        const y3 = cy + innerRadius * Math.sin(endRad);
        const x4 = cx + innerRadius * Math.cos(startRad);
        const y4 = cy + innerRadius * Math.sin(startRad);

        path = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
      } else {
        path = `M ${cx} ${cy} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      }

      return {
        path,
        color: getColor(index, colors),
        label: item.label,
        value: item.value,
        percentage: (percentage * 100).toFixed(1),
      };
    });
  }, [data, totalValue, colors, isDoughnut]);

  if (totalValue === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Nu există date
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4" style={{ height }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>
              {slice.label}: {formatValue(slice.value)} ({slice.percentage}%)
            </title>
          </path>
        ))}
      </svg>

      {showLegend && (
        <div className="flex flex-col gap-2 flex-1">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {slice.label}: {formatValue(slice.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SimpleChart({
  type = 'bar',
  data,
  title,
  height = 300,
  showLegend = true,
  colors = DEFAULT_COLORS,
  className,
}: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-center',
          className
        )}
        style={{ height }}
      >
        <span className="text-slate-500">Nu există date</span>
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-lg p-4', className)} style={{ height }}>
      {title && (
        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">{title}</h4>
      )}

      <div style={{ height: title ? height - 60 : height - 32 }}>
        {type === 'bar' && <BarChart data={data} height={height - 60} colors={colors} />}
        {type === 'line' && <LineChart data={data} height={height - 60} colors={colors} />}
        {type === 'pie' && (
          <PieChart data={data} height={height - 60} colors={colors} showLegend={showLegend} />
        )}
        {type === 'doughnut' && (
          <PieChart
            data={data}
            height={height - 60}
            colors={colors}
            showLegend={showLegend}
            isDoughnut
          />
        )}
      </div>
    </div>
  );
}

export default SimpleChart;
