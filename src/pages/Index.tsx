
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckIcon } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  
  // Pricing plan data
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic resume matching",
      features: [
        "3 resume matches per month",
        "Basic AI suggestions",
        "Single resume storage",
        "Standard job description storage"
      ],
      highlighted: false,
      buttonText: "Get Started",
      buttonVariant: "outline"
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "Advanced matching for job seekers",
      features: [
        "Unlimited resume matches",
        "Advanced AI suggestions",
        "Multiple resume storage",
        "Job description analysis",
        "Email notifications",
        "Priority support"
      ],
      highlighted: true,
      buttonText: "Subscribe Now",
      buttonVariant: "default"
    },
    {
      name: "Enterprise",
      price: "$49.99",
      period: "per month",
      description: "For hiring teams & recruiters",
      features: [
        "All Pro features",
        "Team collaboration",
        "Bulk candidate matching",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              MatchRight
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get Hired Faster with Smart Resume Matching
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/register">
                    <Button size="lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Sign In <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-16 sm:mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M9 7v10"/>
                      <path d="M15 7v10"/>
                      <path d="m3 11 18-4"/>
                      <path d="m3 17 18-4"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Resume Input</h3>
                </div>
                <p className="mt-3 text-gray-500">
                  Paste your resume into a text area for easy analysis and matching.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 1.2.4"/>
                      <path d="M2 10h20"/>
                      <path d="M7 15h.01"/>
                      <path d="M11 15h2"/>
                      <path d="m16 5-4-4-4 4"/>
                      <path d="M12 7V1"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
                </div>
                <p className="mt-3 text-gray-500">
                  Input job descriptions to match against your resume and get personalized feedback.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="m12 14 4-4"/>
                      <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
                </div>
                <p className="mt-3 text-gray-500">
                  Get smart suggestions powered by Gemini AI to improve your resume and increase your chances.
                </p>
              </div>
            </div>
          </div>
          
          {/* Pricing section */}
          <div className="mt-24 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Choose the plan that fits your job search or hiring needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`rounded-xl border ${
                    plan.highlighted 
                      ? "border-primary shadow-lg scale-105" 
                      : "border-gray-200"
                  } bg-white p-8 shadow-sm transition`}
                >
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                      {plan.period && <span className="ml-1 text-sm text-gray-500">{plan.period}</span>}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  </div>
                  
                  <ul className="mt-6 mb-8 space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.buttonVariant as any} 
                    className="w-full"
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
