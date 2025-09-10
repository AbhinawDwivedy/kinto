import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AnimationController {
  static init() {
    // Initialize GSAP with custom settings
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });
  }

  // Card swipe animations
  static swipeCard(element: HTMLElement, direction: 'left' | 'right', onComplete?: () => void) {
    const x = direction === 'left' ? -window.innerWidth : window.innerWidth;
    const rotation = direction === 'left' ? -30 : 30;

    gsap.to(element, {
      x,
      rotation,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(element, { x: 0, rotation: 0, opacity: 1 });
        onComplete?.();
      }
    });
  }

  // Like/dislike button animations
  static likeAnimation(element: HTMLElement) {
    gsap.fromTo(element, 
      { scale: 1 },
      { 
        scale: 1.2, 
        duration: 0.1, 
        yoyo: true, 
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  }

  // Match celebration animation
  static matchCelebration(container: HTMLElement) {
    // Create hearts animation
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'absolute';
      heart.style.fontSize = '20px';
      heart.style.pointerEvents = 'none';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = '100%';
      container.appendChild(heart);

      gsap.to(heart, {
        y: -window.innerHeight,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 2 + Math.random() * 2,
        ease: "power2.out",
        onComplete: () => heart.remove()
      });
    }
  }

  // Page transition animations
  static pageTransition(element: HTMLElement, direction: 'in' | 'out') {
    if (direction === 'in') {
      gsap.fromTo(element,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.to(element, {
        opacity: 0,
        y: -50,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }

  // Floating animation for elements
  static floatingAnimation(element: HTMLElement) {
    gsap.to(element, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  // Stagger animation for lists
  static staggerAnimation(elements: HTMLElement[], delay = 0.1) {
    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: delay,
        ease: "power2.out"
      }
    );
  }

  // Pulse animation for notifications
  static pulseAnimation(element: HTMLElement) {
    gsap.fromTo(element,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      }
    );
  }

  // Typing indicator animation
  static typingIndicator(element: HTMLElement) {
    const dots = element.querySelectorAll('.dot');
    gsap.to(dots, {
      opacity: 0.3,
      duration: 0.5,
      stagger: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    });
  }

  // Photo gallery animations
  static photoGalleryAnimation(photos: HTMLElement[]) {
    photos.forEach((photo, index) => {
      gsap.fromTo(photo,
        { scale: 0, rotation: Math.random() * 20 - 10 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "back.out(1.7)"
        }
      );
    });
  }

  // Message bubble animation
  static messageBubbleAnimation(element: HTMLElement, fromSelf: boolean) {
    const x = fromSelf ? 50 : -50;
    gsap.fromTo(element,
      { opacity: 0, x, scale: 0.8 },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        duration: 0.4, 
        ease: "back.out(1.7)" 
      }
    );
  }

  // Loading animation
  static loadingAnimation(element: HTMLElement) {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1
    });
  }

  // Reveal animation with scroll trigger
  static revealOnScroll(element: HTMLElement) {
    gsap.fromTo(element,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}