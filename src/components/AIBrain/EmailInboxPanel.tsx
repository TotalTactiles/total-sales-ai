
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Search, 
  Filter, 
  RefreshCw, 
  Star, 
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { formatDistanceToNow } from 'date-fns';

const EmailInboxPanel = () => {
  const { emails, loading, fetchEmails, providers } = useEmailConnection();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const isConnected = providers.some(p => p.connected);

  useEffect(() => {
    if (isConnected) {
      fetchEmails();
    }
  }, [isConnected]);

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmailData = emails.find(email => email.id === selectedEmail);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Inbox
          </CardTitle>
          <CardDescription>
            Connect an email provider to view your inbox
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No email providers connected. Go to Settings to connect your email accounts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Email Inbox Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Inbox
              </CardTitle>
              <CardDescription>
                {emails.length} emails • {emails.filter(e => !e.isRead).length} unread
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchEmails}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Email List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {loading && emails.length === 0 ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading emails...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No emails found</p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedEmail === email.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedEmail(email.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <p className="font-medium text-sm truncate">
                            {email.sender}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {email.subject}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {email.body}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedEmailData ? 'Email Details' : 'Select an Email'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEmailData ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{selectedEmailData.subject}</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Forward className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <strong>From:</strong> {selectedEmailData.sender}
                    </div>
                    <div>
                      <strong>To:</strong> {selectedEmailData.recipient}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(selectedEmailData.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="prose prose-sm max-w-none">
                  <p>{selectedEmailData.body}</p>
                </div>
                
                {selectedEmailData.labels && selectedEmailData.labels.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Labels:</span>
                    {selectedEmailData.labels.map((label, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">AI Insights</h4>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      📊 <strong>Sentiment:</strong> Neutral • <strong>Priority:</strong> Medium • <strong>Category:</strong> Business
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Generate AI Response
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select an email from the list to view its content
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailInboxPanel;
