
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Target, Brain, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeProvider';

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="text-primary">TSAM</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The AI-powered Total Sales Acceleration Machine that adapts to your role and helps you achieve extraordinary results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-3"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-3"
            >
              Try Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <CardTitle className="text-lg">Role-Based Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Personalized dashboards for Developers, Managers, and Sales Reps.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-green-600 mb-4 mx-auto" />
              <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Intelligent recommendations and automation to boost performance.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
              <CardTitle className="text-lg">Goal Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Track progress and get AI coaching to hit targets faster.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
              <CardTitle className="text-lg">Sales Acceleration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Automate workflows and accelerate your entire sales process.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of sales professionals who have accelerated their results with TSAM's AI-powered platform.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-3"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-white/50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 TSAM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
