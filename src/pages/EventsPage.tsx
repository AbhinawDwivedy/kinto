import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Music, Instagram, AlignJustify as Spotify, Star, Info, Zap, Camera } from 'lucide-react';
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
  const [boostActive, setBoostActive] = useState(false);
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

  const handleBoost = () => {
    setBoostActive(true);
    // Boost animation
    if (containerRef.current) {
      const boost = document.createElement('div');
      boost.innerHTML = '🚀';
      boost.style.position = 'absolute';
      boost.style.fontSize = '40px';
      boost.style.left = '50%';
      boost.style.top = '20%';
      boost.style.transform = 'translate(-50%, -50%)';
      boost.style.pointerEvents = 'none';
      boost.style.zIndex = '1000';
      containerRef.current.appendChild(boost);
      
      AnimationController.floatingAnimation(boost);
      setTimeout(() => {
        boost.remove();
        setBoostActive(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero" ref={containerRef}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-glow border-t-transparent mx-auto mb-6"></div>
            <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary-glow animate-pulse" />
          </div>
          <h2 className="text-2xl font-playfair font-bold mb-3 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            Finding your perfect matches
          </h2>
          <p className="text-muted-foreground animate-pulse">Analyzing compatibility with nearby users...</p>
        </div>
      </div>
    );
  }

  if (!hasMoreMatches || !currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero" ref={containerRef}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="relative mb-8">
            <Heart className="h-24 w-24 mx-auto text-primary-glow animate-pulse" />
            <div className="absolute -top-2 -right-2">
              <Star className="h-8 w-8 text-yellow-500 animate-bounce" />
            </div>
          </div>
          <h2 className="text-3xl font-playfair font-bold mb-4 bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
            You're all caught up!
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            No more profiles in your area right now. Try expanding your distance or check back later for new people to discover!
          </p>
          <div className="space-y-4">
            <Button 
              onClick={refreshMatches} 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Refresh Matches
            </Button>
            <Button 
              onClick={handleBoost}
              variant="outline" 
              className="w-full border-primary-glow text-primary-glow hover:bg-primary-glow hover:text-white transition-all duration-300"
              size="lg"
            >
              <Star className="h-5 w-5 mr-2" />
              Boost My Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" ref={containerRef}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              Discover
            </h1>
            <p className="text-muted-foreground">Find your perfect match through music and vibes</p>
          </div>
          <div className="flex items-center gap-2">
            {locationError && (
              <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full">
                <Info className="h-3 w-3 mr-1" />
                Location disabled
              </div>
            )}
            {boostActive && (
              <div className="flex items-center text-primary-glow text-xs bg-primary-glow/10 px-2 py-1 rounded-full animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Boosted
              </div>
            )}
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* Add Story */}
            <div className="flex-shrink-0 cursor-pointer group">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-muted to-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary-glow transition-all duration-300">
                  <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary-glow transition-colors" />
                </div>
              </div>
              <p className="text-xs text-center mt-2 text-muted-foreground">Your Story</p>
            </div>

            {stories.map((story, index) => (
              <div
                key={story.id}
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => handleStoryClick(index)}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 p-0.5 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={story.user.photo}
                      alt={story.user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-background"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground truncate w-16 group-hover:text-foreground transition-colors">
                  {story.user.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Swipe Card */}
        <div className="relative">
          <SwipeCard
            user={currentMatch}
            onLike={handleLike}
            onPass={handlePass}
            onSuperLike={handleSuperLike}
            className="mb-8"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/25"
            onClick={handlePass}
          >
            <X className="h-7 w-7" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-yellow-500/25"
            onClick={handleSuperLike}
          >
            <Star className="h-6 w-6" />
          </Button>
          
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-pink-500/25"
            onClick={handleLike}
          >
            <Heart className="h-7 w-7" />
          </Button>
        </div>
        
        {/* Action Labels */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <X className="h-3 w-3 text-red-500" />
              Pass
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              Super Like
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-pink-500" />
              Like
            </span>
          </p>
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedUser && profile && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          currentUser={{
            name: profile.name || 'You',
            photo: profile.photos?.[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
          }}
          matchedUser={{
            name: matchedUser.name,
            photo: matchedUser.photos?.[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
          }}
          onSendMessage={() => {
            setShowMatchModal(false);
            // Navigate to chat
          }}
          onKeepSwiping={() => setShowMatchModal(false)}
        />
      )}

      {/* Story Viewer */}
      <StoryViewer
        stories={stories}
        initialIndex={selectedStoryIndex}
        isOpen={showStories}
        onClose={() => setShowStories(false)}
        onLike={(storyId) => console.log('Liked story:', storyId)}
        onMessage={(userId) => console.log('Message user:', userId)}
      />
    </div>
  );
};

export default DiscoverPage;