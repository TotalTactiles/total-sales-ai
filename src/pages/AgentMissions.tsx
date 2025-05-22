
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Trophy, Calendar, Star, ArrowRight, Check } from 'lucide-react';

const AgentMissions = () => {
  // Sample data for missions and rewards
  const dailyMissions = [
    { 
      id: 1, 
      title: 'Cold Call Champion', 
      description: 'Make 20 cold calls today', 
      progress: 15, 
      target: 20, 
      xp: 100,
      completed: false
    },
    { 
      id: 2, 
      title: 'Demo Master', 
      description: 'Schedule 3 product demos', 
      progress: 3, 
      target: 3, 
      xp: 150,
      completed: true
    },
    { 
      id: 3, 
      title: 'Discovery Star', 
      description: 'Complete 5 discovery calls', 
      progress: 2, 
      target: 5, 
      xp: 125,
      completed: false
    },
  ];
  
  const weeklyMissions = [
    { 
      id: 4, 
      title: 'Conversion King', 
      description: 'Close 5 deals this week', 
      progress: 3, 
      target: 5, 
      xp: 300,
      completed: false
    },
    { 
      id: 5, 
      title: 'Sales Navigator', 
      description: 'Generate $10,000 in pipeline value', 
      progress: 7500, 
      target: 10000, 
      xp: 400,
      completed: false
    },
  ];
  
  const rewards = [
    { 
      id: 1, 
      title: 'Premium AI Assistant', 
      description: 'Unlock advanced AI features', 
      cost: 500, 
      image: '🤖'
    },
    { 
      id: 2, 
      title: 'Time Off Reward', 
      description: '2 hrs of flex time', 
      cost: 750, 
      image: '⌚'
    },
    { 
      id: 3, 
      title: 'Team Lunch', 
      description: '$50 lunch credit for your team', 
      cost: 1000, 
      image: '🍕'
    },
    { 
      id: 4, 
      title: 'Noise Cancelling Headphones', 
      description: 'Premium audio gear', 
      cost: 2000, 
      image: '🎧'
    },
  ];
  
  const achievements = [
    { 
      id: 1, 
      title: 'First Sale', 
      description: 'Closed your first deal', 
      date: 'Apr 12, 2025', 
      icon: '🏆'
    },
    { 
      id: 2, 
      title: 'Cold Call Warrior', 
      description: 'Made 100 cold calls in a week', 
      date: 'May 3, 2025', 
      icon: '📞'
    },
    { 
      id: 3, 
      title: 'Team Player', 
      description: 'Helped 5 team members reach their goals', 
      date: 'May 15, 2025', 
      icon: '👥'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-salesBlue flex items-center">
              <Trophy className="mr-2 h-7 w-7 text-salesGreen" />
              Agent Missions
            </h1>
            <p className="text-slate-500">Complete missions to earn XP, unlock rewards, and level up</p>
          </div>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-salesBlue to-salesCyan text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm opacity-80">Current Level</div>
                    <div className="text-3xl font-bold mt-1">Level 12</div>
                    <div className="text-sm mt-1 opacity-80">3,250 / 4,000 XP</div>
                  </div>
                  <div className="bg-white/20 h-16 w-16 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8" />
                  </div>
                </div>
                <Progress value={81} className="mt-4 bg-white/30" />
                <div className="mt-2 text-xs flex justify-between">
                  <div>750 XP to Level 13</div>
                  <div>81% Complete</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-slate-500">Current Streak</div>
                    <div className="text-3xl font-bold mt-1">3 Days</div>
                    <div className="text-sm mt-1 text-slate-500">Best: 7 Days</div>
                  </div>
                  <div className="bg-amber-100 h-16 w-16 rounded-full flex items-center justify-center text-amber-500">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div 
                      key={day} 
                      className={`h-2 rounded-full ${day <= 3 ? 'bg-amber-400' : 'bg-slate-200'}`}>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs flex justify-between">
                  <div>M</div>
                  <div>T</div>
                  <div>W</div>
                  <div>T</div>
                  <div>F</div>
                  <div>S</div>
                  <div>S</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-slate-500">Available Credits</div>
                    <div className="text-3xl font-bold mt-1">250</div>
                    <div className="text-sm mt-1 text-slate-500">Lifetime: 1,450</div>
                  </div>
                  <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center text-green-500">
                    <span className="text-2xl">💎</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full border-salesCyan text-salesCyan hover:bg-salesCyan hover:text-white">
                  Visit Store
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Missions Tabs */}
          <Tabs defaultValue="daily" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily Missions</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Missions</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyMissions.map((mission) => (
                  <Card key={mission.id} className={mission.completed ? "border-green-200 bg-green-50" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg flex items-center">
                          {mission.title}
                          {mission.completed && 
                            <Badge className="ml-2 bg-green-500">
                              <Check className="h-3 w-3 mr-1" /> Complete
                            </Badge>
                          }
                        </CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-salesBlue border-blue-200">
                          {mission.xp} XP
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">
                        {mission.description}
                      </p>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">
                          {mission.progress} / {mission.target}
                        </span>
                      </div>
                      <Progress 
                        value={(mission.progress / mission.target) * 100} 
                        className={mission.completed ? "bg-green-200" : "bg-slate-200"}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={mission.completed ? "outline" : "default"} 
                        className={mission.completed ? "w-full border-green-500 text-green-600" : "w-full bg-salesBlue"}
                        disabled={mission.completed}
                      >
                        {mission.completed ? "Completed" : "Track Progress"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="weekly">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklyMissions.map((mission) => (
                  <Card key={mission.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{mission.title}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-salesBlue border-blue-200">
                          {mission.xp} XP
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-3">
                        {mission.description}
                      </p>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Progress</span>
                        <span className="font-medium">
                          {mission.id === 5 ? `$${mission.progress.toLocaleString()}` : mission.progress} / 
                          {mission.id === 5 ? `$${mission.target.toLocaleString()}` : mission.target}
                        </span>
                      </div>
                      <Progress 
                        value={(mission.progress / mission.target) * 100} 
                        className="bg-slate-200"
                      />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-salesBlue">
                        Track Progress
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                      <Calendar className="h-6 w-6 text-slate-500" />
                    </div>
                    <h3 className="font-medium mb-2">Unlock More Missions</h3>
                    <p className="text-slate-500 text-sm">Complete current missions or reach level 15 to unlock more weekly challenges</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="rewards">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{reward.image}</div>
                      <h3 className="font-medium mb-1">{reward.title}</h3>
                      <p className="text-slate-500 text-sm mb-4">{reward.description}</p>
                      <Badge className="bg-salesCyan mb-4">{reward.cost} Credits</Badge>
                      <Button 
                        variant="outline" 
                        className="w-full border-salesCyan text-salesCyan hover:bg-salesCyan hover:text-white"
                        disabled={reward.cost > 250}
                      >
                        {reward.cost <= 250 ? "Redeem" : "Not Enough Credits"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardContent className="p-6 flex items-start">
                      <div className="text-3xl mr-4">{achievement.icon}</div>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-slate-500 text-sm">{achievement.description}</p>
                        <div className="text-xs text-slate-400 mt-2 flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                          Achieved on {achievement.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                      <Trophy className="h-6 w-6 text-slate-500" />
                    </div>
                    <h3 className="font-medium mb-2">More Achievements</h3>
                    <p className="text-slate-500 text-sm">Continue your sales journey to unlock more achievements</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AgentMissions;
