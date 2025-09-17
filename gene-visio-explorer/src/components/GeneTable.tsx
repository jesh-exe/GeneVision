import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneData } from '@/lib/api';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GeneTableProps {
  data: GeneData[];
  title?: string;
  description?: string;
  showGeneColumn?: boolean;
}

const GeneTable = ({ 
  data, 
  title = 'Gene Expression Data', 
  description,
  showGeneColumn = true 
}: GeneTableProps) => {
  const getExpressionIcon = (expression: number) => {
    if (expression > 5) return <TrendingUp className="h-4 w-4 text-secondary" />;
    if (expression < 2) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getExpressionBadge = (expression: number) => {
    if (expression > 5) return 'high';
    if (expression < 2) return 'low';
    return 'medium';
  };

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'default';
      case 'low': return 'destructive';
      default: return 'secondary';
    }
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-data">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-data-bg/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                {showGeneColumn && (
                  <TableHead className="font-semibold text-foreground">Gene</TableHead>
                )}
                <TableHead className="font-semibold text-foreground">Condition</TableHead>
                <TableHead className="font-semibold text-foreground">Expression Level</TableHead>
                <TableHead className="font-semibold text-foreground">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-accent/50 transition-colors">
                  {showGeneColumn && (
                    <TableCell className="font-mono font-medium text-primary">
                      {row.gene}
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{row.condition}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getExpressionIcon(row.expression)}
                      <span className="font-mono">{row.expression.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(getExpressionBadge(row.expression))}>
                      {getExpressionBadge(row.expression)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneTable;