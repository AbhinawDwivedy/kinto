import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Heart, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    photo: string;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onLike: (storyId: string) => void;
  onMessage: (userId: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onLike,
  onMessage
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextStory();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (isOpen && storyRef.current) {
      gsap.fromTo(storyRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [currentIndex, isOpen]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = storyRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };

  if (!currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[80vh] p-0 bg-black border-none overflow-hidden">
        <div ref={storyRef} className="relative h-full w-full">
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: index < currentIndex ? '100%' : 
                           index === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentStory.user.photo} />
                <AvatarFallback>{currentStory.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">
                  {currentStory.user.name}
                </p>
                <p className="text-white/70 text-xs">
                  {new Date(currentStory.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Story Content */}
          <div 
            className="h-full w-full cursor-pointer"
            onClick={handleClick}
          >
            {currentStory.mediaType === 'image' ? (
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={currentStory.mediaUrl}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
              />
            )}
          </div>

          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20">
              <p className="text-white text-sm bg-black/50 p-3 rounded-lg">
                {currentStory.caption}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-white hover:bg-white/20"
              onClick={() => onLike(currentStory.id)}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-gray-200"
              onClick={() => onMessage(currentStory.user.id)}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Message
            </Button>
          </div>

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full" onClick={prevStory} />
            <div className="w-1/2 h-full" onClick={nextStory} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;