
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useLeadImport } from '@/hooks/useLeadImport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LeadImportExport: React.FC = () => {
  const { profile } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  
  const {
    isLoading,
    parseCSVFile,
    createImportSession,
    uploadRawData,
    processImport
  } = useLeadImport();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        toast.success('CSV file selected');
      } else {
        toast.error('Please select a CSV file');
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !profile?.company_id) {
      toast.error('Please select a file and ensure you are logged in');
      return;
    }

    try {
      setImportProgress(10);
      
      // Parse CSV file
      const preview = await parseCSVFile(selectedFile);
      setImportProgress(30);

      // Create import session
      const session = await createImportSession('csv', selectedFile.name);
      if (!session) {
        throw new Error('Failed to create import session');
      }
      setImportProgress(50);

      // Upload raw data
      await uploadRawData(session.id, preview.rows);
      setImportProgress(70);

      // Process import
      await processImport(session.id);
      setImportProgress(100);

      toast.success(`Successfully imported ${preview.totalRows} leads`);
      setSelectedFile(null);
      setImportProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Import failed');
      setImportProgress(0);
    }
  };

  const handleExport = async () => {
    if (!profile?.company_id) {
      toast.error('Please ensure you are logged in');
      return;
    }

    setIsExporting(true);
    try {
      // Fetch leads from the company
      const { data: leads, error } = await supabase
        .from('leads')
        .select('name, email, phone, company, status, priority, source, score, created_at')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!leads || leads.length === 0) {
        toast.info('No leads found to export');
        return;
      }

      // Convert to CSV
      const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Priority', 'Source', 'Score', 'Created Date'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          `"${lead.name || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.status || ''}"`,
          `"${lead.priority || ''}"`,
          `"${lead.source || ''}"`,
          lead.score || 0,
          `"${new Date(lead.created_at).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${leads.length} leads successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Leads from CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="mt-1"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {selectedFile.name} selected
              </div>
            )}
          </div>

          {importProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Import Progress</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || isLoading || importProgress > 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• CSV should include columns: Name, Email, Phone, Company, Status, Priority, Source</p>
            <p>• Name column is required, other fields are optional</p>
            <p>• Duplicate leads (same email/phone) will be skipped</p>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Leads to CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export all your leads to a CSV file for backup or analysis in external tools.
          </p>

          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export All Leads
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foregoing">
          <p><strong>Import Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Ensure your CSV has headers in the first row</li>
            <li>Use standard field names (Name, Email, Phone, etc.)</li>
            <li>Remove special characters that might cause parsing issues</li>
          </ul>
          
          <p className="mt-4"><strong>Export Notes:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Exported file includes all lead data and timestamps</li>
            <li>File is automatically named with current date</li>
            <li>Compatible with Excel, Google Sheets, and other CSV readers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImportExport;
