
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  ImportSession,
  ImportRawData,
  ImportPreview,
  FieldMapping,
  AIRecommendation,
  ImportSummary
} from '@/types/import';

export const useLeadImport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [importSessions, setImportSessions] = useState<ImportSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ImportSession | null>(null);
  const { user, profile } = useAuth();

  const parseCSVFile = useCallback((file: File): Promise<ImportPreview> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const rows = lines.slice(1, Math.min(101, lines.length)).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: Record<string, any> = {};
            headers.forEach((header, i) => {
              row[header] = values[i] || '';
            });
            row._rowIndex = index;
            return row;
          });

          // AI-powered field mapping suggestions
          const suggestedMappings: FieldMapping[] = headers.map(header => {
            const lowerHeader = header.toLowerCase();
            let target = '';
            let confidence = 0;
            let dataType: FieldMapping['dataType'] = 'text';

            // Smart field detection
            if (lowerHeader.includes('name') && !lowerHeader.includes('company')) {
              target = 'name';
              confidence = 0.9;
            } else if (lowerHeader.includes('email')) {
              target = 'email';
              confidence = 0.95;
              dataType = 'email';
            } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
              target = 'phone';
              confidence = 0.9;
              dataType = 'phone';
            } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
              target = 'company';
              confidence = 0.85;
            } else if (lowerHeader.includes('status')) {
              target = 'status';
              confidence = 0.8;
            } else if (lowerHeader.includes('priority')) {
              target = 'priority';
              confidence = 0.8;
            } else if (lowerHeader.includes('source')) {
              target = 'source';
              confidence = 0.8;
            } else if (lowerHeader.includes('tag')) {
              target = 'tags';
              confidence = 0.7;
            } else if (lowerHeader.includes('score')) {
              target = 'score';
              confidence = 0.7;
              dataType = 'number';
            }

            return {
              source: header,
              target,
              confidence,
              dataType,
              sampleValues: rows.slice(0, 3).map(row => row[header]).filter(Boolean)
            };
          });

          // Detect data quality issues
          const detectedIssues: ImportPreview['detectedIssues'] = [];
          rows.forEach((row, index) => {
            if (!row.name && !suggestedMappings.find(m => m.target === 'name')?.source) {
              detectedIssues.push({
                type: 'empty_name',
                rowIndex: index,
                field: 'name',
                value: row.name,
                suggestion: 'Name is required for lead import'
              });
            }
            
            const emailField = suggestedMappings.find(m => m.target === 'email')?.source;
            if (emailField && !row[emailField]) {
              detectedIssues.push({
                type: 'missing_email',
                rowIndex: index,
                field: emailField,
                value: row[emailField],
                suggestion: 'Email is recommended for lead nurturing'
              });
            }
          });

          resolve({
            headers,
            rows: rows.slice(0, 10), // Preview first 10 rows
            totalRows: lines.length - 1,
            suggestedMappings,
            detectedIssues: detectedIssues.slice(0, 20) // Limit issues shown
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const createImportSession = useCallback(async (
    importType: ImportSession['import_type'],
    fileName?: string
  ): Promise<ImportSession | null> => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('import_sessions')
        .insert({
          company_id: profile.company_id,
          user_id: user.id,
          import_type: importType,
          file_name: fileName,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Convert database response to ImportSession type with proper type guards
      const defaultSummary: ImportSummary = {
        totalLeads: 0,
        readyToImport: 0,
        flaggedForAttention: 0,
        duplicatesFound: 0,
        skippedRecords: 0,
        dataQuality: {
          hasEmail: 0,
          hasPhone: 0,
          hasCompany: 0,
          missingCriticalData: 0
        }
      };

      const parseImportSummary = (summary: any): ImportSummary => {
        if (!summary || typeof summary !== 'object') return defaultSummary;
        return {
          totalLeads: summary.totalLeads || 0,
          readyToImport: summary.readyToImport || 0,
          flaggedForAttention: summary.flaggedForAttention || 0,
          duplicatesFound: summary.duplicatesFound || 0,
          skippedRecords: summary.skippedRecords || 0,
          dataQuality: {
            hasEmail: summary.dataQuality?.hasEmail || 0,
            hasPhone: summary.dataQuality?.hasPhone || 0,
            hasCompany: summary.dataQuality?.hasCompany || 0,
            missingCriticalData: summary.dataQuality?.missingCriticalData || 0
          }
        };
      };

      const parseAIRecommendations = (recommendations: any): AIRecommendation[] => {
        if (!Array.isArray(recommendations)) return [];
        return recommendations.map((rec: any) => ({
          id: rec.id || '',
          type: rec.type || 'field_mapping',
          title: rec.title || '',
          description: rec.description || '',
          action: rec.action,
          confidence: rec.confidence || 0,
          accepted: rec.accepted
        }));
      };

      const session: ImportSession = {
        id: data.id,
        company_id: data.company_id,
        user_id: data.user_id,
        import_type: data.import_type as ImportSession['import_type'],
        status: data.status as ImportSession['status'],
        file_name: data.file_name || undefined,
        total_records: data.total_records,
        processed_records: data.processed_records,
        successful_imports: data.successful_imports,
        failed_imports: data.failed_imports,
        duplicate_records: data.duplicate_records,
        field_mapping: (data.field_mapping as Record<string, string>) || {},
        import_summary: parseImportSummary(data.import_summary),
        ai_recommendations: parseAIRecommendations(data.ai_recommendations),
        error_details: data.error_details || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at,
        completed_at: data.completed_at || undefined
      };

      setCurrentSession(session);
      toast.success('Import session created');
      return session;
    } catch (error) {
      console.error('Error creating import session:', error);
      toast.error('Failed to create import session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile?.company_id]);

  const uploadRawData = useCallback(async (
    sessionId: string,
    rawData: Record<string, any>[]
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const importData = rawData.map((row, index) => ({
        import_session_id: sessionId,
        row_index: index,
        raw_data: row,
        status: 'pending' as const
      }));

      const { error } = await supabase
        .from('import_raw_data')
        .insert(importData);

      if (error) throw error;

      // Update session with total records
      await supabase
        .from('import_sessions')
        .update({ 
          total_records: rawData.length,
          status: 'mapping'
        })
        .eq('id', sessionId);

      toast.success(`${rawData.length} records uploaded for processing`);
      return true;
    } catch (error) {
      console.error('Error uploading raw data:', error);
      toast.error('Failed to upload data');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFieldMapping = useCallback(async (
    sessionId: string,
    fieldMapping: Record<string, string>
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('import_sessions')
        .update({ 
          field_mapping: fieldMapping,
          status: 'reviewing'
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Field mapping saved');
      return true;
    } catch (error) {
      console.error('Error saving field mapping:', error);
      toast.error('Failed to save field mapping');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateAIRecommendations = useCallback(async (
    sessionId: string,
    preview: ImportPreview
  ): Promise<AIRecommendation[]> => {
    // Simulate AI recommendations based on data analysis
    const recommendations: AIRecommendation[] = [];

    // Check for missing critical fields
    const hasEmail = preview.suggestedMappings.some(m => m.target === 'email' && m.confidence > 0.8);
    const hasPhone = preview.suggestedMappings.some(m => m.target === 'phone' && m.confidence > 0.8);
    const hasCompany = preview.suggestedMappings.some(m => m.target === 'company' && m.confidence > 0.8);

    if (!hasEmail) {
      recommendations.push({
        id: 'missing-email',
        type: 'field_mapping',
        title: 'Email field not detected',
        description: 'Consider mapping an email field for better lead nurturing capabilities.',
        confidence: 0.8
      });
    }

    if (!hasPhone) {
      recommendations.push({
        id: 'missing-phone',
        type: 'field_mapping',
        title: 'Phone field not detected',
        description: 'Adding phone numbers will enable calling and SMS features.',
        confidence: 0.7
      });
    }

    if (preview.totalRows > 100) {
      recommendations.push({
        id: 'large-import',
        type: 'workflow_setup',
        title: 'Large dataset detected',
        description: 'Consider setting up automated nurture sequences for efficient lead management.',
        action: 'setup_sequences',
        confidence: 0.9
      });
    }

    if (preview.detectedIssues.length > preview.totalRows * 0.1) {
      recommendations.push({
        id: 'data-quality',
        type: 'data_enrichment',
        title: 'Data quality issues detected',
        description: 'Several records have missing or invalid data. Consider data enrichment.',
        confidence: 0.8
      });
    }

    return recommendations;
  }, []);

  const processImport = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!profile?.company_id) {
      toast.error('Company not found');
      return false;
    }

    setIsLoading(true);
    try {
      // Get session and raw data
      const { data: session, error: sessionError } = await supabase
        .from('import_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const { data: rawData, error: rawDataError } = await supabase
        .from('import_raw_data')
        .select('*')
        .eq('import_session_id', sessionId)
        .eq('status', 'pending');

      if (rawDataError) throw rawDataError;

      // Update session status
      await supabase
        .from('import_sessions')
        .update({ status: 'importing' })
        .eq('id', sessionId);

      let successCount = 0;
      let errorCount = 0;

      // Process each record
      for (const record of rawData) {
        try {
          // Ensure raw_data is an object
          const rawDataObj = typeof record.raw_data === 'object' && record.raw_data !== null 
            ? record.raw_data as Record<string, any>
            : {};
            
          const mappedData = mapRawDataToLead(rawDataObj, session.field_mapping as Record<string, string>);
          
          // Ensure name is provided (required field)
          if (!mappedData.name) {
            throw new Error('Lead name is required');
          }
          
          // Create lead with all required fields
          const { error: leadError } = await supabase
            .from('leads')
            .insert({
              name: mappedData.name,
              email: mappedData.email || null,
              phone: mappedData.phone || null,
              company: mappedData.company || null,
              source: mappedData.source || null,
              status: mappedData.status || 'new',
              priority: mappedData.priority || 'medium',
              score: mappedData.score || 0,
              tags: mappedData.tags || [],
              conversion_likelihood: mappedData.conversion_likelihood || 0,
              speed_to_lead: mappedData.speed_to_lead || 0,
              is_sensitive: mappedData.is_sensitive || false,
              company_id: profile.company_id
            });

          if (leadError) throw leadError;

          // Update raw data status
          await supabase
            .from('import_raw_data')
            .update({ status: 'imported' })
            .eq('id', record.id);

          successCount++;
        } catch (error: any) {
          console.error('Error importing record:', error);
          
          // Update raw data with error
          await supabase
            .from('import_raw_data')
            .update({ 
              status: 'error',
              error_message: error.message 
            })
            .eq('id', record.id);

          errorCount++;
        }
      }

      // Update session with final results
      const summary: ImportSummary = {
        totalLeads: rawData.length,
        readyToImport: successCount,
        flaggedForAttention: errorCount,
        duplicatesFound: 0, // TODO: Implement duplicate detection
        skippedRecords: 0,
        dataQuality: {
          hasEmail: rawData.filter(r => {
            const data = r.raw_data as Record<string, any>;
            return data?.email;
          }).length,
          hasPhone: rawData.filter(r => {
            const data = r.raw_data as Record<string, any>;
            return data?.phone;
          }).length,
          hasCompany: rawData.filter(r => {
            const data = r.raw_data as Record<string, any>;
            return data?.company;
          }).length,
          missingCriticalData: errorCount
        }
      };

      // Convert ImportSummary to a plain object that can be saved as JSON
      const summaryJson = {
        totalLeads: summary.totalLeads,
        readyToImport: summary.readyToImport,
        flaggedForAttention: summary.flaggedForAttention,
        duplicatesFound: summary.duplicatesFound,
        skippedRecords: summary.skippedRecords,
        dataQuality: {
          hasEmail: summary.dataQuality.hasEmail,
          hasPhone: summary.dataQuality.hasPhone,
          hasCompany: summary.dataQuality.hasCompany,
          missingCriticalData: summary.dataQuality.missingCriticalData
        }
      };

      await supabase
        .from('import_sessions')
        .update({ 
          status: 'completed',
          successful_imports: successCount,
          failed_imports: errorCount,
          import_summary: summaryJson,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      toast.success(`Import completed: ${successCount} leads imported, ${errorCount} errors`);
      return true;
    } catch (error: any) {
      console.error('Error processing import:', error);
      
      // Update session with error
      await supabase
        .from('import_sessions')
        .update({ 
          status: 'failed',
          error_details: error.message 
        })
        .eq('id', sessionId);

      toast.error('Import failed: ' + error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [profile?.company_id]);

  const mapRawDataToLead = (rawData: Record<string, any>, fieldMapping: Record<string, string>) => {
    const mappedData: Record<string, any> = {};
    
    Object.entries(fieldMapping).forEach(([sourceField, targetField]) => {
      if (targetField && rawData[sourceField]) {
        let value = rawData[sourceField];
        
        // Data type conversion and validation
        switch (targetField) {
          case 'score':
          case 'conversion_likelihood':
          case 'speed_to_lead':
            value = parseInt(value) || 0;
            break;
          case 'tags':
            value = typeof value === 'string' ? value.split(',').map(t => t.trim()) : [];
            break;
          case 'is_sensitive':
            value = Boolean(value);
            break;
          case 'email':
            value = value.toLowerCase().trim();
            break;
          case 'phone':
            value = value.replace(/[^\d+()-\s]/g, '');
            break;
          default:
            value = String(value).trim();
        }
        
        mappedData[targetField] = value;
      }
    });

    // Set defaults
    mappedData.status = mappedData.status || 'new';
    mappedData.priority = mappedData.priority || 'medium';
    mappedData.score = mappedData.score || 0;
    mappedData.conversion_likelihood = mappedData.conversion_likelihood || 0;
    mappedData.speed_to_lead = mappedData.speed_to_lead || 0;
    mappedData.is_sensitive = mappedData.is_sensitive || false;
    mappedData.tags = mappedData.tags || [];

    return mappedData;
  };

  const fetchImportSessions = useCallback(async () => {
    if (!profile?.company_id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('import_sessions')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database response to ImportSession array with proper type handling
      const sessions: ImportSession[] = (data || []).map(item => {
        const defaultSummary: ImportSummary = {
          totalLeads: 0,
          readyToImport: 0,
          flaggedForAttention: 0,
          duplicatesFound: 0,
          skippedRecords: 0,
          dataQuality: {
            hasEmail: 0,
            hasPhone: 0,
            hasCompany: 0,
            missingCriticalData: 0
          }
        };

        const parseImportSummary = (summary: any): ImportSummary => {
          if (!summary || typeof summary !== 'object') return defaultSummary;
          return {
            totalLeads: summary.totalLeads || 0,
            readyToImport: summary.readyToImport || 0,
            flaggedForAttention: summary.flaggedForAttention || 0,
            duplicatesFound: summary.duplicatesFound || 0,
            skippedRecords: summary.skippedRecords || 0,
            dataQuality: {
              hasEmail: summary.dataQuality?.hasEmail || 0,
              hasPhone: summary.dataQuality?.hasPhone || 0,
              hasCompany: summary.dataQuality?.hasCompany || 0,
              missingCriticalData: summary.dataQuality?.missingCriticalData || 0
            }
          };
        };

        const parseAIRecommendations = (recommendations: any): AIRecommendation[] => {
          if (!Array.isArray(recommendations)) return [];
          return recommendations.map((rec: any) => ({
            id: rec.id || '',
            type: rec.type || 'field_mapping',
            title: rec.title || '',
            description: rec.description || '',
            action: rec.action,
            confidence: rec.confidence || 0,
            accepted: rec.accepted
          }));
        };

        return {
          id: item.id,
          company_id: item.company_id,
          user_id: item.user_id,
          import_type: item.import_type as ImportSession['import_type'],
          status: item.status as ImportSession['status'],
          file_name: item.file_name || undefined,
          total_records: item.total_records,
          processed_records: item.processed_records,
          successful_imports: item.successful_imports,
          failed_imports: item.failed_imports,
          duplicate_records: item.duplicate_records,
          field_mapping: (item.field_mapping as Record<string, string>) || {},
          import_summary: parseImportSummary(item.import_summary),
          ai_recommendations: parseAIRecommendations(item.ai_recommendations),
          error_details: item.error_details || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at,
          completed_at: item.completed_at || undefined
        };
      });

      setImportSessions(sessions);
    } catch (error) {
      console.error('Error fetching import sessions:', error);
      toast.error('Failed to fetch import history');
    } finally {
      setIsLoading(false);
    }
  }, [profile?.company_id]);

  return {
    isLoading,
    importSessions,
    currentSession,
    parseCSVFile,
    createImportSession,
    uploadRawData,
    saveFieldMapping,
    generateAIRecommendations,
    processImport,
    fetchImportSessions,
    setCurrentSession
  };
};
