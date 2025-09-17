import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';
import GeneTable from '@/components/GeneTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Database } from 'lucide-react';
import { GeneData, uploadGeneData } from '@/lib/api';

const Upload = () => {
  const [uploadedData, setUploadedData] = useState<GeneData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (data: GeneData[]) => {
    setIsUploading(true);
    try {
      await uploadGeneData(data);
      setUploadedData(data);
      toast({
        title: 'Upload Successful',
        description: `Successfully uploaded ${data.length} gene expression records.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Upload Gene Expression Data
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your CSV files containing gene expression data for analysis and visualization. 
          The system will parse and validate your data automatically.
        </p>
      </div>

      <div className="flex justify-center">
        <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
      </div>

      {uploadedData.length > 0 && (
        <div className="space-y-6">
          {/* Success notification */}
          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-secondary" />
                <div>
                  <h3 className="font-semibold text-secondary">Data Upload Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Your gene expression data has been successfully processed and stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Upload Summary</span>
              </CardTitle>
              <CardDescription>
                Overview of the uploaded gene expression dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-soft rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {uploadedData.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="bg-gradient-soft rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {new Set(uploadedData.map(d => d.gene)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Genes</div>
                </div>
                <div className="bg-gradient-soft rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {new Set(uploadedData.map(d => d.condition)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Conditions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data preview */}
          <GeneTable 
            data={uploadedData.slice(0, 10)} 
            title="Data Preview"
            description={`Showing first 10 records of ${uploadedData.length} total records`}
          />
        </div>
      )}
    </div>
  );
};

export default Upload;