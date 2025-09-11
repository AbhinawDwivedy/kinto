import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Music, Instagram, Star, Info, Zap, Camera } from 'lucide-react';
import SwipeCard from '@/components/ui/SwipeCard';
import MatchModal from '@/components/ui/MatchModal';
import { mockUsers } from '@/data/mockData';

const DiscoverPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [boostActive, setBoostActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMatch = mockUsers[currentIndex];

  const handleLike = async () => {
    if (!currentMatch) return;
    
    // Simulate match check (30% chance of match for demo)
    const isMatch = Math.random() > 0.7;
    
    if (isMatch) {
      setMatchedUser(currentMatch);
      setShowMatchModal(true);
    }
    
    // Move to next user
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = async () => {
    if (!currentMatch) return;
    setCurrentIndex(prev => prev + 1);
  };

  const handleSuperLike = async () => {
    if (!currentMatch) return;
    // Super like always creates a match for demo
    setMatchedUser(currentMatch);
    setShowMatchModal(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handleBoost = () => {
    setBoostActive(true);
    setTimeout(() => setBoostActive(false), 3000);
  };

  if (currentIndex >= mockUsers.length) {
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
              onClick={() => setCurrentIndex(0)} 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Over
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

            {mockUsers.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className="flex-shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 p-0.5 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={user.photos[0]}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-2 border-background"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground truncate w-16 group-hover:text-foreground transition-colors">
                  {user.name}
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
      {showMatchModal && matchedUser && (
        <MatchModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          currentUser={{
            name: 'You',
            photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
          }}
          matchedUser={{
            name: matchedUser.name,
            photo: matchedUser.photos[0]
          }}
          onSendMessage={() => {
            setShowMatchModal(false);
            // Navigate to chat would go here
          }}
          onKeepSwiping={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
};

export default DiscoverPage;