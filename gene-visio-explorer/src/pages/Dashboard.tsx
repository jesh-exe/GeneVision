import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Database, TestTube, TrendingUp, Loader2 } from 'lucide-react';
import { getDashboardStats, DashboardStats } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        toast({
          title: 'Failed to Load Dashboard',
          description: 'There was an error loading the dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center space-y-4">
          <Database className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold">No Data Available</h2>
          <p className="text-muted-foreground">
            Upload some gene expression data to see dashboard statistics.
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Genes',
      value: stats.totalGenes,
      description: 'Unique genes in database',
      icon: Database,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Conditions',
      value: stats.totalConditions,
      description: 'Different experimental conditions',
      icon: TestTube,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Most Frequent Gene',
      value: stats.topGenes[0]?.gene || 'N/A',
      description: `${stats.topGenes[0]?.count || 0} expression records`,
      icon: TrendingUp,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Gene Expression Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Overview of your gene expression dataset with key statistics and insights.
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-data">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top genes chart */}
      {stats.topGenes.length > 0 && (
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Most Frequent Genes</span>
            </CardTitle>
            <CardDescription>
              Top {stats.topGenes.length} genes by number of expression records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topGenes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="gene" 
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
                      value: 'Record Count', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px -4px hsl(210 85% 45% / 0.2)',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Points:</span>
              <span className="font-medium">
                {stats.topGenes.reduce((sum, gene) => sum + gene.count, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Records per Gene:</span>
              <span className="font-medium">
                {stats.totalGenes > 0 
                  ? (stats.topGenes.reduce((sum, gene) => sum + gene.count, 0) / stats.totalGenes).toFixed(1)
                  : '0'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Most Active Gene:</span>
              <span className="font-medium font-mono text-primary">
                {stats.topGenes[0]?.gene || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <a 
                href="/upload" 
                className="block w-full p-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg text-center font-medium hover:shadow-scientific transition-all"
              >
                Upload More Data
              </a>
              <a 
                href="/search" 
                className="block w-full p-3 bg-accent text-accent-foreground rounded-lg text-center font-medium hover:bg-accent/80 transition-colors"
              >
                Search Genes
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;