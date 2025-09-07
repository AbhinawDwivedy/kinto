import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Music, Instagram, Spotify } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { MatchingAlgorithm } from '@/lib/matching-algorithm';

const DiscoverPage: React.FC = () => {
  const { profile } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'sarah@example.com',
        name: 'Sarah',
        age: 24,
        gender: 'female',
        bio: 'Music lover, coffee enthusiast, and adventure seeker. Always up for discovering new artists and hidden gems in the city.',
        photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'],
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          city: 'New York',
          country: 'USA'
        },
        preferences: {
          ageRange: [22, 30],
          maxDistance: 25,
          interestedIn: ['male'],
          lookingFor: 'both'
        },
        interests: ['Music', 'Coffee', 'Travel', 'Photography', 'Art'],
        spotify: {
          id: 'sarah_spotify',
          topArtists: ['Taylor Swift', 'Billie Eilish', 'The Weeknd'],
          topGenres: ['Pop', 'Indie', 'Alternative'],
          topTracks: ['Anti-Hero', 'Bad Guy', 'Blinding Lights'],
          playlists: []
        },
        isVerified: true,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'alex@example.com',
        name: 'Alex',
        age: 26,
        gender: 'male',
        bio: 'Indie rock enthusiast and weekend hiker. Looking for someone to share playlists and explore the city with.',
        photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'],
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          city: 'New York',
          country: 'USA'
        },
        preferences: {
          ageRange: [21, 28],
          maxDistance: 30,
          interestedIn: ['female'],
          lookingFor: 'dating'
        },
        interests: ['Music', 'Hiking', 'Photography', 'Food', 'Movies'],
        spotify: {
          id: 'alex_spotify',
          topArtists: ['Arctic Monkeys', 'Tame Impala', 'Mac DeMarco'],
          topGenres: ['Indie Rock', 'Alternative', 'Psychedelic'],
          topTracks: ['Do I Wanna Know?', 'The Less I Know The Better', 'Chamber of Reflection'],
          playlists: []
        },
        isVerified: true,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];

    if (profile) {
      const matches = MatchingAlgorithm.findPotentialMatches(profile as User, mockUsers);
      setPotentialMatches(matches);
    }
  }, [profile]);

  const currentMatch = potentialMatches[currentIndex];

  const handleLike = () => {
    // Handle like logic
    console.log('Liked:', currentMatch?.name);
    nextCard();
  };

  const handlePass = () => {
    // Handle pass logic
    console.log('Passed:', currentMatch?.name);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more cards
      setCurrentIndex(0);
    }
  };

  if (!currentMatch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-playfair font-bold mb-2">No more profiles</h2>
          <p className="text-muted-foreground">Check back later for new people to discover!</p>
        </div>
      </div>
    );
  }

  const compatibility = MatchingAlgorithm.calculateCompatibility(profile as User, currentMatch);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">Find your perfect match through music and vibes</p>
      </div>

      <Card className="shadow-card hover-lift overflow-hidden">
        <div className="relative">
          <img
            src={currentMatch.photos[0]}
            alt={currentMatch.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {compatibility.overall}% Match
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-playfair font-bold flex items-center gap-2">
                {currentMatch.name}
                {currentMatch.isVerified && (
                  <div className="w-5 h-5 bg-primary-glow rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </h3>
              <p className="text-muted-foreground">{currentMatch.age} years old</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{currentMatch.location.city}</span>
          </div>

          <p className="text-sm mb-4 leading-relaxed">{currentMatch.bio}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Music className="h-4 w-4" />
                Music Compatibility: {compatibility.music}%
              </h4>
              <div className="flex flex-wrap gap-1">
                {currentMatch.spotify?.topGenres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
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
              <div className="flex items-center gap-1">
                <Spotify className="h-4 w-4 text-green-500" />
                <span>Connected</span>
              </div>
              {currentMatch.instagram && (
                <div className="flex items-center gap-1">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Connected</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handlePass}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-primary hover:shadow-glow"
          onClick={handleLike}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default DiscoverPage;