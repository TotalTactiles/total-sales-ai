
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
        console.error('Error uploading file:', error);
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

      return (data || []).map(log => ({
        id: log.id,
        name: log.payload?.fileName || 'Unknown',
        type: log.payload?.fileType || 'unknown',
        size: log.payload?.fileSize || 0,
        uploadDate: new Date(log.timestamp),
        category: log.payload?.category || 'general',
        tags: log.payload?.tags || [],
        url: `#file-${log.payload?.fileName}`
      }));
    } catch (error) {
      console.error('Error getting uploaded files:', error);
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
      console.error('Error categorizing file:', error);
    }
  }
}

export const documentService = new DocumentService();
