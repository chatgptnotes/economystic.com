
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, Users, MessageSquare, Phone, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-time Analytics",
      description: "Monitor your business operations with live data and insights"
    },
    {
      icon: Users,
      title: "Data Management",
      description: "Comprehensive data management with advanced tracking capabilities"
    },
    {
      icon: Phone,
      title: "Communication Tracking",
      description: "Streamlined communication tracking and management system"
    },
    {
      icon: MessageSquare,
      title: "Platform Integration",
      description: "Track and manage communications across multiple platforms seamlessly"
    },
    {
      icon: BarChart3,
      title: "Advanced Reports",
      description: "Generate detailed reports and analytics for better decision making"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance standards"
    }
  ];

  const benefits = [
    "Streamline business operations",
    "Improve decision making",
    "Reduce administrative overhead",
    "Data-driven insights",
    "24/7 monitoring capabilities"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  economystic.ai
                </h1>
                <p className="text-sm text-slate-500 font-medium">Analytics Dashboard</p>
              </div>
            </div>
            
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Business Analytics
            <span className="block">Reimagined</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform your business operations with our comprehensive analytics platform. 
            Monitor, analyze, and optimize every aspect of your organization's performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl border-2 border-blue-200 hover:bg-blue-50 px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg w-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join hundreds of businesses who trust our platform to optimize their operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Trusted by Business Leaders</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-slate-600">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">SOC2</div>
                  <div className="text-sm text-slate-600">Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the future of business analytics today. No setup fees, no long-term contracts.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold">economystic.ai</div>
                <div className="text-sm text-slate-400">Analytics Dashboard</div>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              © 2024 economystic.ai. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
