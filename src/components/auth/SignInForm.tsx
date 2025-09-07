import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Music } from 'lucide-react';

interface SignInFormProps {
  onToggleMode: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Welcome back! 🎉",
        description: "You're now signed in to Kinto.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card hover-lift">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary-glow animate-pulse-glow" />
            <Music className="h-6 w-6 text-primary-glow animate-pulse-glow" />
          </div>
        </div>
        <CardTitle className="text-2xl font-playfair">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue your journey on Kinto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="transition-smooth focus:shadow-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              className="transition-smooth focus:shadow-glow"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-smooth" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary-glow hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;