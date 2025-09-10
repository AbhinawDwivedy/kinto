import React, { useRef, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MapPin, Music, Instagram, Verified } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimationController } from '@/lib/animations';

interface SwipeCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    bio?: string;
    distance?: number;
    compatibilityScore?: number;
    interests: string[];
    isVerified?: boolean;
    spotify?: any;
    instagram?: any;
  };
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
  className?: string;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  onLike,
  onPass,
  onSuperLike,
  className
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      AnimationController.revealOnScroll(cardRef.current);
    }
  }, []);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!cardRef.current) return;
      setIsDragging(true);
      
      const { deltaX, deltaY } = eventData;
      const rotation = deltaX * 0.1;
      const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 300);
      
      gsap.set(cardRef.current, {
        x: deltaX,
        y: deltaY * 0.5,
        rotation,
        opacity
      });

      // Show like/dislike indicators
      const likeIndicator = cardRef.current.querySelector('.like-indicator');
      const dislikeIndicator = cardRef.current.querySelector('.dislike-indicator');
      
      if (deltaX > 50 && likeIndicator) {
        gsap.to(likeIndicator, { opacity: Math.min(1, deltaX / 150), duration: 0.1 });
      } else if (deltaX < -50 && dislikeIndicator) {
        gsap.to(dislikeIndicator, { opacity: Math.min(1, Math.abs(deltaX) / 150), duration: 0.1 });
      }
    },
    onSwipedLeft: () => {
      if (cardRef.current) {
        AnimationController.swipeCard(cardRef.current, 'left', onPass);
      }
      setIsDragging(false);
    },
    onSwipedRight: () => {
      if (cardRef.current) {
        AnimationController.swipeCard(cardRef.current, 'right', onLike);
      }
      setIsDragging(false);
    },
    onSwiped: () => {
      if (cardRef.current && isDragging) {
        gsap.to(cardRef.current, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Hide indicators
        const indicators = cardRef.current.querySelectorAll('.like-indicator, .dislike-indicator');
        gsap.to(indicators, { opacity: 0, duration: 0.2 });
      }
      setIsDragging(false);
    },
    trackMouse: true,
    trackTouch: true,
  });

  const handlePhotoClick = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const cardWidth = rect.width;
    
    if (clickX > cardWidth / 2) {
      // Right side - next photo
      setCurrentPhotoIndex((prev) => 
        prev < user.photos.length - 1 ? prev + 1 : prev
      );
    } else {
      // Left side - previous photo
      setCurrentPhotoIndex((prev) => prev > 0 ? prev - 1 : prev);
    }
  };

  const handleLike = () => {
    if (cardRef.current) {
      AnimationController.likeAnimation(cardRef.current);
      setTimeout(() => {
        AnimationController.swipeCard(cardRef.current!, 'right', onLike);
      }, 200);
    }
  };

  const handlePass = () => {
    if (cardRef.current) {
      AnimationController.swipeCard(cardRef.current, 'left', onPass);
    }
  };

  const handleSuperLike = () => {
    if (cardRef.current) {
      AnimationController.likeAnimation(cardRef.current);
      setTimeout(onSuperLike, 200);
    }
  };

  return (
    <div className={cn("relative w-full max-w-sm mx-auto", className)}>
      <Card
        ref={cardRef}
        {...handlers}
        className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-grab active:cursor-grabbing bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50"
        style={{ touchAction: 'none' }}
      >
        {/* Like/Dislike Indicators */}
        <div className="like-indicator absolute top-8 right-8 z-20 opacity-0 pointer-events-none">
          <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12">
            LIKE
          </div>
        </div>
        <div className="dislike-indicator absolute top-8 left-8 z-20 opacity-0 pointer-events-none">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12">
            NOPE
          </div>
        </div>

        {/* Photo Section */}
        <div className="relative h-96 overflow-hidden" onClick={handlePhotoClick}>
          <img
            src={user.photos[currentPhotoIndex] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'}
            alt={user.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* Photo Indicators */}
          {user.photos.length > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {user.photos.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all duration-300",
                    index === currentPhotoIndex ? "bg-white" : "bg-white/30"
                  )}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Info */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {user.compatibilityScore && (
              <Badge className="bg-primary-glow text-white font-bold">
                {user.compatibilityScore}% Match
              </Badge>
            )}
            {user.distance && (
              <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                {Math.round(user.distance)}km away
              </Badge>
            )}
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold font-playfair">
                {user.name}
              </h3>
              <span className="text-xl">{user.age}</span>
              {user.isVerified && (
                <Verified className="h-5 w-5 text-blue-400 fill-current" />
              )}
            </div>
            
            {user.bio && (
              <p className="text-sm opacity-90 line-clamp-2 mb-2">
                {user.bio}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-3">
              {user.spotify && (
                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                  <Music className="h-3 w-3" />
                  <span className="text-xs">Spotify</span>
                </div>
              )}
              {user.instagram && (
                <div className="flex items-center gap-1 bg-pink-500/20 px-2 py-1 rounded-full">
                  <Instagram className="h-3 w-3" />
                  <span className="text-xs">Instagram</span>
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 3).map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-white/10 text-white border-white/30"
                >
                  +{user.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
          onClick={handlePass}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-12 h-12 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300 hover:scale-110"
          onClick={handleSuperLike}
        >
          <Star className="h-5 w-5" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          onClick={handleLike}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;