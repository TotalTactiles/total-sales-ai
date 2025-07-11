
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface AIChartRendererProps {
  chartData: any;
  chartType: 'line' | 'bar' | 'pie' | 'table' | 'scorecard';
  config?: {
    title?: string;
    width?: number;
    height?: number;
  };
  className?: string;
}

const AIChartRenderer: React.FC<AIChartRendererProps> = ({
  chartData,
  chartType,
  config = {},
  className = ''
}) => {
  const { title = 'AI Generated Chart', width = 300, height = 200 } = config;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!chartData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No chart data available</p>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData.data || chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData.datasets ? (
                chartData.datasets.map((dataset: any, index: number) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={dataset.dataKey}
                    stroke={dataset.color || COLORS[index % COLORS.length]}
                    strokeWidth={2}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData.data || chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData.datasets ? (
                chartData.datasets.map((dataset: any, index: number) => (
                  <Bar
                    key={index}
                    dataKey={dataset.dataKey}
                    fill={dataset.color || COLORS[index % COLORS.length]}
                  />
                ))
              ) : (
                <Bar dataKey="value" fill="#8884d8" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData.data || chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(chartData.data || chartData).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'table':
        const tableData = chartData.data || chartData;
        const columns = chartData.columns || Object.keys(tableData[0] || {});
        
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((column: string) => (
                    <th key={column} className="text-left p-2 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any, index: number) => (
                  <tr key={index} className="border-b">
                    {columns.map((column: string) => (
                      <td key={column} className="p-2">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'scorecard':
        const scores = chartData.scores || chartData;
        
        return (
          <div className="grid grid-cols-2 gap-2">
            {scores.map((score: any, index: number) => (
              <div key={index} className="text-center p-2 border rounded">
                <div className="text-lg font-bold">{score.value}</div>
                <div className="text-xs text-muted-foreground">{score.label}</div>
                {score.change && (
                  <Badge variant={score.change > 0 ? 'default' : 'destructive'} className="text-xs mt-1">
                    {score.change > 0 ? '+' : ''}{score.change}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Unsupported chart type: {chartType}
          </div>
        );
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default AIChartRenderer;
