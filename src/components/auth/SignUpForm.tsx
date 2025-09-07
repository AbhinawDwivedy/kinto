import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Music } from 'lucide-react';

interface SignUpFormProps {
  onToggleMode: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    bio: '',
    lookingFor: 'both' as 'dating' | 'friends' | 'both',
    interestedIn: [] as string[],
    interests: [] as string[],
  });
  const { signUp } = useAuth();
  const { toast } = useToast();

  const commonInterests = [
    'Music', 'Movies', 'Travel', 'Food', 'Sports', 'Art', 'Books', 'Gaming',
    'Photography', 'Dancing', 'Hiking', 'Cooking', 'Fitness', 'Technology',
    'Fashion', 'Animals', 'Nature', 'Comedy', 'Adventure', 'Meditation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as any,
        bio: formData.bio,
        interests: formData.interests,
        preferences: {
          ageRange: [18, 50],
          maxDistance: 50,
          interestedIn: formData.interestedIn,
          lookingFor: formData.lookingFor,
        },
        photos: [],
        location: {
          latitude: 0,
          longitude: 0,
          city: '',
          country: '',
        },
        isVerified: false,
        lastActive: new Date().toISOString(),
      });

      toast({
        title: "Welcome to Kinto! 🎉",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleInterestedIn = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(gender)
        ? prev.interestedIn.filter(g => g !== gender)
        : [...prev.interestedIn, gender]
    }));
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
        <CardTitle className="text-2xl font-playfair">Join Kinto</CardTitle>
        <CardDescription>
          Step {step} of 3 - Create your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    required
                    className="transition-smooth focus:shadow-glow"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="transition-smooth focus:shadow-glow">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="transition-smooth focus:shadow-glow"
                />
              </div>

              <div className="space-y-2">
                <Label>Looking For</Label>
                <Select value={formData.lookingFor} onValueChange={(value: any) => setFormData(prev => ({ ...prev, lookingFor: value }))}>
                  <SelectTrigger className="transition-smooth focus:shadow-glow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dating">Dating</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>Interested In</Label>
                <div className="flex flex-wrap gap-2">
                  {['male', 'female', 'non-binary', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => toggleInterestedIn(gender)}
                      className={`px-3 py-1 rounded-full text-sm transition-smooth ${
                        formData.interestedIn.includes(gender)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-primary/20'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {commonInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-sm transition-smooth ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-primary/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-smooth" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : step < 3 ? (
              "Continue"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-primary-glow hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignUpForm;