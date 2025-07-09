
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';
import { toast } from 'sonner';

const ZohoCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Zoho authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      toast.error('Zoho authentication failed');
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      toast.error('Invalid authentication response');
      return;
    }

    try {
      const result = await zohoCRMIntegration.handleAuthCallback(code);
      
      if (result.success) {
        setStatus('success');
        setMessage('Zoho CRM connected successfully!');
        toast.success('Zoho CRM integrated successfully');
        
        // Close popup if opened in popup, otherwise redirect
        if (window.opener) {
          window.opener.postMessage({ type: 'ZOHO_AUTH_SUCCESS' }, '*');
          window.close();
        } else {
          setTimeout(() => {
            navigate('/settings/integrations');
          }, 3000);
        }
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to complete authentication');
      toast.error('Failed to connect Zoho CRM');
      
      if (window.opener) {
        window.opener.postMessage({ type: 'ZOHO_AUTH_ERROR', error: error.message }, '*');
        setTimeout(() => window.close(), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connecting Zoho CRM</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-700 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
              {!window.opener && (
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to integrations page...
                </p>
              )}
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-700 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">{message}</p>
              {!window.opener && (
                <p className="text-sm text-gray-500 mt-4">
                  You can close this window and try again.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ZohoCallback;
