import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Phone, BarChart3, Zap, Target, Brain, CheckCircle, Star, PlayCircle, Users, TrendingUp, Sparkles, MessageSquare, Calendar, Mail } from 'lucide-react';
import Logo from '@/components/Logo';
const NewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('call');
  const metrics = [{
    value: '97%',
    label: 'Faster Follow-up Rate',
    icon: TrendingUp
  }, {
    value: '22x',
    label: 'More Automation Touchpoints',
    icon: Zap
  }, {
    value: '$3.2M',
    label: 'Pipeline Growth Generated',
    icon: Target
  }, {
    value: '50K+',
    label: 'Smart Actions by AI',
    icon: Brain
  }];
  const features = [{
    icon: Bot,
    title: 'AI Smart Assistant',
    description: 'Always-on. Context-aware. Turns your reps into closers.',
    gradient: 'from-purple-500 to-purple-600'
  }, {
    icon: Phone,
    title: 'Auto Dialer + Workflow Automation',
    description: 'Call, follow-up, and close — while your AI sets the next steps.',
    gradient: 'from-blue-500 to-blue-600'
  }, {
    icon: BarChart3,
    title: 'Full Pipeline OS',
    description: 'Everything in one view. No tabs, no spreadsheets.',
    gradient: 'from-green-500 to-green-600'
  }];
  const workflowTabs = [{
    id: 'call',
    title: 'Call a Lead',
    description: 'AI takes notes and offers objection handling',
    icon: Phone,
    color: 'purple'
  }, {
    id: 'quote',
    title: 'Send a Quote',
    description: 'Auto-personalized quote based on convo history',
    icon: Mail,
    color: 'blue'
  }, {
    id: 'workflow',
    title: 'Run a Workflow',
    description: 'Launch full automation in 1 tap',
    icon: Zap,
    color: 'green'
  }];
  const comparison = [{
    old: 'Static dashboards',
    new: 'Live adaptive insights'
  }, {
    old: 'Manual logging',
    new: 'AI auto-tracking'
  }, {
    old: 'Multiple tools',
    new: 'One OS'
  }, {
    old: 'Dead follow-ups',
    new: 'AI smart nudges'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#demo" className="text-slate-600 hover:text-slate-900 transition-colors">Demo</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/auth')} className="hidden sm:flex">
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
              Get Early Access
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-purple-400/5 to-transparent"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by OpenAI, Retell & Meta
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              The Only Sales Platform{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                You'll Ever Need
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">Replace scattered tools and clunky CRMs with an AI-powered OS that automates your sales, marketing, business operations, and closes more deals - while you sleep.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-slate-50">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Visual - Mock Dashboard */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Live Dashboard</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                      <Bot className="w-8 h-8 text-purple-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">AI Assistant Active</h3>
                      <p className="text-sm text-slate-600">Handling 12 conversations</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                      <Phone className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Auto Dialer</h3>
                      <p className="text-sm text-slate-600">847 calls completed today</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                      <h3 className="font-semibold text-slate-900 mb-2">Pipeline Health</h3>
                      <p className="text-sm text-slate-600">94% conversion rate</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-float">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-float animation-delay-150">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Power Meets <span className="text-purple-600">Precision</span>
            </h2>
            <p className="text-xl text-slate-600">TSAM isn't just another CRM — it's your smartest team member.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => <div key={index} className="text-center">
                  <metric.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{metric.value}</div>
                  <div className="text-purple-200 text-sm">{metric.label}</div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Workflow Section */}
      <section id="demo" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Designed to Feel Like <span className="text-purple-600">Magic</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">TSAM doesn't just log tasks. It thinks, adapts, and guides. From first touch to close, your AI operating sysyem handles it or coaches your team to do it better.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex space-x-2 mb-8">
                  {workflowTabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                      <tab.icon className="w-4 h-4 inline mr-2" />
                      {tab.title}
                    </button>)}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  {workflowTabs.map(tab => <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'}`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 mb-6 flex items-center justify-center`}>
                        <tab.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">{tab.title}</h3>
                      <p className="text-slate-600 text-lg">{tab.description}</p>
                    </div>)}
                </div>
              </div>

              <div className="relative">
                <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold">AI Assistant</div>
                          <div className="text-purple-200 text-sm">Live on call</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm text-purple-100 mb-1">AI Insight:</div>
                        <div className="text-white">"Prospect mentioned budget concerns - suggest payment plan"</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-white text-purple-600 hover:bg-purple-50">
                          Send Quote
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/30 hover:bg-white/10 text-gray-50">
                          Schedule Follow-up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Old CRMs Slow You Down. <span className="text-purple-600">SalesOS Launches You Forward.</span>
              </h2>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-500 mb-6 text-center">Traditional CRMs</h3>
                  <div className="space-y-4">
                    {comparison.map((item, index) => <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        {item.old}
                      </div>)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-6 text-center">SalesOS</h3>
                  <div className="space-y-4">
                    {comparison.map((item, index) => <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        {item.new}
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-xl">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />)}
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-relaxed">
                "We closed 3 deals in week one just from using the AI dialer. It's like having a sales coach, admin, and teammate — all in one."
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Jamie C.</div>
                  <div className="text-slate-600">Director of Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Next Generation of Sales Teams?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">Limited beta slots remaining. Be the first to close smarter.</p>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300">
            Get Access to SalesOS
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-6 text-purple-200 text-sm">
            ✨ No credit card required • 🚀 Setup in under 2 minutes
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Logo />
              <div className="text-sm text-slate-400">© 2024 TSAM. All rights reserved.</div>
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default NewLandingPage;