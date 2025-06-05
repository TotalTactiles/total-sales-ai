import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from './types';
import { toast } from 'sonner';

export class DocumentService {
  async uploadFiles(files: File[], companyId: string, category: string = 'general'): Promise<UploadedFile[]> {
    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      try {
        // Log file processing
        await supabase
          .from('ai_brain_logs')
          .insert({
            type: 'document_upload',
            event_summary: `File uploaded: ${file.name}`,
            payload: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              category,
              timestamp: new Date().toISOString()
            },
            company_id: companyId,
            visibility: 'admin_only'
          });

        // Create uploaded file record
        const uploadedFile: UploadedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          category,
          tags: [],
          url: `#file-${file.name}` // Placeholder URL
        };

        uploadedFiles.push(uploadedFile);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        logger.error('Error uploading file:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    return uploadedFiles;
  }

  async getUploadedFiles(companyId: string): Promise<UploadedFile[]> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'document_upload')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return (data || []).map(log => {
        const payload = this.safeGetPayload(log.payload);
        
        return {
          id: log.id,
          name: this.safeGetString(payload.fileName, 'Unknown'),
          type: this.safeGetString(payload.fileType, 'unknown'),
          size: this.safeGetNumber(payload.fileSize, 0),
          uploadDate: new Date(log.timestamp),
          category: this.safeGetString(payload.category, 'general'),
          tags: Array.isArray(payload.tags) ? payload.tags : [],
          url: `#file-${this.safeGetString(payload.fileName, 'unknown')}`
        };
      });
    } catch (error) {
      logger.error('Error getting uploaded files:', error);
      return [];
    }
  }

  async categorizeFile(fileId: string, category: string, companyId: string): Promise<void> {
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'document_categorize',
          event_summary: `File categorized: ${category}`,
          payload: {
            fileId,
            category,
            timestamp: new Date().toISOString()
          },
          company_id: companyId,
          visibility: 'admin_only'
        });
    } catch (error) {
      logger.error('Error categorizing file:', error);
    }
  }

  private safeGetPayload(payload: any): Record<string, any> {
    if (payload && typeof payload === 'object') {
      return payload as Record<string, any>;
    }
    return {};
  }

  private safeGetString(value: any, defaultValue: string): string {
    if (typeof value === 'string') return value;
    if (value !== null && value !== undefined) return String(value);
    return defaultValue;
  }

  private safeGetNumber(value: any, defaultValue: number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  }
}

export const documentService = new DocumentService();
