import { logger } from '@/utils/logger';

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileSpreadsheet, 
  Database,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  Phone,
  Building,
  Brain,
  Download,
  X
} from 'lucide-react';
import { useLeadImport } from '@/hooks/useLeadImport';
import { ImportPreview, ImportSession } from '@/types/import';
import { toast } from 'sonner';
import ImportFieldMapping from './ImportFieldMapping';
import ImportReviewSummary from './ImportReviewSummary';

interface LeadImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const LeadImportDialog: React.FC<LeadImportDialogProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'review' | 'importing' | 'complete'>('upload');
  const [selectedImportType, setSelectedImportType] = useState<'csv' | 'zoho' | 'clickup' | 'gohighlevel'>('csv');
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    currentSession,
    parseCSVFile,
    createImportSession,
    uploadRawData,
    saveFieldMapping,
    generateAIRecommendations,
    processImport
  } = useLeadImport();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    try {
      // Parse CSV file
      const filePreview = await parseCSVFile(file);
      setPreview(filePreview);

      // Create import session
      const session = await createImportSession('csv', file.name);
      if (!session) return;

      // Initialize field mapping from AI suggestions
      const initialMapping: Record<string, string> = {};
      filePreview.suggestedMappings.forEach(mapping => {
        if (mapping.confidence > 0.7 && mapping.target) {
          initialMapping[mapping.source] = mapping.target;
        }
      });
      setFieldMapping(initialMapping);

      setCurrentStep('mapping');
      toast.success('File uploaded successfully');
    } catch (error) {
      logger.error('Error processing file:', error);
      toast.error('Failed to process file');
    }
  }, [parseCSVFile, createImportSession]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.type === 'application/vnd.ms-excel'
    );

    if (csvFile) {
      handleFileSelect(csvFile);
    } else {
      toast.error('Please upload a CSV or Excel file');
    }
  }, [handleFileSelect]);

  const handleFieldMappingComplete = useCallback(async (mapping: Record<string, string>) => {
    if (!currentSession || !preview) return;

    setFieldMapping(mapping);
    
    // Save field mapping
    const success = await saveFieldMapping(currentSession.id, mapping);
    if (!success) return;

    // Upload raw data
    const uploadSuccess = await uploadRawData(currentSession.id, preview.rows);
    if (!uploadSuccess) return;

    setCurrentStep('review');
  }, [currentSession, preview, saveFieldMapping, uploadRawData]);

  const handleStartImport = useCallback(async () => {
    if (!currentSession) return;

    setCurrentStep('importing');
    
    const success = await processImport(currentSession.id);
    if (success) {
      setCurrentStep('complete');
      setTimeout(() => {
        onImportComplete();
        onClose();
      }, 3000);
    } else {
      setCurrentStep('review');
    }
  }, [currentSession, processImport, onImportComplete, onClose]);

  const resetImport = useCallback(() => {
    setCurrentStep('upload');
    setPreview(null);
    setFieldMapping({});
    setSelectedImportType('csv');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Import Leads from CRM or File</h3>
        <p className="text-sm text-muted-foreground">
          Choose your data source and upload your leads for AI-powered processing
        </p>
      </div>

      <Tabs value={selectedImportType} onValueChange={(value: any) => setSelectedImportType(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="csv">CSV/Excel</TabsTrigger>
          <TabsTrigger value="zoho">Zoho CRM</TabsTrigger>
          <TabsTrigger value="clickup">ClickUp</TabsTrigger>
          <TabsTrigger value="gohighlevel">GoHighLevel</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Upload CSV or Excel File
              </CardTitle>
              <CardDescription>
                Drag and drop your file or click to browse. Supports .csv and .xlsx formats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop your file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline">
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zoho" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connect to Zoho CRM
              </CardTitle>
              <CardDescription>
                Connect your Zoho CRM account to import leads directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Zoho CRM integration coming soon. For now, export your leads as CSV from Zoho and use the CSV upload option.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clickup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connect to ClickUp CRM
              </CardTitle>
              <CardDescription>
                Connect your ClickUp account to import leads from your CRM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ClickUp CRM integration coming soon. For now, export your leads as CSV from ClickUp and use the CSV upload option.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gohighlevel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connect to GoHighLevel
              </CardTitle>
              <CardDescription>
                Connect your GoHighLevel account to import leads and contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  GoHighLevel integration coming soon. For now, export your leads as CSV and use the CSV upload option.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderProgress = () => {
    const steps = ['upload', 'mapping', 'review', 'importing', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Import Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span className={currentIndex >= 0 ? 'text-primary' : ''}>Upload</span>
          <span className={currentIndex >= 1 ? 'text-primary' : ''}>Mapping</span>
          <span className={currentIndex >= 2 ? 'text-primary' : ''}>Review</span>
          <span className={currentIndex >= 3 ? 'text-primary' : ''}>Import</span>
          <span className={currentIndex >= 4 ? 'text-primary' : ''}>Complete</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import Leads
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {renderProgress()}

        {currentStep === 'upload' && renderUploadStep()}
        
        {currentStep === 'mapping' && preview && (
          <ImportFieldMapping
            preview={preview}
            initialMapping={fieldMapping}
            onComplete={handleFieldMappingComplete}
            onBack={resetImport}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'review' && preview && currentSession && (
          <ImportReviewSummary
            session={currentSession}
            preview={preview}
            fieldMapping={fieldMapping}
            onStartImport={handleStartImport}
            onBack={() => setCurrentStep('mapping')}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'importing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Importing Leads...</h3>
            <p className="text-muted-foreground">
              Please wait while we process and import your leads. This may take a few moments.
            </p>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your leads have been successfully imported and are ready for action.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => { onImportComplete(); onClose(); }}>
                View Leads
              </Button>
              <Button variant="outline" onClick={resetImport}>
                Import More
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadImportDialog;
