import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GeneSearchResult } from '@/lib/api';
import { Activity } from 'lucide-react';

interface ExpressionChartProps {
  data: GeneSearchResult[];
  geneName?: string;
  title?: string;
}

const ExpressionChart = ({ data, geneName, title }: ExpressionChartProps) => {
  // Color mapping for different expression levels
  const getBarColor = (value: number) => {
    if (value > 5) return 'hsl(var(--secondary))'; // High expression - teal
    if (value < 2) return 'hsl(var(--destructive))'; // Low expression - red
    return 'hsl(var(--primary))'; // Medium expression - blue
  };

  const chartData = data.map(item => ({
    condition: item.condition,
    expression: item.expression,
    color: getBarColor(item.expression),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-scientific">
          <p className="font-medium">{`Condition: ${label}`}</p>
          <p className="text-primary">{`Expression: ${value.toFixed(2)}`}</p>
          <p className="text-sm text-muted-foreground">
            Level: {value > 5 ? 'High' : value < 2 ? 'Low' : 'Medium'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No expression data to visualize</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-data">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>{title || `Expression Levels${geneName ? ` - ${geneName}` : ''}`}</span>
        </CardTitle>
        <CardDescription>
          Gene expression levels across different conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.5}
              />
              <XAxis 
                dataKey="condition" 
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ 
                  value: 'Expression Level', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="expression" 
                radius={[4, 4, 0, 0]}
                stroke="hsl(var(--border))"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span className="text-muted-foreground">Low (&lt; 2.0)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-muted-foreground">Medium (2.0 - 5.0)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span className="text-muted-foreground">High (&gt; 5.0)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpressionChart;