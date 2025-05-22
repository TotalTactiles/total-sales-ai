
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  MessageSquare, 
  Upload, 
  Search, 
  File, 
  Plus, 
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

const CompanyBrain = () => {
  // Sample data for brand voice
  const brandVoice = {
    tone: "Professional yet approachable, confident without being pushy",
    keyPhrases: [
      "data-driven insights",
      "streamline your workflow",
      "boost productivity",
      "enterprise-grade security",
      "seamless integration"
    ],
    avoidPhrases: [
      "cheap",
      "basic",
      "simple solution",
      "just a tool",
      "beginner-friendly"
    ]
  };
  
  // Sample data for objection mapping
  const objectionMappings = [
    {
      objection: "Your product is too expensive",
      response: "I understand budget concerns. Our solution provides an ROI of typically 3x within the first 6 months through automation and efficiency gains. Would it be helpful to walk through a customized ROI calculation for your specific use case?",
      effectiveness: 78
    },
    {
      objection: "We already use a competitor",
      response: "That's great to hear you're already seeing the value in this type of solution. Many of our current customers switched from that provider because of our advanced AI capabilities and dedicated support team. What aspects of your current solution are working well, and where do you see room for improvement?",
      effectiveness: 82
    },
    {
      objection: "We need to think about it",
      response: "Taking time to consider all options is completely reasonable. To help with your decision process, can I send over a comparison guide and case study from a company in your industry? Also, what specific aspects do you need more information on to make your decision?",
      effectiveness: 65
    },
    {
      objection: "We don't have the budget right now",
      response: "I appreciate the budget constraints. We offer flexible payment terms and can structure a phased implementation approach that aligns with your budget cycles. When would be a better time in your fiscal planning to revisit this conversation?",
      effectiveness: 71
    },
  ];
  
  // Sample data for case studies
  const caseStudies = [
    {
      id: 1,
      company: "Acme Corporation",
      industry: "Manufacturing",
      challenge: "Inefficient sales process with 45-day sales cycle",
      solution: "Implemented AI-powered lead scoring and automated follow-ups",
      results: "Reduced sales cycle to 28 days and increased conversion by 32%",
      date: "March 2025"
    },
    {
      id: 2,
      company: "TechVision Inc.",
      industry: "Software",
      challenge: "Low demo-to-close ratio of 15%",
      solution: "Personalized demo scripts and objection handling frameworks",
      results: "Increased demo-to-close ratio to 37% within 60 days",
      date: "April 2025"
    },
    {
      id: 3,
      company: "Global Services Ltd.",
      industry: "Professional Services",
      challenge: "Inconsistent sales messaging across 12 regional teams",
      solution: "Centralized knowledge base with AI-recommended responses",
      results: "33% improvement in message consistency and 28% higher close rates",
      date: "May 2025"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-salesBlue flex items-center">
              <BookOpen className="mr-2 h-7 w-7" />
              Company Brain
            </h1>
            <p className="text-slate-500">Access and manage your company's collective sales intelligence</p>
          </div>
          
          <Tabs defaultValue="brand" className="mb-6">
            <TabsList>
              <TabsTrigger value="brand">Brand Voice</TabsTrigger>
              <TabsTrigger value="objections">Objection Mapper</TabsTrigger>
              <TabsTrigger value="casestudies">Case Studies</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            </TabsList>
            
            <TabsContent value="brand" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Brand Voice Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Company Tone</h3>
                        <p className="text-slate-600">{brandVoice.tone}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Key Phrases To Use</h3>
                        <div className="flex flex-wrap gap-2">
                          {brandVoice.keyPhrases.map((phrase, index) => (
                            <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100">
                              {phrase}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Phrases To Avoid</h3>
                        <div className="flex flex-wrap gap-2">
                          {brandVoice.avoidPhrases.map((phrase, index) => (
                            <div key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-100">
                              {phrase}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Example Messaging</h3>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className="text-slate-600 italic">
                            "Our platform delivers data-driven insights that streamline your workflow, boosting productivity while maintaining enterprise-grade security. The seamless integration with your existing tools ensures minimal disruption during implementation."
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Request Changes</Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Message Assistant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Draft your message</label>
                        <Textarea 
                          placeholder="Type your sales message here..." 
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <Button className="w-full mb-4 bg-salesCyan">Check Message Alignment</Button>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <h4 className="font-medium text-sm mb-2">Analysis Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Tone Match</span>
                            <span className="text-sm font-medium text-green-600">92%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Key Phrases Used</span>
                            <span className="text-sm font-medium">2/5</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Phrases to Remove</span>
                            <span className="text-sm font-medium text-red-600">1</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="objections" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle>Objection Response Library</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {objectionMappings.map((item, index) => (
                          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-salesBlue">{item.objection}</h3>
                              <div className={`px-2 py-1 rounded-md text-sm font-medium ${
                                item.effectiveness >= 80 ? 'bg-green-100 text-green-800' :
                                item.effectiveness >= 70 ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {item.effectiveness}% Effective
                              </div>
                            </div>
                            <p className="text-slate-600 mb-3">{item.response}</p>
                            <div className="flex items-center gap-3">
                              <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Works Well
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Needs Work
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit Response
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Objection Finder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="Search objections..." className="pl-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="bg-slate-100 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-slate-200">
                          Price objections
                        </div>
                        <div className="bg-slate-100 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-slate-200">
                          Competitor comparisons
                        </div>
                        <div className="bg-slate-100 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-slate-200">
                          Implementation concerns
                        </div>
                        <div className="bg-slate-100 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-slate-200">
                          Security questions
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h4 className="font-medium text-salesBlue mb-2 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          AI Assistant
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Not finding what you need? I can help draft a custom response for any objection.
                        </p>
                        <Button size="sm" className="bg-salesBlue w-full">
                          Get AI Help
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="casestudies" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle>Case Study Library</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Case Study
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {caseStudies.map((study) => (
                          <Card key={study.id} className="border shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{study.company}</h3>
                                <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                                  {study.industry}
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div>
                                  <div className="text-xs font-medium text-slate-500">Challenge:</div>
                                  <div className="text-sm">{study.challenge}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-slate-500">Solution:</div>
                                  <div className="text-sm">{study.solution}</div>
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-slate-500">Results:</div>
                                  <div className="text-sm text-green-600 font-medium">{study.results}</div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-500">{study.date}</div>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload New Case Study</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center mb-4">
                        <Upload className="h-10 w-10 text-slate-400 mb-3" />
                        <h3 className="font-medium mb-1">Upload Files</h3>
                        <p className="text-slate-500 text-sm mb-3">
                          Drag and drop or click to upload PDF, DOCX, or presentation files
                        </p>
                        <Button size="sm">Select Files</Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center bg-slate-50 p-2 rounded border border-slate-200">
                          <File className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="text-sm flex-1">acme-success-story.pdf</span>
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-slate-500">
                        <p>After upload, our AI will automatically extract key metrics and format the case study for your team.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Submit for Processing</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Knowledge Base</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex gap-1 items-center">
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                          </Button>
                          <Button size="sm" className="flex gap-1 items-center">
                            <Plus className="h-4 w-4" />
                            Add Entry
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-5 bg-slate-100 p-3">
                          <div className="col-span-2 font-medium text-sm">Topic</div>
                          <div className="col-span-1 font-medium text-sm">Category</div>
                          <div className="col-span-1 font-medium text-sm">Last Updated</div>
                          <div className="col-span-1 font-medium text-sm">Actions</div>
                        </div>
                        
                        {[
                          { 
                            id: 1, 
                            topic: "Product Feature Comparison", 
                            category: "Product", 
                            updated: "2 days ago", 
                            views: 128
                          },
                          { 
                            id: 2, 
                            topic: "Enterprise Security Standards", 
                            category: "Technical", 
                            updated: "1 week ago", 
                            views: 87
                          },
                          { 
                            id: 3, 
                            topic: "ROI Calculator Guidelines", 
                            category: "Sales", 
                            updated: "3 days ago", 
                            views: 156
                          },
                          { 
                            id: 4, 
                            topic: "Integration Documentation", 
                            category: "Technical", 
                            updated: "5 days ago", 
                            views: 112
                          },
                          { 
                            id: 5, 
                            topic: "Competitive Intelligence Summary", 
                            category: "Market", 
                            updated: "Today", 
                            views: 204
                          },
                        ].map((item) => (
                          <div key={item.id} className="grid grid-cols-5 p-3 border-t hover:bg-slate-50">
                            <div className="col-span-2">
                              <div className="font-medium">{item.topic}</div>
                              <div className="text-xs text-slate-500">{item.views} views</div>
                            </div>
                            <div className="col-span-1 self-center">
                              <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                                {item.category}
                              </span>
                            </div>
                            <div className="col-span-1 self-center text-sm text-slate-500">
                              {item.updated}
                            </div>
                            <div className="col-span-1 self-center">
                              <Button size="sm" variant="ghost">View</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Search</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search knowledge base..." className="pl-10" />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Popular Topics</h3>
                        <div className="space-y-2">
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-sm cursor-pointer hover:bg-slate-100">
                            Pricing structure and discount policies
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-sm cursor-pointer hover:bg-slate-100">
                            New feature announcements (May 2025)
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-sm cursor-pointer hover:bg-slate-100">
                            Enterprise implementation timeline
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recent Updates</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <RefreshCw className="h-3 w-3 text-salesBlue" />
                            <span>Pricing sheet updated</span>
                            <span className="text-xs text-slate-500 ml-auto">2h ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <RefreshCw className="h-3 w-3 text-salesBlue" />
                            <span>New competitor analysis</span>
                            <span className="text-xs text-slate-500 ml-auto">1d ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <RefreshCw className="h-3 w-3 text-salesBlue" />
                            <span>Product roadmap refreshed</span>
                            <span className="text-xs text-slate-500 ml-auto">3d ago</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyBrain;
