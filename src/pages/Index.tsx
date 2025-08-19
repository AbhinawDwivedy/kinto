import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import SolutionsSection from "@/components/SolutionsSection";
import TractionSection from "@/components/TractionSection";
import WaitlistForm from "@/components/WaitlistForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemsSection />
      <SolutionsSection />
      <TractionSection />
      
      {/* Waitlist Section */}
      <section className="py-24 px-6 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Ready to Find Your Vibe?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of music lovers who are waiting to experience 
              authentic connections. Be the first to know when we launch.
            </p>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <WaitlistForm />
          </div>
          
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-muted-foreground opacity-75">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-playfair font-bold text-primary-glow">Kinto</h3>
            <p className="text-muted-foreground mt-2">Where you find that forever person</p>
          </div>
          <p className="text-sm text-muted-foreground opacity-75">
            © 2025 Kinto. All rights reserved. Launching soon on iOS and Android.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
