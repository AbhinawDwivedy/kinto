import { Music, Heart, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Heart className="h-8 w-8 text-primary-glow opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Music className="h-12 w-12 text-primary-glow opacity-40" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <Sparkles className="h-6 w-6 text-primary-glow opacity-50" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            Kinto
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Where music meets soul. Connect with others through shared vibes, 
            genuine emotions, and the soundtrack of your life.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-primary-glow">
              <Music className="h-5 w-5" />
              <span className="font-medium">AI-Powered Music Matching</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-border" />
            <div className="flex items-center space-x-2 text-primary-glow">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Emotion-First Connections</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-border" />
            <div className="flex items-center space-x-2 text-primary-glow">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Authentic Relationships</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">Coming Soon</p>
            <p className="text-sm text-muted-foreground opacity-75">
              Join thousands already on the waitlist
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;