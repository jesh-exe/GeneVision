import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Search, BarChart3, FlaskConical, Database, Activity } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Data',
      description: 'Upload CSV files with gene expression data for analysis',
      href: '/upload',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Search,
      title: 'Search Genes',
      description: 'Search for specific genes and view expression patterns',
      href: '/search',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'View comprehensive statistics and data insights',
      href: '/dashboard',
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero section */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-scientific">
                <FlaskConical className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gene Expression Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A powerful bioinformatics tool for analyzing and visualizing gene expression data. 
              Upload your data, search for specific genes, and gain insights through interactive dashboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-scientific text-lg px-8"
            >
              <Link to="/upload">
                <Upload className="h-5 w-5 mr-2" />
                Get Started
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-lg px-8 hover:bg-accent"
            >
              <Link to="/dashboard">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Features section */}
        <div className="mt-20 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for comprehensive gene expression analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-data hover:shadow-scientific transition-shadow group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">{feature.description}</CardDescription>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={feature.href}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-data">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Data Format</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload CSV files with the following structure:
              </p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                gene,condition,expression<br />
                BRCA1,Normal,2.1<br />
                BRCA1,Tumor,7.8<br />
                TP53,Normal,1.5
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-data">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-secondary" />
                <span>Analysis Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Interactive expression level charts</li>
                <li>• Comprehensive data tables</li>
                <li>• Statistical summaries</li>
                <li>• Gene frequency analysis</li>
                <li>• Cross-condition comparisons</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;