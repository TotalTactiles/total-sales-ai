
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, BarChart3, Shield, Rocket, ArrowRight, Star } from 'lucide-react';

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TSAM OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleSignIn} className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100">
            <Star className="mr-1 h-3 w-3" />
            Trusted by 10,000+ Sales Teams
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transform Your Sales Team with
            <span className="block text-blue-600">AI-Powered Intelligence</span>
          </h1>
          
          <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
            TSAM OS combines artificial intelligence, automation, and analytics to supercharge your sales operations. 
            Close more deals, faster than ever before.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • 14-day free trial • Setup in under 5 minutes
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to accelerate sales
            </h2>
            <p className="mb-16 text-lg text-gray-600">
              Powerful features designed to help your team sell smarter, not harder.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI Sales Assistant</CardTitle>
                <CardDescription className="text-base">
                  Get real-time coaching, script suggestions, and objection handling powered by advanced AI.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Smart Automation</CardTitle>
                <CardDescription className="text-base">
                  Automate follow-ups, email sequences, and lead routing while maintaining personal touch.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Performance Analytics</CardTitle>
                <CardDescription className="text-base">
                  Track performance, forecast revenue, and identify bottlenecks with comprehensive analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
                <CardDescription className="text-base">
                  Unified workspace for sales reps, managers, and teams with role-based permissions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-base">
                  Bank-level security with SSO, audit trails, and compliance-ready data protection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
                  <Rocket className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle className="text-xl">Quick Setup</CardTitle>
                <CardDescription className="text-base">
                  Get up and running in minutes with guided onboarding and smart integrations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-16 text-3xl font-bold text-gray-900">
              Trusted by sales teams at leading companies
            </h2>
            <div className="grid grid-cols-2 gap-8 opacity-60 md:grid-cols-4">
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">TechCorp</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">SalesForce</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">GrowthCo</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">ScaleUp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to transform your sales process?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of sales teams already using TSAM OS to close more deals and hit their targets.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Free 14-day trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">TSAM OS</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 TSAM OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
