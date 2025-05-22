
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Phone, 
  Clock, 
  Calendar, 
  MessageCircle, 
  CheckCircle, 
  AlarmClock, 
  ChevronDown
} from 'lucide-react';

const Dialer = () => {
  const [callStatus, setCallStatus] = useState<'idle' | 'connected' | 'voicemail' | 'no-answer' | 'finished'>('finished');
  const [countdownValue, setCountdownValue] = useState<number>(10);
  const [activeTab, setActiveTab] = useState('details');
  
  // Simulated countdown for auto-dialing
  React.useEffect(() => {
    if (callStatus === 'idle' && countdownValue > 0) {
      const timer = setTimeout(() => {
        setCountdownValue(countdownValue - 1);
        
        if (countdownValue === 1) {
          // Simulate call connection
          setCallStatus('connected');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [callStatus, countdownValue]);
  
  const getStatusBadge = () => {
    switch (callStatus) {
      case 'connected':
        return <Badge className="bg-salesGreen text-white px-3 py-1">🟢 Connected</Badge>;
      case 'voicemail':
        return <Badge className="bg-salesRed text-white px-3 py-1">🔴 Voicemail</Badge>;
      case 'no-answer':
        return <Badge className="bg-amber-400 text-slate-800 px-3 py-1">🟡 No Answer</Badge>;
      case 'finished':
        return <Badge className="bg-slate-500 text-white px-3 py-1">✓ Call Finished</Badge>;
      default:
        return <Badge className="bg-slate-300 text-slate-700 px-3 py-1">Idle</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Contact Info & Call Actions */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-bold">Michael Scott</CardTitle>
                      <CardDescription className="text-base">
                        Regional Manager, Dunder Mifflin
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge()}
                      
                      <div className="relative w-14 h-14">
                        {callStatus === 'idle' && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-salesBlue">
                              {countdownValue}
                            </div>
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                className="stroke-current text-slate-200"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="stroke-current text-salesCyan"
                                strokeWidth="3"
                                strokeDasharray={`${100 - ((countdownValue / 10) * 100)}, 100`}
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </>
                        )}
                        {callStatus !== 'idle' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-salesBlue" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4 bg-slate-100">
                      <TabsTrigger value="details">Contact Details</TabsTrigger>
                      <TabsTrigger value="address">Address</TabsTrigger>
                      <TabsTrigger value="history">Call History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Email</div>
                          <div className="text-salesBlue">michael.scott@dundermifflin.com</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Phone</div>
                          <div className="text-salesBlue">(570) 555-0123</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Company</div>
                          <div>Dunder Mifflin Paper Company</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Lead Source</div>
                          <div>LinkedIn Referral</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Match Score</div>
                          <div className="flex items-center">
                            <Badge className="bg-salesCyan-light border-salesCyan/20 text-salesBlue mr-2">
                              85%
                            </Badge>
                            <span className="text-sm text-slate-500">High potential</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Last Contact</div>
                          <div>2 days ago (Email)</div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="address">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-slate-500 mb-1">Street Address</div>
                          <div>1725 Slough Avenue, Suite 200</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1">City</div>
                            <div>Scranton</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1">State</div>
                            <div>Pennsylvania</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-500 mb-1">Zip</div>
                            <div>18505</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="space-y-3">
                        <div className="border-b pb-3">
                          <div className="flex justify-between">
                            <div className="font-medium">May 20, 2025 - 3:42 PM</div>
                            <Badge variant="outline" className="bg-slate-100">Voicemail</Badge>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Left message about product demo. Will follow up via email.
                          </div>
                        </div>
                        <div className="border-b pb-3">
                          <div className="flex justify-between">
                            <div className="font-medium">May 18, 2025 - 10:15 AM</div>
                            <Badge variant="outline" className="bg-salesGreen/10 text-salesGreen border-salesGreen/30">Connected</Badge>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Initial call. Interested in product, requested more information.
                          </div>
                        </div>
                        <div className="border-b pb-3">
                          <div className="flex justify-between">
                            <div className="font-medium">May 15, 2025 - 2:30 PM</div>
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">No Answer</Badge>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            No answer on first attempt. Added to follow-up queue.
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* AI Notes Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <span>📝</span> AI Call Notes
                    <Badge className="ml-2 bg-salesCyan/10 text-salesCyan">Auto-Generated</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Key Points</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        <li>Interested in upgrading their paper inventory management system</li>
                        <li>Current vendor contract expires in 30 days</li>
                        <li>Looking for cloud-based solution with mobile capabilities</li>
                        <li>Budget range: $15,000 - $25,000 annually</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Objections Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Price concerns
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Integration complexity
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Team training needed
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Sentiment Analysis</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-salesGreen rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-medium">Positive (65%)</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        <li>Send product demo video highlighting mobile features</li>
                        <li>Schedule call with technical team to address integration concerns</li>
                        <li>Prepare customized pricing proposal within budget range</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
                  <Button className="bg-salesBlue hover:bg-salesBlue-dark gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    Send Follow-up
                  </Button>
                  <Button variant="outline" className="border-slate-300 gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Reschedule Call
                  </Button>
                  <Button variant="outline" className="border-slate-300 gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    Mark Outcome
                  </Button>
                  <Button variant="outline" className="border-slate-300 gap-1.5">
                    <AlarmClock className="h-4 w-4" />
                    Assign Workflow
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column - Dialer Queue & Call Actions */}
            <div>
              <Card className="mb-6">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <span>Dialer Queue</span>
                    <Badge variant="outline" className="text-salesRed border-salesRed/30 bg-salesRed/10">
                      5 High Priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-72 overflow-y-auto">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div 
                        key={index} 
                        className={`p-3 hover:bg-slate-50 transition-colors ${index === 1 ? 'bg-salesBlue/5' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">{index === 1 ? 'Michael Scott' : `Lead #${index}`}</div>
                          <Badge className={index <= 2 ? 'bg-salesRed text-white' : index <= 4 ? 'bg-amber-400 text-slate-800' : 'bg-slate-200 text-slate-600'}>
                            {index <= 2 ? 'High' : index <= 4 ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-500">{index === 1 ? 'Dunder Mifflin' : `Company #${index}`}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-slate-100 text-xs font-normal">
                            {index === 1 ? 'LinkedIn' : index === 2 ? 'Website' : index === 3 ? 'Referral' : 'Facebook'}
                          </Badge>
                          <Badge variant="outline" className="bg-salesCyan-light text-salesBlue border-salesCyan/20 text-xs font-normal">
                            {index === 1 ? '85%' : index === 2 ? '79%' : index === 3 ? '68%' : index === 4 ? '62%' : '58%'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-salesCyan hover:bg-salesCyan-dark gap-2">
                    <Phone className="h-4 w-4" />
                    Auto-Dial Next Lead
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle>Call Actions</CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-2">
                    <Button className="w-full justify-start text-left bg-salesGreen hover:bg-salesGreen-dark gap-2">
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-slate-300 gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Send Email Template
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-slate-300 gap-2">
                      <span>📌</span>
                      Save To Favorites
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-slate-300 gap-2">
                      <span>📝</span>
                      View Full Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-slate-300 gap-2">
                      <ChevronDown className="h-4 w-4" />
                      More Actions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Dialer;
