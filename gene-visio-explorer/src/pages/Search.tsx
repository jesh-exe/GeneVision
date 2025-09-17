import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import GeneTable from '@/components/GeneTable';
import ExpressionChart from '@/components/ExpressionChart';
import { Search as SearchIcon, Loader2, Dna } from 'lucide-react';
import { GeneSearchResult, searchGene } from '@/lib/api';

const Search = () => {
  const [geneName, setGeneName] = useState('');
  const [searchResults, setSearchResults] = useState<GeneSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchedGene, setLastSearchedGene] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!geneName.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter a gene name to search.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchGene(geneName.trim());
      setSearchResults(results);
      setLastSearchedGene(geneName.trim());
      
      if (results.length === 0) {
        toast({
          title: 'No Results',
          description: `No expression data found for gene "${geneName}".`,
        });
      } else {
        toast({
          title: 'Search Complete',
          description: `Found ${results.length} expression records for "${geneName}".`,
        });
      }
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'There was an error searching for the gene. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const popularGenes = ['BRCA1', 'TP53', 'EGFR', 'MYC', 'KRAS', 'PIK3CA'];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Search Gene Expression
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search for specific genes to view their expression levels across different conditions 
          and visualize the data with interactive charts.
        </p>
      </div>

      {/* Search form */}
      <Card className="max-w-2xl mx-auto shadow-scientific">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="h-5 w-5 text-primary" />
            <span>Gene Search</span>
          </CardTitle>
          <CardDescription>
            Enter a gene name (e.g., BRCA1, TP53) to search for expression data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter gene name (e.g., BRCA1)"
                value={geneName}
                onChange={(e) => setGeneName(e.target.value)}
                className="flex-1 bg-data-bg"
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-scientific"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Popular genes */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Popular genes:</p>
            <div className="flex flex-wrap gap-2">
              {popularGenes.map((gene) => (
                <Button
                  key={gene}
                  variant="outline"
                  size="sm"
                  onClick={() => setGeneName(gene)}
                  disabled={isSearching}
                  className="text-xs hover:bg-accent"
                >
                  {gene}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Expression Data for <span className="text-primary font-mono">{lastSearchedGene}</span>
            </h2>
            <p className="text-muted-foreground">
              Found {searchResults.length} expression record{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Chart visualization */}
          <ExpressionChart 
            data={searchResults} 
            geneName={lastSearchedGene}
            title="Expression Visualization"
          />

          {/* Data table */}
          <GeneTable 
            data={searchResults.map(result => ({
              gene: lastSearchedGene,
              condition: result.condition,
              expression: result.expression,
            }))}
            title="Expression Data Table"
            description="Detailed expression values for each condition"
            showGeneColumn={false}
          />
        </div>
      )}

      {/* Empty state */}
      {searchResults.length === 0 && !isSearching && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Search Results</h3>
            <p className="text-muted-foreground">
              Enter a gene name above to search for expression data and view visualizations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;