
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Brain, 
  Zap, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star,
  BarChart3,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Sales",
      company: "TechFlow Inc",
      quote: "TSAM transformed our sales process completely. Our team's performance increased 40% in just 3 months with AI-powered insights.",
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Sales Director",
      company: "Growth Dynamics",
      quote: "The AI coaching feature is incredible. It's like having a sales expert analyzing every interaction and providing real-time guidance.",
      avatar: "MR"
    },
    {
      name: "Lisa Johnson",
      role: "CRO",
      company: "ScaleUp Solutions",
      quote: "Finally, a platform that understands sales teams. The manager insights and team analytics have revolutionized how we operate.",
      avatar: "LJ"
    }
  ];

  const partners = [
    "Salesforce", "HubSpot", "Pipedrive", "Zoom", "Slack", "Microsoft"
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Sales Coaching",
      description: "Real-time AI analysis of calls, emails, and interactions with personalized coaching recommendations."
    },
    {
      icon: Users,
      title: "Team Performance Analytics",
      description: "Comprehensive dashboards for managers to track team performance, identify bottlenecks, and optimize workflows."
    },
    {
      icon: Target,
      title: "Lead Intelligence System",
      description: "Advanced lead scoring and prioritization with AI-driven insights to focus on highest-converting prospects."
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Smart automation for follow-ups, scheduling, and task management to maximize productivity."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TSAM</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Product</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900 transition-colors">Resources</a>
              <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
              <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
            </nav>
            
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Sales Acceleration
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Driven Sales Teams with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Human-Level Precision
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower your business with AI-driven teams that execute tasks with human-level precision, efficiency, and reliability. Transform every sales interaction into a revenue opportunity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              >
                Try for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 hover:bg-white/50 backdrop-blur-sm"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Dashboard Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sales Dashboard Card */}
          <div className="absolute top-20 left-10 transform rotate-12 animate-float">
            <Card className="w-80 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">$1.2M</span>
                    <Badge className="bg-green-100 text-green-700">+18%</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Card */}
          <div className="absolute top-32 right-10 transform -rotate-6 animate-float-delayed">
            <Card className="w-72 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700">
                  "Best time to call TechCorp: 2-4 PM EST based on historical data"
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">High confidence</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Scoring Card */}
          <div className="absolute bottom-40 left-20 transform rotate-6 animate-float">
            <Card className="w-64 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Hot Lead</div>
                    <div className="text-sm text-gray-600">Acme Corp</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">89%</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What sales teams are saying</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of sales professionals who have transformed their results with TSAM
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-lg font-medium text-gray-600 mb-8">Our trusted partners</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {partners.map((partner, index) => (
                <div key={index} className="text-2xl font-bold text-gray-400">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why sales teams love our AI-Powered dashboard
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to supercharge your sales process and close more deals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Active Leads</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">1,247</div>
                    <div className="text-xs text-green-600">+12% this week</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">28%</div>
                    <div className="text-xs text-blue-600">Above target</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">$284K</div>
                    <div className="text-xs text-purple-600">This month</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Supercharge your sales with AI today!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of sales teams who have transformed their results with TSAM's AI-powered platform
          </p>
          
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-12 relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">40%</div>
                  <div className="text-sm opacity-90">Increase in Sales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">3x</div>
                  <div className="text-sm opacity-90">Faster Onboarding</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">99%</div>
                  <div className="text-sm opacity-90">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold">TSAM</span>
          </div>
          <p className="text-gray-400">&copy; 2024 TSAM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Add floating animations
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(12deg); }
  50% { transform: translateY(-20px) rotate(12deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(-6deg); }
  50% { transform: translateY(-15px) rotate(-6deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 6s ease-in-out infinite 2s;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default NewLandingPage;
