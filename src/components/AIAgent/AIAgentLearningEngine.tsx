
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Users, 
  Building, 
  HeadphonesIcon,
  BookOpen,
  Award,
  CheckCircle,
  BarChartHorizontal,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  Filter,
  LineChart,
  UserCircle,
  Volume2,
  MessageCircle,
  LayoutList,
  ArrowRight,
  Star,
  Download
} from 'lucide-react';

const AIAgentLearningEngine = () => {
  const { toast } = useToast();
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [industryFilter, setIndustryFilter] = useState("construction");
  const [modelStatus, setModelStatus] = useState("learning"); // "learning", "paused"
  const [dataPrivacyLevel, setDataPrivacyLevel] = useState("anonymized");
  
  // Sample data for learning progress
  const learningProgress = {
    callsAnalyzed: 1428,
    newPatterns: 37,
    improvementRate: 8.5,
    lastUpdated: "2 hours ago"
  };
  
  // Sample data for top reps
  const topPerformers = [
    {
      name: "Alex Chen",
      position: "Senior Sales Rep",
      score: 96,
      calls: 145,
      specialties: ["Gatekeeper Handling", "Objection Responses"]
    },
    {
      name: "Jessica Kim",
      position: "Account Executive",
      score: 94,
      calls: 132,
      specialties: ["Rapport Building", "Close Techniques"]
    },
    {
      name: "Marcus Johnson",
      position: "SDR Team Lead",
      score: 91,
      calls: 156,
      specialties: ["Lead Qualification", "Value Proposition"]
    }
  ];
  
  // Sample industry learnings
  const industryLearnings = [
    {
      pattern: "Seasonal budget timing references",
      frequency: 72,
      effectiveness: 85,
      example: "I understand Q1 is typically planning time for summer projects..."
    },
    {
      pattern: "Project timeline qualification",
      frequency: 68,
      effectiveness: 79,
      example: "What's your estimated handover date for this development?"
    },
    {
      pattern: "Regulatory compliance concerns",
      frequency: 53,
      effectiveness: 91,
      example: "Many of our clients are using our solution to ensure compliance with the new regulations..."
    },
    {
      pattern: "Competitor differentiation phrases",
      frequency: 49,
      effectiveness: 77,
      example: "Unlike other solutions, ours integrates directly with your existing project management system..."
    }
  ];
  
  // Toggle learning engine
  const handleToggleLearning = (checked: boolean) => {
    setLearningEnabled(checked);
    setModelStatus(checked ? "learning" : "paused");
    toast({
      title: checked ? "Learning Engine Activated" : "Learning Engine Paused",
      description: checked 
        ? "AI is now actively analyzing calls to improve performance." 
        : "AI learning has been paused. No new calls will be analyzed.",
    });
  };
  
  // Change industry filter
  const handleIndustryChange = (value: string) => {
    setIndustryFilter(value);
    toast({
      title: "Industry Filter Updated",
      description: `AI learning is now focused on the ${value} industry.`,
    });
  };
  
  // Handle data privacy level change
  const handlePrivacyChange = (value: string) => {
    setDataPrivacyLevel(value);
    toast({
      title: "Data Privacy Level Updated",
      description: `Learning engine will use ${value} data going forward.`,
    });
  };
  
  // Handle playback of learning sample
  const handlePlaySample = (pattern: string) => {
    toast({
      title: "Playing Learning Sample",
      description: `Now playing an example of "${pattern}"`,
    });
  };
  
  // Handle exporting learning insights
  const handleExportInsights = () => {
    toast({
      title: "Insights Exported",
      description: "Learning insights have been exported to a CSV file.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Learning Engine Status */}
      <Card className={`border-l-4 ${learningEnabled ? 'border-l-green-500' : 'border-l-amber-500'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className={`h-5 w-5 ${learningEnabled ? 'text-green-500' : 'text-amber-500'}`} />
            AI Learning Engine
            <Badge className={learningEnabled ? "bg-green-500" : "bg-amber-500"}>
              {learningEnabled ? "ACTIVE" : "PAUSED"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Continuous improvement through passive listening and industry pattern recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={learningEnabled} 
                  onCheckedChange={handleToggleLearning}
                  id="learning-toggle"
                />
                <Label htmlFor="learning-toggle" className="font-medium">
                  {learningEnabled ? "Learning Engine Active" : "Learning Engine Paused"}
                </Label>
              </div>
              <p className="text-sm text-slate-500">
                {learningEnabled 
                  ? `Analyzed ${learningProgress.callsAnalyzed} calls, discovered ${learningProgress.newPatterns} new patterns` 
                  : "Enable to resume call analysis and pattern discovery"}
              </p>
            </div>
            
            <div className="flex gap-4">
              <div>
                <Label className="text-xs text-slate-500">Industry Focus</Label>
                <Select value={industryFilter} onValueChange={handleIndustryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500">Data Privacy Level</Label>
                <Select value={dataPrivacyLevel} onValueChange={handlePrivacyChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company-only">Company Only</SelectItem>
                    <SelectItem value="anonymized">Anonymized Industry</SelectItem>
                    <SelectItem value="opt-in-pool">Opt-in Pool</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Learning Stats & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Calls Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HeadphonesIcon className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{learningProgress.callsAnalyzed}</p>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Learning Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{learningProgress.newPatterns}</p>
                <p className="text-xs text-green-600">+12 vs. last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{learningProgress.improvementRate}%</p>
                <p className="text-xs text-green-600">+2.3% vs. last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Last Model Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{learningProgress.lastUpdated}</p>
                <p className="text-xs text-slate-500">Updates every 2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Reps (Learning Sources) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Top Performing Reps
            </CardTitle>
            <CardDescription>
              AI is prioritizing learning from these top sales representatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {topPerformers.map((rep, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-salesBlue rounded-full p-2 text-white">
                        <UserCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{rep.name}</h3>
                        <p className="text-sm text-slate-500">{rep.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{rep.score}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Learning Priority</span>
                      <span>{rep.calls} calls analyzed</span>
                    </div>
                    <Progress value={rep.score} className="h-1.5" />
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rep.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="bg-slate-50">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-salesBlue flex items-center gap-1"
                      onClick={() => {
                        toast({
                          title: `Learning from ${rep.name}`,
                          description: "Analyzing call patterns and speech characteristics.",
                        });
                      }}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Listen to Sample
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="px-0 text-salesBlue" onClick={() => {
              toast({
                title: "View All Top Performers",
                description: "Showing all sales reps ranked by AI learning priority.",
              });
            }}>
              View all learning sources
            </Button>
          </CardFooter>
        </Card>
        
        {/* Industry-Specific Learning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-salesBlue" />
              Industry-Specific Learning
            </CardTitle>
            <CardDescription>
              Patterns and phrases specific to the {industryFilter} industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {industryLearnings.map((learning, index) => (
                <div key={index} className="border rounded-lg">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{learning.pattern}</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        {learning.effectiveness}% Effective
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Found in {learning.frequency} analyzed calls
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-50">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-slate-500 mt-1" />
                      <p className="text-sm italic">"{learning.example}"</p>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-salesBlue"
                        onClick={() => handlePlaySample(learning.pattern)}
                      >
                        <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                        Hear Example
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="link" className="px-0 text-salesBlue">
              View all industry patterns
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportInsights}>
              <Download className="h-4 w-4 mr-2" />
              Export Insights
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Learning Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Configuration</CardTitle>
          <CardDescription>
            Configure what the AI learns from and how it applies that knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Passive Listening */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeadphonesIcon className="h-4 w-4 text-salesBlue" />
                  <h3 className="font-medium">Passive Call Listening</h3>
                </div>
                <Switch defaultChecked id="passive-listening" />
              </div>
              <p className="text-sm text-slate-500">
                AI listens to all recorded calls made by company sales reps to learn dialogue structure and identify objections
              </p>
            </div>
            
            {/* Top Rep Learning */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-salesBlue" />
                  <h3 className="font-medium">Learning from Top Performers</h3>
                </div>
                <Switch defaultChecked id="top-performers" />
              </div>
              <p className="text-sm text-slate-500">
                Prioritize learning from reps with the highest close rates and best objection handling
              </p>
            </div>
            
            {/* Industry Data */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-salesBlue" />
                  <h3 className="font-medium">Industry Anonymized Data</h3>
                </div>
                <Switch defaultChecked id="industry-data" />
              </div>
              <p className="text-sm text-slate-500">
                Use anonymized data from other companies in the {industryFilter} industry to improve performance
              </p>
            </div>
            
            {/* Continuous Feedback */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-salesBlue" />
                  <h3 className="font-medium">Continuous Feedback Loop</h3>
                </div>
                <Switch defaultChecked id="feedback-loop" />
              </div>
              <p className="text-sm text-slate-500">
                Every call automatically improves the AI's objection handling, script pacing, and tone
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Learning Configuration</Button>
        </CardFooter>
      </Card>
      
      {/* Learning Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutList className="h-5 w-5 text-salesBlue" />
            Where Learning Is Applied
          </CardTitle>
          <CardDescription>
            Areas where the AI's industry-specific learning is actively being used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-5 w-5 text-salesBlue" />
                <h3 className="font-medium">Voice Phrasing & Tone</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                Industry-specific language patterns, terminology, pacing, and voice inflection
              </p>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Active & Learning</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-salesBlue" />
                <h3 className="font-medium">Objection Rebuttals</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                Proven responses to common objections specific to the {industryFilter} industry
              </p>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Active & Learning</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-5 w-5 text-salesBlue" />
                <h3 className="font-medium">Intro/Outro Scripting</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                Opening and closing statements optimized for your industry and target personas
              </p>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Active & Learning</span>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-salesBlue" />
                <h3 className="font-medium">Qualification Questions</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                Targeted probing questions to identify qualified leads in your industry
              </p>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Active & Learning</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAgentLearningEngine;
