
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../ui/CustomButton";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPayment } from "../../services/paymentService";
import { supabase } from "@/integrations/supabase/client";
import { isUserSubscribed } from "@/services/subscriptionService";

const PricingPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  // Check subscription status
  useState(() => {
    const checkSubscription = async () => {
      const subscribed = await isUserSubscribed();
      setIsSubscribed(subscribed);
    };
    
    checkSubscription();
  });

  const checkAuthentication = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  };

  const handleSubscribe = async () => {
    try {
      // Check if user is authenticated first
      const isAuthenticated = await checkAuthentication();
      
      if (!isAuthenticated) {
        // Redirect to auth page if not authenticated
        toast.info("Please sign in to continue with your subscription");
        navigate("/auth");
        return;
      }
      
      setIsLoading(true);
      const result = await createPayment(14); // $14 USD
      
      // Redirect user to the payment page
      window.location.href = result.payment_url;
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Sorry, we couldn't process your payment request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your interior design needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-border hover:border-primary/20 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Free Trial</h3>
              <p className="text-muted-foreground text-sm">Try once with no commitment</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-medium">$0</span>
              <span className="text-muted-foreground">/once</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>One free room analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Basic design recommendations</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Check className="h-5 w-5 mt-0.5" />
                <span>Limited to one use</span>
              </li>
            </ul>
            
            <CustomButton 
              variant="outline" 
              className="w-full"
              disabled={true}
            >
              {isSubscribed ? "Included in Subscription" : "Current Plan"}
            </CustomButton>
          </div>
          
          {/* Starter Plan */}
          <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-primary relative transform hover:scale-105 transition-all">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm py-1 px-3 rounded-full">
              Recommended
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Starter Package</h3>
              <p className="text-muted-foreground text-sm">Perfect for home owners</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-medium">$14</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited room analyses</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Detailed design recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Download design reports</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            
            <CustomButton 
              className="w-full"
              onClick={handleSubscribe}
              disabled={isLoading || isSubscribed}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isSubscribed ? (
                "Current Plan"
              ) : (
                "Subscribe Now"
              )}
            </CustomButton>
          </div>
          
          {/* Professional Plan */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-border hover:border-primary/20 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Professional</h3>
              <p className="text-muted-foreground text-sm">For design professionals</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-medium">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Everything in Starter</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Advanced design concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Professional color schemes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Commercial use license</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>White-label reports</span>
              </li>
            </ul>
            
            <CustomButton 
              variant="outline" 
              className="w-full"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              Coming Soon
            </CustomButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
