
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Download,
  Users,
  Mail,
  Phone,
  Building,
  Brain,
  Lightbulb
} from 'lucide-react';
import { ImportSession, ImportPreview, AIRecommendation } from '@/types/import';
import { useLeadImport } from '@/hooks/useLeadImport';

interface ImportReviewSummaryProps {
  session: ImportSession;
  preview: ImportPreview;
  fieldMapping: Record<string, string>;
  onStartImport: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const ImportReviewSummary: React.FC<ImportReviewSummaryProps> = ({
  session,
  preview,
  fieldMapping,
  onStartImport,
  onBack,
  isLoading
}) => {
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const { generateAIRecommendations, checkExistingLeads } = useLeadImport();

  // Generate AI recommendations on component mount
  useEffect(() => {
    const loadRecommendations = async () => {
      const recommendations = await generateAIRecommendations(session.id, preview);
      setAiRecommendations(recommendations);
    };
    loadRecommendations();
  }, [session.id, preview, generateAIRecommendations]);

  useEffect(() => {
    const detectDuplicates = async () => {
      const count = await checkExistingLeads(preview.rows, fieldMapping);
      setDuplicateCount(count);
    };
    detectDuplicates();
  }, [preview.rows, fieldMapping, checkExistingLeads]);

  // Calculate import summary statistics
  const importStats = React.useMemo(() => {
    const mappedFields = Object.values(fieldMapping).filter(Boolean);
    const hasEmail = mappedFields.includes('email');
    const hasPhone = mappedFields.includes('phone');
    const hasCompany = mappedFields.includes('company');

    const baseReady = preview.rows.filter(row => {
      const nameField = Object.keys(fieldMapping).find(key => fieldMapping[key] === 'name');
      return nameField && row[nameField];
    }).length;

    const flaggedForAttention = preview.detectedIssues.length;
    const duplicatesFound = duplicateCount;
    const readyToImport = Math.max(0, baseReady - duplicatesFound);
    const skippedRecords = preview.totalRows - readyToImport - flaggedForAttention - duplicatesFound;

    return {
      totalLeads: preview.totalRows,
      readyToImport,
      flaggedForAttention,
      duplicatesFound,
      skippedRecords,
      dataQuality: {
        hasEmail: preview.rows.filter(row => {
          const emailField = Object.keys(fieldMapping).find(key => fieldMapping[key] === 'email');
          return emailField && row[emailField];
        }).length,
        hasPhone: preview.rows.filter(row => {
          const phoneField = Object.keys(fieldMapping).find(key => fieldMapping[key] === 'phone');
          return phoneField && row[phoneField];
        }).length,
        hasCompany: preview.rows.filter(row => {
          const companyField = Object.keys(fieldMapping).find(key => fieldMapping[key] === 'company');
          return companyField && row[companyField];
        }).length,
        missingCriticalData: flaggedForAttention
      }
    };
  }, [preview, fieldMapping, duplicateCount]);

  const getSuccessRate = () => {
    return Math.round((importStats.readyToImport / importStats.totalLeads) * 100);
  };

  const handleAcceptRecommendation = useCallback((recommendationId: string) => {
    setAiRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, accepted: true }
          : rec
      )
    );
  }, []);

  const handleRejectRecommendation = useCallback((recommendationId: string) => {
    setAiRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, accepted: false }
          : rec
      )
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Review Import Summary</h3>
        <p className="text-sm text-muted-foreground">
          Review your import details and AI recommendations before proceeding
        </p>
      </div>

      {/* Import Success Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Import Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-2xl font-bold text-green-600">{getSuccessRate()}%</span>
            </div>
            <Progress value={getSuccessRate()} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {importStats.readyToImport} of {importStats.totalLeads} leads are ready for import
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Import Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Ready to Import</p>
                <p className="text-2xl font-bold text-green-600">{importStats.readyToImport}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{importStats.flaggedForAttention}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Duplicates</p>
                <p className="text-2xl font-bold text-blue-600">{importStats.duplicatesFound}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Will Skip</p>
                <p className="text-2xl font-bold text-red-600">{importStats.skippedRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Overview</CardTitle>
          <CardDescription>
            Analysis of your lead data completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Has Email</p>
                <p className="text-lg font-semibold">{importStats.dataQuality.hasEmail} leads</p>
                <Progress 
                  value={(importStats.dataQuality.hasEmail / importStats.totalLeads) * 100} 
                  className="w-full h-2 mt-1" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium">Has Phone</p>
                <p className="text-lg font-semibold">{importStats.dataQuality.hasPhone} leads</p>
                <Progress 
                  value={(importStats.dataQuality.hasPhone / importStats.totalLeads) * 100} 
                  className="w-full h-2 mt-1" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Has Company</p>
                <p className="text-lg font-semibold">{importStats.dataQuality.hasCompany} leads</p>
                <Progress 
                  value={(importStats.dataQuality.hasCompany / importStats.totalLeads) * 100} 
                  className="w-full h-2 mt-1" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Smart suggestions to optimize your import and lead management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map((recommendation) => (
                <Alert key={recommendation.id}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{recommendation.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {recommendation.description}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {Math.round(recommendation.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      {recommendation.accepted === undefined && (
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcceptRecommendation(recommendation.id)}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleRejectRecommendation(recommendation.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                      {recommendation.accepted === true && (
                        <Badge className="ml-4 bg-green-100 text-green-800">Accepted</Badge>
                      )}
                      {recommendation.accepted === false && (
                        <Badge variant="outline" className="ml-4">Dismissed</Badge>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Issues */}
      {preview.detectedIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Detected Issues
            </CardTitle>
            <CardDescription>
              Issues found in your data that may affect import quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {preview.detectedIssues.slice(0, 10).map((issue, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">
                    Row {issue.rowIndex + 1}: {issue.suggestion || `${issue.type} in ${issue.field}`}
                  </span>
                </div>
              ))}
              {preview.detectedIssues.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {preview.detectedIssues.length - 10} more issues
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mapping
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
          <Button 
            onClick={onStartImport}
            disabled={isLoading || importStats.readyToImport === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Starting Import...' : `Import ${importStats.readyToImport} Leads`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportReviewSummary;
