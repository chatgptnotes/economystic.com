
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Brain,
  ArrowRight,
  CheckCircle,
  Database,
  Settings,
  FileText,
  Users,
  TrendingUp,
  Lock,
  Layers,
  RefreshCw,
  Code,
  Server,
  Cloud
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "100% Feature Compatibility",
      description: "Clone all major features from Tally, QuickBooks, Zoho Books with zero learning curve",
      category: "Core Features"
    },
    {
      icon: Settings,
      title: "Customization & Modular Architecture",
      description: "Fully customizable modules (GST, Payroll, Inventory, CRM) adaptable for any industry",
      category: "Customization"
    },
    {
      icon: Zap,
      title: "Lightning-Fast Data Migration",
      description: "One-click import/export from legacy systems, Excel, Tally with version control",
      category: "Migration"
    },
    {
      icon: Smartphone,
      title: "Mobile + Web Synchronization",
      description: "Native Android & iOS apps with real-time sync, works offline with PWA logic",
      category: "Mobility"
    },
    {
      icon: Shield,
      title: "Data Security & Role-Based Access",
      description: "End-to-end encryption (AES-256) with multi-user role-based access control",
      category: "Security"
    },
    {
      icon: FileText,
      title: "GST-Ready with E-Invoicing",
      description: "Built-in GST, E-way bills, E-invoicing (IRN, QR) with automatic reconciliation",
      category: "Compliance"
    },
    {
      icon: Globe,
      title: "Multi-Language & Multi-Currency",
      description: "Support for Marathi, Hindi, Gujarati, English and global currencies",
      category: "Localization"
    },
    {
      icon: TrendingUp,
      title: "Smart Dashboard & Predictive Analytics",
      description: "Real-time P&L, cash flow insights with AI-driven tax savings suggestions",
      category: "Analytics"
    },
    {
      icon: Layers,
      title: "API & ERP Integration Ready",
      description: "Integrates with CRM, HRMS, WhatsApp, payment gateways with open APIs",
      category: "Integration"
    }
  ];

  const categories = [
    {
      name: "Financial Management",
      icon: Calculator,
      features: ["Accounts Payable/Receivable", "General Ledger", "Bank Reconciliation", "Multi-Currency Support"]
    },
    {
      name: "Tax & Compliance",
      icon: FileText,
      features: ["GST Management", "E-Invoicing", "TDS/TCS", "Audit Trail"]
    },
    {
      name: "Inventory & Sales",
      icon: Database,
      features: ["Stock Management", "Purchase Orders", "Sales Tracking", "Barcode Support"]
    },
    {
      name: "Payroll & HR",
      icon: Users,
      features: ["Employee Management", "Salary Processing", "Attendance", "Statutory Compliance"]
    }
  ];

  const benefits = [
    "Seamless transition from existing accounting software",
    "Reduce software licensing costs by up to 70%",
    "Custom features for your specific industry needs",
    "24/7 dedicated support and training",
    "White-label licensing for resellers",
    "Hybrid cloud-desktop deployment options"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  economystic.ai
                </h1>
                <p className="text-sm text-slate-500 font-medium">Accounting Software Solutions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                Features
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                Pricing
              </Button>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-emerald-600 hover:to-blue-700 transition-all duration-200">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Clone Any Accounting Software in Days, Not Months
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium animate-pulse">
              <Brain className="h-4 w-4 mr-2" />
              AI Agent Integrated & Intelligent
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            AI-Powered Accounting
            <span className="block">Software Cloning Solutions</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-6 leading-relaxed">
            Build custom accounting software that perfectly replicates Tally, QuickBooks, or any financial platform.
            <span className="font-semibold text-emerald-600">100% feature compatibility</span> with
            <span className="font-semibold text-blue-600"> zero learning curve</span> for your users.
          </p>

          <div className="bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 rounded-2xl p-6 mb-8 max-w-5xl mx-auto border-2 border-emerald-200 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-purple-600 mr-2" />
                  <span className="text-lg font-bold text-slate-800">AI Agent Integration</span>
                </div>
                <p className="text-slate-700">
                  <span className="font-semibold text-purple-700">Intelligent Automation</span>,
                  <span className="font-semibold text-pink-700"> Predictive Analytics</span>, and
                  <span className="font-semibold text-blue-700"> Natural Language AI</span> - built into every clone.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-emerald-600 mr-2" />
                  <span className="text-lg font-bold text-slate-800">Complete Professional Services</span>
                </div>
                <p className="text-slate-700">
                  <span className="font-semibold text-emerald-700">CA Chartered Accountants</span>,
                  <span className="font-semibold text-blue-700"> Professional Audit Services</span>, and
                  <span className="font-semibold text-purple-700"> Expert Advisory</span> - all included.
                </p>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-slate-300">
              <p className="text-slate-600 font-medium">
                🤖 AI Intelligence + 👨‍💼 Human Expertise + 💻 Custom Software = Complete Solution
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 px-8 py-4 text-lg">
                Start Free Clone
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl border-2 border-emerald-200 hover:bg-emerald-50 px-8 py-4 text-lg">
              View Live Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>AI Agent Integrated</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-pink-500" />
              <span>Intelligent Automation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>CA Services Included</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Professional Audit Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>GST & E-Invoice Ready</span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Complete Accounting Solutions by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our modular architecture covers every aspect of financial management with industry-specific customizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg w-fit">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">{category.name}</h3>
                  <ul className="space-y-2">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-3 w-3 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Powerful Features That Set Us Apart
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Every feature designed to give you competitive advantage in the accounting software market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-12 mb-20 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Accounting Software Cloning Platform?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Transform your business with proven accounting solutions that your customers already know and love
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Key Business Benefits</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Proven Success Metrics</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-emerald-200">70%</div>
                  <div className="text-sm text-white/80">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-200">15+</div>
                  <div className="text-sm text-white/80">Languages</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-200">99.9%</div>
                  <div className="text-sm text-white/80">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-200">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Built with Modern Technology Stack
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Enterprise-grade architecture ensuring scalability, security, and performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg w-fit mx-auto mb-4">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Cloud-Native</h3>
              <p className="text-slate-600">Scalable cloud infrastructure with hybrid deployment options</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg w-fit mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Bank-Grade Security</h3>
              <p className="text-slate-600">AES-256 encryption with SOC2 compliance and audit trails</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl shadow-lg w-fit mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Real-time Sync</h3>
              <p className="text-slate-600">Instant synchronization across all devices and platforms</p>
            </div>
          </div>
        </div>

        {/* AI Agent Integration Section - Revolutionary Feature */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-lg font-bold mb-6 shadow-lg animate-pulse">
                  <Brain className="h-6 w-6 mr-3" />
                  Revolutionary AI Agent Integration
                </div>

                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
                  AI-Powered Accounting
                  <span className="block">Intelligence Built-In</span>
                </h2>

                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  Experience the future of accounting with advanced AI agents that automate complex tasks, provide intelligent insights,
                  and make smart decisions - transforming your accounting software from a tool into an intelligent business partner.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Intelligent Automation */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">Intelligent Automation</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Auto-categorize transactions with 99% accuracy</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Smart invoice processing & data extraction</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Automated reconciliation & matching</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Intelligent expense categorization</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Predictive Analytics */}
                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-pink-800 mb-4">Predictive Analytics</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>Cash flow forecasting & predictions</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>Risk assessment & fraud detection</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>Budget variance analysis & alerts</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>Market trend analysis & insights</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Natural Language Processing */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group md:col-span-2 lg:col-span-1">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <Globe className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Natural Language AI</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Voice commands & conversational queries</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Smart document understanding & processing</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Automated report generation in plain English</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Multi-language support with AI translation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Advantages Showcase */}
              <div className="bg-gradient-to-r from-slate-900 via-purple-800 to-pink-800 rounded-2xl p-8 text-white mb-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">Why AI-Integrated Accounting Changes Everything</h3>
                  <p className="text-xl opacity-90 max-w-3xl mx-auto">
                    Transform your accounting from manual data entry to intelligent business insights with AI that works 24/7
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-300 mb-2">95%</div>
                    <div className="text-lg font-semibold mb-1">Time Savings</div>
                    <div className="text-sm opacity-80">Automate repetitive tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-300 mb-2">99.9%</div>
                    <div className="text-lg font-semibold mb-1">Accuracy Rate</div>
                    <div className="text-sm opacity-80">AI-powered precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-300 mb-2">24/7</div>
                    <div className="text-lg font-semibold mb-1">AI Assistant</div>
                    <div className="text-sm opacity-80">Always available support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-300 mb-2">Real-time</div>
                    <div className="text-lg font-semibold mb-1">Insights</div>
                    <div className="text-sm opacity-80">Instant business intelligence</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-3">🤖 AI Agent Capabilities</h4>
                    <ul className="text-left space-y-2 text-sm">
                      <li>• Smart decision making & recommendations</li>
                      <li>• Continuous learning from your business patterns</li>
                      <li>• Proactive alerts & anomaly detection</li>
                      <li>• Intelligent workflow optimization</li>
                    </ul>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-3">⚡ Business Impact</h4>
                    <ul className="text-left space-y-2 text-sm">
                      <li>• Reduce manual errors by 99%</li>
                      <li>• Cut processing time by 95%</li>
                      <li>• Improve cash flow visibility</li>
                      <li>• Enable data-driven decisions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  <Brain className="h-6 w-6 mr-3" />
                  AI-Powered Accounting Software + Human Expertise = Unbeatable Combination
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CA Services Section - Prominent Feature */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 rounded-full text-lg font-bold mb-6 shadow-lg">
                  <Users className="h-6 w-6 mr-3" />
                  Complete Professional Services Included
                </div>

                <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
                  CA Chartered Accountants
                  <span className="block">& Expert Advisory Services</span>
                </h2>

                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  Beyond just software cloning - get complete professional accounting services with qualified CA chartered accountants,
                  audit services, tax advisory, and all human intervention services included in your package cost.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* CA Services */}
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">CA Chartered Accountants</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Qualified CA professionals on-demand</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Financial statement preparation</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Compliance & regulatory guidance</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Monthly financial reviews</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Audit Services */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Professional Audit Services</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Internal audit & risk assessment</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Statutory audit compliance</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Tax audit & GST audit</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Due diligence support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Advisory Services */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group md:col-span-2 lg:col-span-1">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg w-fit group-hover:scale-110 transition-transform duration-200">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">Expert Advisory</h3>
                    <ul className="space-y-3 text-slate-700">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Tax planning & optimization</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Business strategy consultation</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Financial planning & analysis</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Regulatory compliance advice</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Value Proposition */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-800 to-blue-800 rounded-2xl p-8 text-white text-center">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold mb-4">All-Inclusive Professional Package</h3>
                  <p className="text-xl opacity-90 max-w-3xl mx-auto">
                    Get both cutting-edge software AND professional human expertise - all included in one transparent cost.
                    No hidden fees, no separate charges for professional services.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-300 mb-2">100%</div>
                    <div className="text-lg font-semibold mb-1">Qualified CAs</div>
                    <div className="text-sm opacity-80">All our accountants are certified professionals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-300 mb-2">24/7</div>
                    <div className="text-lg font-semibold mb-1">Expert Support</div>
                    <div className="text-sm opacity-80">Human intervention whenever you need it</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-300 mb-2">₹0</div>
                    <div className="text-lg font-semibold mb-1">Hidden Costs</div>
                    <div className="text-sm opacity-80">All professional services included upfront</div>
                  </div>
                </div>

                <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-semibold">
                  <Zap className="h-5 w-5 mr-2" />
                  Software + Professional Services = One Complete Solution
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Powered by Latest Technology Stack
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              We use cutting-edge technologies to ensure your accounting software clone is fast, scalable, and future-proof
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Frontend Technologies */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Frontend</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Next.js 14</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>React 18</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>TypeScript</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Tailwind CSS</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backend Technologies */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Backend</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Node.js</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Express.js</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Prisma ORM</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>GraphQL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database & Storage */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Database</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Supabase</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Convex</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Redis Cache</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DevOps & Deployment */}
            <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg w-fit mx-auto mb-4">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">DevOps</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Vercel</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>Docker</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>GitHub Actions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>AWS/Azure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology Benefits */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">⚡</div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Lightning Fast</h4>
                <p className="text-sm text-slate-600">Next.js and modern architecture ensure sub-second load times</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">🔒</div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Enterprise Security</h4>
                <p className="text-sm text-slate-600">Built-in authentication, encryption, and compliance features</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">📈</div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Infinitely Scalable</h4>
                <p className="text-sm text-slate-600">Cloud-native architecture that grows with your business</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-900 via-purple-800 to-blue-800 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Clone Your First AI-Powered Accounting Software?</h2>
          <p className="text-xl mb-6 opacity-90 max-w-4xl mx-auto">
            Start building your intelligent accounting solution today. Get a fully functional AI-integrated clone in weeks, not months.
            <span className="block mt-2 font-semibold text-purple-200">
              🤖 AI Agent Integration + 👨‍💼 CA chartered accountants + 📋 Professional audit services - all included!
            </span>
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-3xl mx-auto">
            No setup fees, no hidden costs for AI features or professional services, flexible licensing, dedicated support included.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-slate-800 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold">
                Start Free Clone
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <span>✓ AI agent integration - no extra cost</span>
            <span>✓ CA services included - no extra cost</span>
            <span>✓ Professional audit support included</span>
            <span>✓ 30-day money-back guarantee</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">economystic.ai</div>
                  <div className="text-sm text-slate-400">Accounting Software Solutions</div>
                </div>
              </div>
              <p className="text-slate-400 max-w-md mb-4">
                Leading provider of accounting software cloning solutions. Build custom financial software
                that perfectly replicates industry-standard platforms.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  LinkedIn
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  GitHub
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Tally Clone</a></li>
                <li><a href="#" className="hover:text-white transition-colors">QuickBooks Clone</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">White-Label Licensing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © 2024 economystic.ai. All rights reserved. Built for the future of accounting software.
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
