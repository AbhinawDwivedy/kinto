import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Music, MapPin, Clock } from 'lucide-react';
import { Match, User } from '@/types';

const MatchesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('matches');

  // Mock matches data
  const mockMatches: (Match & { user: User })[] = [
    {
      id: '1',
      users: ['current_user', 'user1'],
      compatibility: {
        overall: 89,
        music: 92,
        interests: 85,
        location: 90
      },
      status: 'matched',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'user1',
        email: 'emma@example.com',
        name: 'Emma',
        age: 25,
        gender: 'female',
        bio: 'Art enthusiast and music lover. Always looking for new adventures and great conversations.',
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
        interests: ['Art', 'Music', 'Travel', 'Photography'],
        spotify: {
          id: 'emma_spotify',
          topArtists: ['Lorde', 'Phoebe Bridgers', 'Clairo'],
          topGenres: ['Indie Pop', 'Alternative', 'Dream Pop'],
          topTracks: ['Solar Power', 'Motion Sickness', 'Pretty Girl'],
          playlists: []
        },
        isVerified: true,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    },
    {
      id: '2',
      users: ['current_user', 'user2'],
      compatibility: {
        overall: 76,
        music: 82,
        interests: 70,
        location: 75
      },
      status: 'matched',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'user2',
        email: 'james@example.com',
        name: 'James',
        age: 28,
        gender: 'male',
        bio: 'Software developer by day, musician by night. Love discovering new bands and exploring the city.',
        photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'],
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          city: 'New York',
          country: 'USA'
        },
        preferences: {
          ageRange: [21, 32],
          maxDistance: 30,
          interestedIn: ['female'],
          lookingFor: 'dating'
        },
        interests: ['Music', 'Technology', 'Coffee', 'Movies'],
        spotify: {
          id: 'james_spotify',
          topArtists: ['Radiohead', 'Bon Iver', 'The National'],
          topGenres: ['Alternative Rock', 'Indie Folk', 'Post-Rock'],
          topTracks: ['Paranoid Android', 'Holocene', 'Bloodbuzz Ohio'],
          playlists: []
        },
        isVerified: true,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }
    }
  ];

  // Mock likes data
  const mockLikes: User[] = [
    {
      id: 'user3',
      email: 'sophia@example.com',
      name: 'Sophia',
      age: 23,
      gender: 'female',
      bio: 'Dance enthusiast and foodie. Love trying new restaurants and dancing the night away.',
      photos: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'],
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        city: 'New York',
        country: 'USA'
      },
      preferences: {
        ageRange: [20, 28],
        maxDistance: 20,
        interestedIn: ['male'],
        lookingFor: 'both'
      },
      interests: ['Dancing', 'Food', 'Music', 'Fashion'],
      isVerified: false,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  const handleStartChat = (matchId: string) => {
    console.log('Starting chat with match:', matchId);
    // Navigate to chat
  };

  const handleLikeBack = (userId: string) => {
    console.log('Liking back user:', userId);
    // Handle like back logic
  };

  const handlePass = (userId: string) => {
    console.log('Passing on user:', userId);
    // Handle pass logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold mb-2">Matches</h1>
        <p className="text-muted-foreground">Your connections and people who liked you</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Matches ({mockMatches.length})</TabsTrigger>
          <TabsTrigger value="likes">Likes ({mockLikes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4 mt-6">
          {mockMatches.map((match) => (
            <Card key={match.id} className="shadow-card hover-lift overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={match.user.photos[0]}
                    alt={match.user.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {match.user.name}
                          {match.user.isVerified && (
                            <div className="w-4 h-4 bg-primary-glow rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{match.user.age} years old</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary-glow">
                        {match.compatibility.overall}% Match
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{match.user.location.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        <span>{match.compatibility.music}% music match</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(match.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {match.user.bio}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {match.user.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        className="bg-gradient-primary hover:shadow-glow"
                        onClick={() => handleStartChat(match.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockMatches.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
              <p className="text-muted-foreground">Keep swiping to find your perfect match!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes" className="space-y-4 mt-6">
          {mockLikes.map((user) => (
            <Card key={user.id} className="shadow-card hover-lift overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={user.photos[0]}
                    alt={user.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {user.name}
                          {user.isVerified && (
                            <div className="w-4 h-4 bg-primary-glow rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.age} years old</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary-glow">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Liked you</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3" />
                      <span>{user.location.city}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {user.bio}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {user.interests.slice(0, 3).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePass(user.id)}
                        >
                          Pass
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-primary hover:shadow-glow"
                          onClick={() => handleLikeBack(user.id)}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Like Back
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockLikes.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No likes yet</h3>
              <p className="text-muted-foreground">Keep being awesome! Someone will notice you soon.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchesPage;