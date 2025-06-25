import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  X,
  Star,
  Phone,
  ArrowRight,
  Calculator,
  Zap,
  Crown,
  Building,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Starter",
      icon: Zap,
      price: "₹99,000",
      period: "one-time",
      description: "Perfect for small businesses and startups",
      color: "emerald",
      features: [
        "Basic accounting software clone",
        "Standard AI automation features",
        "Cloud deployment only",
        "Basic CA consultation (5 hours/month)",
        "Email support (24-48 hours)",
        "Standard security features",
        "Up to 10 users",
        "Basic reporting & analytics",
        "GST & E-Invoice ready",
        "3 months free support"
      ],
      notIncluded: [
        "On-premises deployment",
        "Advanced AI features",
        "24x7 phone support",
        "Dedicated CA services",
        "Custom integrations"
      ]
    },
    {
      name: "Professional",
      icon: Crown,
      price: "₹2,99,000",
      period: "one-time",
      description: "Most popular for growing businesses",
      color: "blue",
      popular: true,
      features: [
        "Complete accounting software clone",
        "Full AI agent integration",
        "Cloud + On-premises deployment",
        "Dedicated CA services (20 hours/month)",
        "24x7 phone support (1800-233-0000)",
        "Advanced security & compliance",
        "Up to 50 users",
        "Advanced reporting & analytics",
        "Custom workflows & automation",
        "12 months free support",
        "Professional audit services",
        "Tax planning & advisory",
        "Data migration assistance",
        "Training & onboarding"
      ],
      notIncluded: [
        "White-label licensing",
        "Source code access"
      ]
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "₹7,99,000",
      period: "one-time",
      description: "For large organizations and enterprises",
      color: "purple",
      features: [
        "Enterprise-grade software clone",
        "Advanced AI with custom models",
        "Full on-premises deployment",
        "Dedicated CA team (unlimited hours)",
        "Priority 24x7 support with SLA",
        "Enterprise security & compliance",
        "Unlimited users",
        "Custom reporting & dashboards",
        "Advanced integrations & APIs",
        "24 months free support",
        "Complete audit services",
        "Strategic financial advisory",
        "White-label licensing",
        "Source code access",
        "Dedicated project manager",
        "Custom feature development"
      ],
      notIncluded: []
    }
  ];

  const addOns = [
    {
      name: "Additional CA Hours",
      price: "₹2,500/hour",
      description: "Extra CA consultation beyond plan limits"
    },
    {
      name: "Custom Integration",
      price: "₹50,000",
      description: "Integration with third-party systems"
    },
    {
      name: "Advanced Training",
      price: "₹25,000",
      description: "Comprehensive team training program"
    },
    {
      name: "Priority Support",
      price: "₹1,00,000/year",
      description: "Dedicated support with 15-minute SLA"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-slate-800">economystic.ai</div>
                <div className="text-xs text-slate-500">Accounting Software Solutions</div>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">24x7 Support:</span>
                <a href="tel:18002330000" className="text-emerald-600 hover:text-emerald-700 font-bold">
                  1800-233-0000
                </a>
              </div>
              <Link to="/features">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                  Features
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Pricing
                </Button>
              </Link>
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
      <section className="py-20">
        <div className="px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Transparent Pricing, No Hidden Costs
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6 leading-tight">
            Simple, Transparent
            <span className="block">Pricing Plans</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Choose the perfect plan for your business. All plans include AI integration, professional CA services, 
            and 24x7 support. No recurring fees, no hidden costs.
          </p>

          <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl p-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
              <span className="text-lg font-bold text-slate-800">All Plans Include</span>
            </div>
            <p className="text-slate-700">
              🤖 AI Agent Integration • 🏢 Deployment Options • 👨‍💼 CA Services • 📞 24x7 Support • 🔒 Enterprise Security
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-white/70 backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-blue-300 ring-4 ring-blue-100' 
                    : plan.color === 'emerald' 
                      ? 'border-emerald-200' 
                      : plan.color === 'purple' 
                        ? 'border-purple-200' 
                        : 'border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className={`p-4 bg-gradient-to-r ${
                      plan.color === 'emerald' 
                        ? 'from-emerald-500 to-emerald-600' 
                        : plan.color === 'purple' 
                          ? 'from-purple-500 to-purple-600' 
                          : 'from-blue-500 to-blue-600'
                    } rounded-2xl shadow-lg w-fit mx-auto mb-4`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-slate-800">{plan.price}</div>
                      <div className="text-slate-500">{plan.period}</div>
                    </div>
                    
                    <Link to="/login">
                      <Button 
                        className={`w-full bg-gradient-to-r ${
                          plan.color === 'emerald' 
                            ? 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                            : plan.color === 'purple' 
                              ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                              : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                        } text-white rounded-xl shadow-lg transition-all duration-200`}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Included Features:</h4>
                      <div className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              plan.color === 'emerald' 
                                ? 'text-emerald-500' 
                                : plan.color === 'purple' 
                                  ? 'text-purple-500' 
                                  : 'text-blue-500'
                            }`} />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Not Included:</h4>
                        <div className="space-y-2">
                          {plan.notIncluded.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <X className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
                              <span className="text-sm text-slate-400">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-white/50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Optional Add-ons
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Enhance your package with additional services and features as needed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {addOns.map((addon, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-3">{addon.price}</div>
                  <p className="text-sm text-slate-600">{addon.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Compare all features across different plans to choose what's best for your business
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-800">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-800">Professional</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">AI Agent Integration</td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-600">Basic</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-blue-600">Full</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-purple-600">Advanced</span></td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">Deployment Options</td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-600">Cloud Only</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-blue-600">Cloud + On-Premises</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-purple-600">Full On-Premises</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">CA Services</td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-600">5 hrs/month</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-blue-600">20 hrs/month</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-purple-600">Unlimited</span></td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">Support</td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-600">Email</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-blue-600">24x7 Phone</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-purple-600">Priority SLA</span></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">User Limit</td>
                    <td className="px-6 py-4 text-center"><span className="text-emerald-600">10 Users</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-blue-600">50 Users</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-purple-600">Unlimited</span></td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">White-label Licensing</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-slate-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-slate-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-4 w-4 text-purple-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">Source Code Access</td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-slate-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-4 w-4 text-slate-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-4 w-4 text-purple-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Are there any recurring fees?</h3>
                <p className="text-slate-600">No, all our plans are one-time payments. You own the software forever with no recurring licensing fees.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">What's included in CA services?</h3>
                <p className="text-slate-600">Qualified CA professionals provide financial statement preparation, compliance guidance, tax planning, and audit services based on your plan.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Can I upgrade my plan later?</h3>
                <p className="text-slate-600">Yes, you can upgrade anytime by paying the difference. We'll migrate all your data and settings seamlessly.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Is on-premises deployment secure?</h3>
                <p className="text-slate-600">Absolutely. Your data stays on your servers with enterprise-grade security, encryption, and compliance features built-in.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">How long does implementation take?</h3>
                <p className="text-slate-600">Typically 2-4 weeks for cloud deployment and 4-8 weeks for on-premises, including data migration and training.</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-3">What if I need custom features?</h3>
                <p className="text-slate-600">Enterprise plan includes custom feature development. For other plans, we offer custom development as an add-on service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800">
        <div className="px-6 max-w-7xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Choose your plan and start building your AI-powered accounting software today.
            All plans include 24x7 support and professional CA services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-slate-800 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold">
                Start Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:18002330000">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg">
                <Phone className="mr-2 h-5 w-5" />
                Call: 1800-233-0000
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
            <span>✓ No setup fees</span>
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Free data migration</span>
            <span>✓ Professional training included</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
