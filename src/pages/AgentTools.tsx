
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingBag, 
  Zap, 
  Star, 
  Lock, 
  MessageSquare, 
  ArrowRight,
  Headphones,
  Sparkles,
  BarChart
} from 'lucide-react';

const AgentTools = () => {
  const [credits, setCredits] = useState(250);
  
  // Sample data for store items
  const aiTools = [
    { 
      id: 1, 
      title: "Advanced Objection Handler", 
      description: "AI assistant that crafts personalized responses to common objections", 
      price: 150, 
      category: "AI Assistant",
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      popular: true,
      owned: false
    },
    { 
      id: 2, 
      title: "Sentiment Analyzer Pro", 
      description: "Real-time sentiment analysis during calls to adjust your approach", 
      price: 300, 
      category: "Call Enhancement",
      icon: <BarChart className="h-6 w-6 text-blue-500" />,
      popular: false,
      owned: true
    },
    { 
      id: 3, 
      title: "Cold Email Generator", 
      description: "Create personalized cold emails based on prospect data", 
      price: 200, 
      category: "Outreach",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      popular: true,
      owned: false
    },
    { 
      id: 4, 
      title: "Call Summarizer", 
      description: "AI that creates detailed call notes and action items automatically", 
      price: 175, 
      category: "AI Assistant",
      icon: <Headphones className="h-6 w-6 text-amber-500" />,
      popular: false,
      owned: false
    },
  ];
  
  const premiumTools = [
    { 
      id: 5, 
      title: "Competitor Intelligence", 
      description: "Up-to-date insights on competitor offerings and pricing", 
      price: 400, 
      category: "Research",
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      popular: true,
      owned: false
    },
    { 
      id: 6, 
      title: "Voice Coach Pro", 
      description: "Real-time coaching on tone, pace, and persuasiveness during calls", 
      price: 450, 
      category: "Call Enhancement",
      icon: <Headphones className="h-6 w-6 text-purple-500" />,
      popular: true,
      owned: false
    },
  ];
  
  const gameBoosts = [
    { 
      id: 7, 
      title: "XP Booster", 
      description: "Earn 2x XP for all activities for 24 hours", 
      price: 100, 
      duration: "24 hours",
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      owned: false
    },
    { 
      id: 8, 
      title: "Mission Refresh", 
      description: "Get new daily missions without waiting", 
      price: 50, 
      duration: "Immediate",
      icon: <Star className="h-6 w-6 text-green-500" />,
      owned: false
    },
  ];
  
  const handlePurchase = (price: number) => {
    if (credits >= price) {
      setCredits(prev => prev - price);
      // In a real app, we would update the owned status here
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-salesBlue flex items-center">
                <ShoppingBag className="mr-2 h-7 w-7" />
                Agent Tools Store
              </h1>
              <p className="text-slate-500">Unlock powerful tools to boost your sales performance</p>
            </div>
            
            <div className="bg-salesBlue text-white px-4 py-2 rounded-md flex items-center">
              <div className="mr-3">
                <div className="text-xs opacity-80">Available Credits</div>
                <div className="text-xl font-bold">{credits}</div>
              </div>
              <Button size="sm" className="bg-white text-salesBlue hover:bg-slate-200">
                Get More
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="ai" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="ai">AI Tools</TabsTrigger>
              <TabsTrigger value="premium">Premium Tools</TabsTrigger>
              <TabsTrigger value="boosts">Game Boosts</TabsTrigger>
              <TabsTrigger value="owned">My Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiTools.map((tool) => (
                  <Card key={tool.id} className={tool.owned ? "border-green-200" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                          {tool.icon}
                        </div>
                        <div>
                          {tool.popular && (
                            <Badge className="bg-salesCyan">Popular</Badge>
                          )}
                          {tool.owned && (
                            <Badge className="bg-green-500">Owned</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-2">{tool.category}</Badge>
                      <p className="text-slate-600 text-sm">{tool.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-bold">{tool.price}</span>
                        <span className="text-slate-600 text-sm ml-1">credits</span>
                      </div>
                      {tool.owned ? (
                        <Button variant="outline" className="border-green-500 text-green-600">
                          Launch
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handlePurchase(tool.price)}
                          disabled={credits < tool.price}
                        >
                          {credits >= tool.price ? 'Purchase' : 'Not Enough Credits'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {premiumTools.map((tool) => (
                  <Card key={tool.id} className="border-amber-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                          {tool.icon}
                        </div>
                        <div>
                          {tool.popular && (
                            <Badge className="bg-amber-500">Premium</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="mt-2">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-2 border-amber-200">{tool.category}</Badge>
                      <p className="text-slate-600 text-sm">{tool.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-bold">{tool.price}</span>
                        <span className="text-slate-600 text-sm ml-1">credits</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-amber-500 text-amber-600"
                        onClick={() => handlePurchase(tool.price)}
                        disabled={credits < tool.price}
                      >
                        {credits >= tool.price ? 'Purchase Premium' : 'Not Enough Credits'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="mb-4 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Lock className="h-6 w-6 text-slate-400" />
                    </div>
                    <CardTitle className="text-slate-500">More Premium Tools</CardTitle>
                    <p className="text-slate-400 text-sm mt-2">Unlock premium tier to access additional tools</p>
                    <Button className="mt-4 bg-gradient-to-r from-amber-400 to-amber-600">
                      Upgrade Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="boosts" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gameBoosts.map((boost) => (
                  <Card key={boost.id}>
                    <CardHeader className="pb-2">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        {boost.icon}
                      </div>
                      <CardTitle className="mt-2">{boost.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="mb-2">{boost.duration}</Badge>
                      <p className="text-slate-600 text-sm">{boost.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-bold">{boost.price}</span>
                        <span className="text-slate-600 text-sm ml-1">credits</span>
                      </div>
                      <Button 
                        onClick={() => handlePurchase(boost.price)}
                        disabled={credits < boost.price}
                        variant="outline"
                        className="border-salesCyan text-salesCyan hover:bg-salesCyan hover:text-white"
                      >
                        Activate Boost
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Active Boosts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium flex items-center">
                          <Zap className="h-4 w-4 text-amber-500 mr-2" />
                          XP Booster
                        </div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-500 flex justify-between">
                          <span>2x XP for all activities</span>
                          <span>Expires in 14:25:36</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="owned" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Show only owned tools */}
                <Card className="border-green-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <BarChart className="h-6 w-6 text-blue-500" />
                      </div>
                      <Badge className="bg-green-500">Owned</Badge>
                    </div>
                    <CardTitle className="mt-2">Sentiment Analyzer Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mb-2">Call Enhancement</Badge>
                    <p className="text-slate-600 text-sm">Real-time sentiment analysis during calls to adjust your approach</p>
                    
                    <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                      <div className="text-sm font-medium mb-1">Usage Statistics</div>
                      <div className="text-xs text-slate-500 flex justify-between mb-1">
                        <span>Used in 28 calls</span>
                        <span>Last used: Today</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Helped improve sentiment in 78% of negatively-trending calls
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Launch Tool
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 flex flex-col justify-center items-center p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="font-medium text-slate-600 mb-1">Your Tools Library</h3>
                  <p className="text-slate-400 text-sm mb-4">Purchase tools to build your personal sales toolkit</p>
                  <Button variant="outline" className="flex items-center">
                    Browse Tool Store
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AgentTools;
