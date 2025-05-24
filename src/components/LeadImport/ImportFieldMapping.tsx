
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Mail,
  Phone,
  User,
  Building,
  Star,
  Tag
} from 'lucide-react';
import { ImportPreview, FieldMapping } from '@/types/import';

interface ImportFieldMappingProps {
  preview: ImportPreview;
  initialMapping: Record<string, string>;
  onComplete: (mapping: Record<string, string>) => void;
  onBack: () => void;
  isLoading: boolean;
}

const AVAILABLE_FIELDS = [
  { value: 'name', label: 'Lead Name', icon: User, required: true },
  { value: 'email', label: 'Email', icon: Mail, required: false },
  { value: 'phone', label: 'Phone', icon: Phone, required: false },
  { value: 'company', label: 'Company', icon: Building, required: false },
  { value: 'source', label: 'Lead Source', icon: Tag, required: false },
  { value: 'status', label: 'Status', icon: CheckCircle, required: false },
  { value: 'priority', label: 'Priority', icon: Star, required: false },
  { value: 'score', label: 'Lead Score', icon: Star, required: false },
  { value: 'tags', label: 'Tags', icon: Tag, required: false },
  { value: 'conversion_likelihood', label: 'Conversion Likelihood', icon: Star, required: false },
];

const ImportFieldMapping: React.FC<ImportFieldMappingProps> = ({
  preview,
  initialMapping,
  onComplete,
  onBack,
  isLoading
}) => {
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>(initialMapping);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateMapping = useCallback(() => {
    const errors: string[] = [];
    
    // Check if required fields are mapped
    const hasNameField = Object.values(fieldMapping).includes('name');
    if (!hasNameField) {
      errors.push('Lead Name is required - please map at least one field to Lead Name');
    }

    // Check for duplicate mappings
    const mappedFields = Object.values(fieldMapping).filter(Boolean);
    const uniqueFields = new Set(mappedFields);
    if (mappedFields.length !== uniqueFields.size) {
      errors.push('Each target field can only be mapped to one source field');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [fieldMapping]);

  useEffect(() => {
    validateMapping();
  }, [fieldMapping, validateMapping]);

  const handleFieldMappingChange = useCallback((sourceField: string, targetField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [sourceField]: targetField === 'none' ? '' : targetField
    }));
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge variant="secondary" className="bg-green-100 text-green-800">High</Badge>;
    if (confidence >= 0.6) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge variant="secondary" className="bg-red-100 text-red-800">Low</Badge>;
  };

  const getMappedFieldsCount = () => {
    return Object.values(fieldMapping).filter(Boolean).length;
  };

  const getRequiredFieldsCount = () => {
    const requiredFields = AVAILABLE_FIELDS.filter(field => field.required);
    return requiredFields.filter(field => 
      Object.values(fieldMapping).includes(field.value)
    ).length;
  };

  const handleComplete = useCallback(() => {
    if (validateMapping()) {
      onComplete(fieldMapping);
    }
  }, [fieldMapping, validateMapping, onComplete]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Field Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Map your data fields to lead properties. AI suggestions are marked with confidence levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">AI Powered</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Fields Mapped</p>
                <p className="text-2xl font-bold">{getMappedFieldsCount()}/{preview.headers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Required Fields</p>
                <p className="text-2xl font-bold">{getRequiredFieldsCount()}/1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Issues Found</p>
                <p className="text-2xl font-bold">{preview.detectedIssues.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Field Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Map Your Fields</CardTitle>
          <CardDescription>
            Choose how each column in your data should be mapped to lead properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Field</TableHead>
                <TableHead>Sample Data</TableHead>
                <TableHead>AI Suggestion</TableHead>
                <TableHead>Map To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.headers.map((header) => {
                const suggestion = preview.suggestedMappings.find(m => m.source === header);
                const currentMapping = fieldMapping[header];
                
                return (
                  <TableRow key={header}>
                    <TableCell className="font-medium">{header}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {suggestion?.sampleValues.slice(0, 2).join(', ') || 'No data'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {suggestion?.target ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{AVAILABLE_FIELDS.find(f => f.value === suggestion.target)?.label}</span>
                          {getConfidenceBadge(suggestion.confidence)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No suggestion</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={currentMapping || 'none'}
                        onValueChange={(value) => handleFieldMappingChange(header, value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Don't import</SelectItem>
                          {AVAILABLE_FIELDS.map((field) => {
                            const Icon = field.icon;
                            return (
                              <SelectItem key={field.value} value={field.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{field.label}</span>
                                  {field.required && <span className="text-red-500">*</span>}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>
            Preview of how your mapped data will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.entries(fieldMapping)
                  .filter(([_, target]) => target)
                  .map(([source, target]) => (
                    <TableHead key={source}>
                      {AVAILABLE_FIELDS.find(f => f.value === target)?.label || target}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.rows.slice(0, 3).map((row, index) => (
                <TableRow key={index}>
                  {Object.entries(fieldMapping)
                    .filter(([_, target]) => target)
                    .map(([source, target]) => (
                      <TableCell key={source}>
                        {row[source] || '-'}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={validationErrors.length > 0 || isLoading}
        >
          Continue to Review
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ImportFieldMapping;
