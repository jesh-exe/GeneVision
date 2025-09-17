import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';
import { GeneData } from '@/lib/api';

interface FileUploadProps {
  onFileUpload: (data: GeneData[]) => void;
  isUploading?: boolean;
}

const FileUpload = ({ onFileUpload, isUploading = false }: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setParseError('Please select a CSV file');
      return;
    }
    
    setSelectedFile(file);
    setParseError(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        try {
          const data = results.data as Array<{ gene?: string; condition?: string; expression?: string }>;
          
          // Validate and transform data
          const validData: GeneData[] = data
            .filter(row => row.gene && row.condition && row.expression)
            .map(row => ({
              gene: row.gene!,
              condition: row.condition!,
              expression: parseFloat(row.expression!),
            }))
            .filter(row => !isNaN(row.expression));

          if (validData.length === 0) {
            setParseError('No valid data found. Please check your CSV format.');
            return;
          }

          onFileUpload(validData);
        } catch (error) {
          setParseError('Error parsing CSV file. Please check the format.');
        }
      },
      error: (error) => {
        setParseError(`Parse error: ${error.message}`);
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload Gene Expression Data</span>
        </CardTitle>
        <CardDescription>
          Upload a CSV file with gene expression data. Expected format: gene, condition, expression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File drop zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-accent rounded-full">
              <FileText className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {/* Selected file info */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-scientific"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}

        {/* Error message */}
        {parseError && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{parseError}</p>
          </div>
        )}

        {/* Format example */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Expected CSV Format:</h4>
          <pre className="text-sm text-muted-foreground">
{`gene,condition,expression
BRCA1,Normal,2.1
BRCA1,Tumor,7.8
TP53,Normal,1.5
TP53,Tumor,6.3`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;