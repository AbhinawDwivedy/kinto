import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Music, Heart, Sparkles } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-hero">
      {/* Background elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Heart className="h-8 w-8 text-primary-glow opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Music className="h-12 w-12 text-primary-glow opacity-40" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <Sparkles className="h-6 w-6 text-primary-glow opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            Kinto
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Where you find that forever person through music, vibes, and authentic connections.
          </p>
        </div>

        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <SignInForm onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;