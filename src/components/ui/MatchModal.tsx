import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, X } from 'lucide-react';
import { AnimationController } from '@/lib/animations';
import { gsap } from 'gsap';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    photo: string;
  };
  matchedUser: {
    name: string;
    photo: string;
  };
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  matchedUser,
  onSendMessage,
  onKeepSwiping
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && heartsRef.current) {
      // Animate modal entrance
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      // Create celebration animation
      AnimationController.matchCelebration(heartsRef.current);

      // Animate photos
      const photos = modalRef.current.querySelectorAll('.match-photo');
      gsap.fromTo(photos,
        { scale: 0, rotation: 180 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.8, 
          stagger: 0.2,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );

      // Animate text
      const text = modalRef.current.querySelector('.match-text');
      if (text) {
        gsap.fromTo(text,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.8 }
        );
      }

      // Animate buttons
      const buttons = modalRef.current.querySelectorAll('.match-button');
      gsap.fromTo(buttons,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1,
          delay: 1.2
        }
      );
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 border-none text-white overflow-hidden">
          <div ref={modalRef} className="text-center p-6">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Match Photos */}
            <div className="flex justify-center items-center gap-4 mb-6 relative">
              <div className="match-photo relative">
                <img
                  src={currentUser.photo}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Heart className="h-8 w-8 text-white fill-current animate-pulse" />
              </div>
              
              <div className="match-photo relative">
                <img
                  src={matchedUser.photo}
                  alt={matchedUser.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>

            {/* Match Text */}
            <div className="match-text mb-8">
              <h2 className="text-3xl font-bold font-playfair mb-2">
                It's a Match!
              </h2>
              <p className="text-lg opacity-90">
                You and {matchedUser.name} liked each other
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="match-button w-full bg-white text-pink-500 hover:bg-gray-100 font-semibold py-3 rounded-full transition-all duration-300 hover:scale-105"
                onClick={onSendMessage}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              
              <Button
                variant="outline"
                className="match-button w-full border-white text-white hover:bg-white/20 font-semibold py-3 rounded-full transition-all duration-300"
                onClick={onKeepSwiping}
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hearts Animation Container */}
      <div
        ref={heartsRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ display: isOpen ? 'block' : 'none' }}
      />
    </>
  );
};

export default MatchModal;