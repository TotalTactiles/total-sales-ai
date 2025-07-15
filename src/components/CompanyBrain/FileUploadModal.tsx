
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  HardDrive, 
  Cloud, 
  File, 
  Image, 
  FileText,
  Database,
  Globe,
  Folder
} from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], metadata: any) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'general'
  });

  const uploadSources = [
    {
      id: 'local',
      name: 'Local Device',
      icon: HardDrive,
      description: 'Upload files from your computer',
      supported: ['PDF', 'DOC', 'DOCX', 'TXT', 'CSV', 'XLS', 'XLSX', 'JPG', 'PNG']
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: Database,
      description: 'Import from Google Drive',
      supported: ['All Google Drive files'],
      comingSoon: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: Cloud,
      description: 'Import from Dropbox',
      supported: ['All Dropbox files'],
      comingSoon: true
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: Folder,
      description: 'Import from Microsoft OneDrive',
      supported: ['All OneDrive files'],
      comingSoon: true
    },
    {
      id: 'url',
      name: 'Web URL',
      icon: Globe,
      description: 'Import content from a website URL',
      supported: ['Web pages', 'Documents', 'Articles']
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUpload = () => {
    if (selectedSource === 'local' && files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!metadata.title) {
      toast.error('Please provide a title for the knowledge item');
      return;
    }

    onUpload(files, {
      ...metadata,
      source: selectedSource,
      tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });

    // Reset form
    setFiles([]);
    setMetadata({ title: '', description: '', tags: '', category: 'general' });
    setSelectedSource('');
    onClose();
  };

  const renderSourceContent = () => {
    const source = uploadSources.find(s => s.id === selectedSource);
    if (!source) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-blue-50">
          <source.icon className="h-6 w-6 text-blue-600" />
          <div>
            <h4 className="font-medium">{source.name}</h4>
            <p className="text-sm text-gray-600">{source.description}</p>
          </div>
        </div>

        {source.comingSoon ? (
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
            <p className="text-orange-800 text-sm">
              🚧 Coming Soon - This integration is currently being developed
            </p>
          </div>
        ) : (
          <>
            {selectedSource === 'local' && (
              <div className="space-y-3">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="cursor-pointer"
                />
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Files:</p>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <File className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedSource === 'url' && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter website URL (e.g., https://example.com/article)"
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  We'll extract and process the content from this URL
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Input
                placeholder="Knowledge item title *"
                value={metadata.title}
                onChange={(e) => setMetadata({...metadata, title: e.target.value})}
              />
              <Textarea
                placeholder="Description (optional)"
                value={metadata.description}
                onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                rows={3}
              />
              <Input
                placeholder="Tags (comma-separated, e.g., sales, process, training)"
                value={metadata.tags}
                onChange={(e) => setMetadata({...metadata, tags: e.target.value})}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Knowledge Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedSource ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadSources.map((source) => {
                const IconComponent = source.icon;
                return (
                  <Card 
                    key={source.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{source.name}</CardTitle>
                            {source.comingSoon && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {source.supported.slice(0, 3).map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                        {source.supported.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{source.supported.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedSource('')}
                className="mb-4"
              >
                ← Back to Source Selection
              </Button>
              
              {renderSourceContent()}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpload} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import to Knowledge Base
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
