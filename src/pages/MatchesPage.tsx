import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Music, Instagram, AlignJustify as Spotify, Star, Info } from 'lucide-react';
import { useMatching } from '@/hooks/useMatching';
import { useLocation } from '@/hooks/useLocation';
import SwipeCard from '@/components/ui/SwipeCard';
import MatchModal from '@/components/ui/MatchModal';
import StoryViewer from '@/components/ui/StoryViewer';
import { AnimationController } from '@/lib/animations';
import { useAuth } from '@/contexts/AuthContext';

const DiscoverPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { potentialMatches, currentMatch, loading, likeUser, passUser, superLikeUser, hasMoreMatches, refreshMatches } = useMatching();
  const { latitude, longitude, error: locationError } = useLocation();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [showStories, setShowStories] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock stories data
  const stories = [
    {
      id: '1',
      user: { id: '1', name: 'Emma', photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
      mediaUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      mediaType: 'image' as const,
      caption: 'Beautiful sunset today! 🌅',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      user: { id: '2', name: 'James', photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' },
      mediaUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      mediaType: 'image' as const,
      caption: 'Coffee and coding ☕',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  useEffect(() => {
    AnimationController.init();
    if (containerRef.current) {
      AnimationController.pageTransition(containerRef.current, 'in');
    }
  }, []);

  const handleLike = async () => {
    if (!currentMatch) return;
    
    try {
      await likeUser(currentMatch.id);
      
      // Simulate match check (in real app, this would come from backend)
      const isMatch = Math.random() > 0.7; // 30% chance of match
      
      if (isMatch) {
        setMatchedUser(currentMatch);
        setShowMatchModal(true);
        
        // Celebration animation
        if (containerRef.current) {
          AnimationController.matchCelebration(containerRef.current);
        }
      }
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handlePass = async () => {
    if (!currentMatch) return;
    await passUser(currentMatch.id);
  };

  const handleSuperLike = async () => {
    if (!currentMatch) return;
    await superLikeUser(currentMatch.id);
    
    // Show super like animation
    if (containerRef.current) {
      const star = document.createElement('div');
      star.innerHTML = '⭐';
      star.style.position = 'absolute';
      star.style.fontSize = '60px';
      star.style.left = '50%';
      star.style.top = '50%';
      star.style.transform = 'translate(-50%, -50%)';
      star.style.pointerEvents = 'none';
      star.style.zIndex = '1000';
      containerRef.current.appendChild(star);
      
      AnimationController.floatingAnimation(star);
      setTimeout(() => star.remove(), 2000);
    }
  };

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowStories(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" ref={containerRef}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-glow border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-playfair font-bold mb-2">Finding your perfect matches...</h2>
          <p className="text-muted-foreground">Analyzing compatibility with nearby users</p>
        </div>
      </div>
    );
  }

  if (!hasMoreMatches || !currentMatch) {
    return (
      <div className="container mx-auto px-4 py-8" ref={containerRef}>
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <h2 className="text-2xl font-playfair font-bold mb-2">No more profiles</h2>
          <p className="text-muted-foreground mb-4">Check back later for new people to discover!</p>
          <Button onClick={refreshMatches} className="bg-gradient-primary">
            Refresh Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md" ref={containerRef}>
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold mb-2">Discover</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Find your perfect match through music and vibes</p>
          {locationError && (
            <div className="flex items-center text-yellow-500 text-xs">
              <Info className="h-3 w-3 mr-1" />
              Location disabled
            </div>
          )}
        </div>
      </div>

      {/* Stories Section */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(index)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5">
                  <img
                    src={story.user.photo}
                    alt={story.user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-background"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground truncate w-16">
                {story.user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

            <span>{currentMatch.location?.city || 'Location not set'}</span>
          </div>

          <p className="text-sm mb-4 leading-relaxed">{currentMatch.bio}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Music className="h-4 w-4" />
                Music Taste
              </h4>
              <div className="flex flex-wrap gap-1">
                {currentMatch.spotify?.topGenres?.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                )) || (
                  <span className="text-xs text-muted-foreground">No music data</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {currentMatch.interests.slice(0, 5).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {currentMatch.spotify && (
                <div className="flex items-center gap-1">
                  <Spotify className="h-4 w-4 text-green-500" />
                  <span>Spotify</span>
                </div>
              )}
              {currentMatch.instagram && (
                <div className="flex items-center gap-1">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Instagram</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handlePass}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-12 h-12 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
          onClick={handleSuperLike}
        >
          <Star className="h-4 w-4" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-primary hover:shadow-glow"
          onClick={handleLike}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Tap ❌ to pass • ⭐ to super like • ❤️ to like
        </p>
      </div>
    </div>
  );
};

export default DiscoverPage;