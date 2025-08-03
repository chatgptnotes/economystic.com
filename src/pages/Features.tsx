import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Shield,
  Server,
  Phone,
  CheckCircle,
  Zap,
  Database,
  Users,
  TrendingUp,
  Globe,
  Lock,
  HardDrive,
  Code,
  Cloud,
  Headphones,
  FileText,
  Settings,
  ArrowRight,
  Building,
  ShieldCheck,
  Calculator
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const aiFeatures = [
    {
      icon: Brain,
      title: "Intelligent Automation",
      description: "Auto-categorize transactions with 99% accuracy, smart invoice processing, and automated reconciliation.",
      benefits: ["99% accuracy rate", "95% time savings", "Zero manual errors", "Real-time processing"]
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Cash flow forecasting, risk assessment, fraud detection, and market trend analysis.",
      benefits: ["Future cash flow visibility", "Risk mitigation", "Fraud prevention", "Business insights"]
    },
    {
      icon: Globe,
      title: "Natural Language AI",
      description: "Voice commands, conversational queries, smart document understanding, and multi-language support.",
      benefits: ["Voice interaction", "Plain English reports", "Document processing", "Multi-language support"]
    }
  ];

  const deploymentFeatures = [
    {
      icon: Server,
      title: "On-Premises Deployment",
      description: "Install on your own servers with complete data control and maximum security.",
      benefits: ["100% data sovereignty", "No internet dependency", "Custom configurations", "Complete control"]
    },
    {
      icon: Cloud,
      title: "Cloud Deployment",
      description: "Scalable cloud infrastructure with enterprise-grade security and global accessibility.",
      benefits: ["Global accessibility", "Auto-scaling", "99.9% uptime", "Managed infrastructure"]
    },
    {
      icon: HardDrive,
      title: "Hybrid Architecture",
      description: "Best of both worlds - sensitive data on-premises, non-critical data in cloud.",
      benefits: ["Flexible architecture", "Optimized costs", "Enhanced security", "Scalable solution"]
    }
  ];

  const professionalServices = [
    {
      icon: Users,
      title: "CA Chartered Accountants",
      description: "Qualified CA professionals for financial statement preparation and compliance guidance.",
      benefits: ["Certified professionals", "Financial statements", "Compliance support", "Monthly reviews"]
    },
    {
      icon: FileText,
      title: "Professional Audit Services",
      description: "Internal audit, statutory audit, tax audit, and due diligence support.",
      benefits: ["Internal audit", "Statutory compliance", "Tax audit", "Due diligence"]
    },
    {
      icon: Shield,
      title: "Expert Advisory",
      description: "Tax planning, business strategy consultation, and financial planning services.",
      benefits: ["Tax optimization", "Business strategy", "Financial planning", "Regulatory advice"]
    }
  ];

  const technicalFeatures = [
    {
      icon: Code,
      title: "Modern Technology Stack",
      description: "Built with Next.js, React, Node.js, Supabase, and Convex for maximum performance.",
      benefits: ["Latest technologies", "High performance", "Scalable architecture", "Future-proof"]
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade security with AES-256 encryption, SOC2 compliance, and audit trails.",
      benefits: ["AES-256 encryption", "SOC2 compliance", "Audit trails", "Access controls"]
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Advanced data processing, real-time sync, backup & recovery, and migration support.",
      benefits: ["Real-time sync", "Auto backup", "Data migration", "Version control"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-slate-800">economystic.ai</div>
                <div className="text-xs text-slate-500">Accounting Software Solutions</div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-orange-600" />
                <span className="font-semibold">24x7 Support:</span>
                <a href="tel:18002330000" className="text-orange-600 hover:text-orange-700 font-bold">
                  1800-233-0000
                </a>
              </div>
              <Link to="/features">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-800 font-semibold">
                  Features
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                  Pricing
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Complete Feature Overview
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6 leading-tight">
            Comprehensive Features
            <span className="block">for Modern Accounting</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Discover all the powerful features that make our AI-powered accounting software cloning solution 
            the most comprehensive and advanced platform for your business needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="rounded-xl border-2 border-purple-200 hover:bg-purple-50 px-8 py-4 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              AI-Powered Intelligence
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Revolutionary AI features that transform your accounting from manual processes to intelligent automation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg w-fit">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options Section */}
      <section className="py-16 bg-white/50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-700 bg-clip-text text-transparent mb-4">
              Flexible Deployment Options
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Deploy your accounting software exactly where you need it - on your servers, in the cloud, or hybrid architecture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {deploymentFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-pink-500 to-orange-600 rounded-2xl shadow-lg w-fit">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Professional Services Included
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Complete professional accounting services with qualified CA chartered accountants and expert advisory
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {professionalServices.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl shadow-lg w-fit">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-16 bg-white/50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Technical Excellence
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Built with cutting-edge technology stack ensuring performance, security, and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {technicalFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg w-fit">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 24x7 Support Section */}
      <section className="py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 text-white text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-bold mb-6">
                <Headphones className="h-6 w-6 mr-3" />
                Premium Support Included
              </div>

              <h2 className="text-4xl font-bold mb-4">24x7 Technical Assistance</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                Get instant help from our accounting and software technical experts round-the-clock
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Toll-Free Support</h3>
                <div className="text-3xl font-bold mb-2">1800-233-0000</div>
                <p className="opacity-90">Instant connection, no waiting time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Call Back Service</h3>
                <div className="text-xl font-bold mb-2">bachaobachao.in</div>
                <p className="opacity-90">Schedule at your convenience</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">24x7</div>
                <div className="opacity-80">Always Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">&lt;30s</div>
                <div className="opacity-80">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="opacity-80">Issue Resolution</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Free</div>
                <div className="opacity-80">No Extra Cost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-purple-800 to-pink-800">
        <div className="px-6 max-w-7xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience All These Features?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Start your free trial today and discover how our comprehensive feature set can transform your accounting operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-slate-800 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
