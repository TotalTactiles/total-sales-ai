
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Mic,
  AlertTriangle,
  CheckCircle,
  Edit,
  Play,
  Search,
  Download,
  Upload
} from 'lucide-react';

const AIAgentFeedback = () => {
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTab, setActiveTab] = useState('training');
  
  // Sample objection data
  const objections = [
    { 
      id: 'obj1', 
      objection: 'Not the right time',
      category: 'Timing',
      frequency: 28,
      winningRebuttal: "I completely understand timing can be tricky. Many of our customers felt the same way, but found that a quick 15-minute overview actually saved them time in the long run. Would that work better for you?",
      effectiveness: 72
    },
    { 
      id: 'obj2', 
      objection: 'Already using a competitor',
      category: 'Competition',
      frequency: 21,
      winningRebuttal: "That's great to hear you're already addressing this need. Many of our current customers switched from that solution because of our unique features around [key differentiator]. Would it be worth a quick comparison to see if there might be some efficiency gains?",
      effectiveness: 65
    },
    { 
      id: 'obj3', 
      objection: 'No budget currently',
      category: 'Budget',
      frequency: 16,
      winningRebuttal: "I understand budget constraints are real. Our solution typically pays for itself within [timeframe] through [specific ROI mechanism]. Would it make sense to at least explore the potential ROI for your specific situation?",
      effectiveness: 58
    },
    { 
      id: 'obj4', 
      objection: 'Need to speak with team/committee',
      category: 'Decision Process',
      frequency: 12,
      winningRebuttal: "That makes perfect sense. Group decisions are important. Many of our clients find it helpful to have an initial information session where I can provide materials that make it easier for you to discuss internally. Would that be useful?",
      effectiveness: 81
    },
  ];
  
  // Sample script improvements
  const scriptImprovements = [
    { 
      id: 'imp1', 
      description: 'Opening line optimization',
      originalScript: "Hi, this is Sarah from TechSales calling about your software needs.",
      improvedScript: "Hi, this is Sarah from TechSales. I noticed your company recently expanded its remote workforce, and I'm reaching out specifically about tools that might help with your distributed team collaboration.",
      improvement: 'Added personalization and specific value proposition',
      effectiveness: 82
    },
    { 
      id: 'imp2', 
      description: 'Gatekeeper handling',
      originalScript: "Can you please connect me with the IT manager?",
      improvedScript: "I'm calling regarding some productivity solutions that have been helping IT teams similar to yours save about 15 hours per week on system maintenance. Would you mind connecting me with the person who oversees your IT infrastructure?",
      improvement: 'Added value proposition and specific benefit',
      effectiveness: 68
    },
    { 
      id: 'imp3', 
      description: 'Meeting scheduling',
      originalScript: "Would you like to schedule a meeting with our team?",
      improvedScript: "Based on what you've shared, a brief 20-minute demo focused specifically on your compliance reporting challenges would be the best next step. I see Emily has availability this Thursday at 2pm or Friday morning - which might work better for your calendar?",
      improvement: 'Added specificity, value, and concrete options',
      effectiveness: 75
    },
  ];
  
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please enter feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Feedback Submitted",
      description: "Your feedback on the AI agent has been recorded.",
    });
    
    setFeedbackText('');
  };
  
  const handlePlayExample = () => {
    toast({
      title: "Playing Example",
      description: "Now playing the voice sample.",
    });
  };
  
  const handleImproveScript = (id: string) => {
    toast({
      title: "Script Improvement",
      description: "The AI will analyze and suggest improvements to this script.",
    });
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "AI agent performance report has been downloaded.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="training" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="training">Training & Feedback</TabsTrigger>
          <TabsTrigger value="objections">Objection Handler</TabsTrigger>
          <TabsTrigger value="improvements">Script Improvements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="training" className="space-y-6">
          {/* Feedback Submission Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-salesBlue" />
                Agent Feedback
              </CardTitle>
              <CardDescription>
                Provide feedback to improve the AI agent's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      variant="outline"
                      className="h-14 w-14 rounded-full bg-green-50 hover:bg-green-100 border-green-200 text-green-600"
                      onClick={() => {
                        toast({
                          title: "Positive Feedback",
                          description: "Thank you for your positive feedback!",
                        });
                      }}
                    >
                      <ThumbsUp className="h-6 w-6" />
                    </Button>
                    <span className="text-sm text-green-600">Working Well</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">What aspects of the AI agent are working well?</p>
                    <Textarea 
                      placeholder="e.g., Great handling of objections about budget concerns..." 
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg border">
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      variant="outline"
                      className="h-14 w-14 rounded-full bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                      onClick={() => {
                        toast({
                          title: "Negative Feedback",
                          description: "Thank you for helping us improve!",
                        });
                      }}
                    >
                      <ThumbsDown className="h-6 w-6" />
                    </Button>
                    <span className="text-sm text-red-600">Needs Work</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">What aspects of the AI agent need improvement?</p>
                    <Textarea 
                      placeholder="e.g., The voice sounds too robotic when discussing pricing..." 
                      rows={2}
                      className="resize-none"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="detailed-feedback">Specific Learning Opportunities</Label>
                  <Textarea 
                    id="detailed-feedback"
                    placeholder="Provide detailed feedback or suggestions for the AI agent..." 
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
            </CardFooter>
          </Card>
          
          {/* Voice Tone Training Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-salesBlue" />
                Voice & Tone Training
              </CardTitle>
              <CardDescription>
                Train the AI agent with examples of ideal conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Call Recordings</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-3">
                      <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Upload recordings of successful calls to train the AI agent's voice and tone
                    </p>
                    <Button variant="outline" size="sm" as="label" className="cursor-pointer">
                      Select Files
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="audio/mp3,audio/wav"
                        multiple
                        onChange={() => {
                          toast({
                            title: "Files Selected",
                            description: "Ready to upload training files.",
                          });
                        }}
                      />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sample Voice Profiles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border rounded-lg p-3 hover:bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Alex (Top SDR)</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={handlePlayExample}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">Consultative, warm, knowledgeable tone</p>
                      <div className="mt-2">
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Jamie (VP Sales)</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={handlePlayExample}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">Authoritative, confident, executive presence</p>
                      <div className="mt-2">
                        <Badge className="bg-slate-400">Not Active</Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Taylor (AE)</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={handlePlayExample}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">Friendly, energetic, solutions-focused</p>
                      <div className="mt-2">
                        <Badge className="bg-slate-400">Not Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tone-instructions">AI Agent Tone Instructions</Label>
                  <Textarea 
                    id="tone-instructions"
                    defaultValue="The AI agent should use a confident yet friendly tone. Speak naturally with occasional pauses, avoid technical jargon unless the prospect uses it first, and maintain a conversational style that focuses on asking questions and actively listening." 
                    rows={4}
                  />
                  <p className="text-xs text-slate-500">
                    These instructions influence how the AI agent modulates its tone, pacing, and speech patterns.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Voice Training</Button>
            </CardFooter>
          </Card>
          
          {/* Prohibited Words & Phrases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Prohibited Words & Phrases
              </CardTitle>
              <CardDescription>
                Specify words and phrases the AI agent should never use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prohibited-phrases">Prohibited Phrases</Label>
                  <Textarea 
                    id="prohibited-phrases"
                    defaultValue="To be honest, Actually, Basically, Trust me, I don't know, AI assistant, robot, automation, Unfortunately, Just checking in" 
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Enter phrases separated by commas. The AI will avoid these words and find alternatives.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trigger-words">Trigger Words (Emergency Stop)</Label>
                  <Input 
                    id="trigger-words"
                    defaultValue="lawyer, legal action, complaint, refund, supervisor, manage"
                  />
                  <p className="text-xs text-slate-500">
                    If these words are detected, the AI agent will politely end the call and alert a human rep.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compliance-rules">Compliance Rules</Label>
                  <Textarea 
                    id="compliance-rules"
                    defaultValue="- Never make guarantees about results or timeline\n- Never discuss pricing specifics without human approval\n- Always disclose that call may be recorded\n- Never claim to be a specific person unless trained on their voice" 
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Prohibited Content</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="objections" className="space-y-6">
          {/* Objection Handler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objection Library & Training</CardTitle>
              <CardDescription>
                Review and improve AI responses to common objections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search objections..."
                  className="pl-9"
                />
              </div>
              
              {/* Objections List */}
              <div className="space-y-6">
                {objections.map((objection) => (
                  <div key={objection.id} className="border rounded-lg">
                    <div className="p-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{objection.objection}</h3>
                          <Badge variant="outline">{objection.category}</Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                          Frequency: <span className="font-medium">{objection.frequency}%</span> of calls
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-600 mr-2">
                          {objection.effectiveness}% Effective
                        </span>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t bg-slate-50">
                      <Label className="text-sm text-slate-600">Winning Response</Label>
                      <div className="mt-1 p-3 bg-white border rounded-md">
                        <p className="text-sm">{objection.winningRebuttal}</p>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500">Success Rate</Label>
                          <div className="w-40 h-2">
                            <Progress value={objection.effectiveness} className="h-2" />
                          </div>
                        </div>
                        
                        <div>
                          <Button size="sm" variant="outline" onClick={handlePlayExample}>
                            <Play className="h-3.5 w-3.5 mr-1.5" />
                            Hear Example
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Objection */}
              <div className="border-t pt-6">
                <Button onClick={() => {
                  toast({
                    title: "Add Objection",
                    description: "New objection form opened.",
                  });
                }}>
                  Add New Objection Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="improvements" className="space-y-6">
          {/* Script Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                AI-Generated Script Improvements
              </CardTitle>
              <CardDescription>
                Recent script improvements generated by the AI based on successful calls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scriptImprovements.map((improvement) => (
                <div key={improvement.id} className="border rounded-lg">
                  <div className="p-4 border-b bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{improvement.description}</h3>
                      <Badge className="bg-green-500">{improvement.effectiveness}% More Effective</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {improvement.improvement}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Original Script</Label>
                        <div className="p-3 bg-slate-50 border rounded-md">
                          <p className="text-sm">{improvement.originalScript}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Improved Script</Label>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                          <p className="text-sm">{improvement.improvedScript}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePlayExample()}
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        Hear Difference
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleImproveScript(improvement.id)}
                      >
                        Further Improve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Generate Report */}
              <div className="flex justify-center mt-6">
                <Button onClick={handleDownloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Improvement Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgentFeedback;
