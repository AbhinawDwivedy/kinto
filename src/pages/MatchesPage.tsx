import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Search, Filter, MapPin, Music, Star, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMatching } from '@/hooks/useMatching';
import { AnimationController } from '@/lib/animations';

const MatchesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { matches, loading, refreshMatches } = useMatching();
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AnimationController.init();
    if (containerRef.current) {
      AnimationController.pageTransition(containerRef.current, 'in');
    }
  }, []);

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (matchId: string) => {
    // Navigate to chat with this match
    console.log('Starting chat with:', matchId);
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
            Loading your matches
          </h2>
          <p className="text-muted-foreground animate-pulse">Finding people who liked you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" ref={containerRef}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              Your Matches
            </h1>
            <p className="text-muted-foreground">People who liked you back and want to connect</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMatches}
              className="border-primary-glow text-primary-glow hover:bg-primary-glow hover:text-white transition-all duration-300"
            >
              <Heart className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-muted/20 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'matches' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('matches')}
            className={activeTab === 'matches' ? 'bg-gradient-primary' : ''}
          >
            <Users className="h-4 w-4 mr-2" />
            Matches ({matches.length})
          </Button>
          <Button
            variant={activeTab === 'likes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('likes')}
            className={activeTab === 'likes' ? 'bg-gradient-primary' : ''}
          >
            <Heart className="h-4 w-4 mr-2" />
            Likes (12)
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-muted/20 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-glow focus:border-transparent transition-all duration-300"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <Heart className="h-24 w-24 mx-auto text-muted-foreground/50" />
              <div className="absolute -top-2 -right-2">
                <Star className="h-8 w-8 text-yellow-500/50" />
              </div>
            </div>
            <h3 className="text-2xl font-playfair font-bold mb-4 text-muted-foreground">
              {activeTab === 'matches' ? 'No matches yet' : 'No likes yet'}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {activeTab === 'matches' 
                ? 'Keep swiping to find people who like you back!'
                : 'People who like you will appear here. Start swiping to get noticed!'
              }
            </p>
            <Button 
              onClick={() => window.location.href = '/discover'}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start Discovering
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="group hover:shadow-glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-muted">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={match.photos?.[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'}
                      alt={match.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-green-500/90 text-white">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        Online
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {match.name}, {match.age}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{match.location?.city || 'Location not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm mb-4 leading-relaxed line-clamp-2">{match.bio}</p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                          <Music className="h-3 w-3" />
                          Music Taste
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {match.spotify?.topGenres?.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          )) || (
                            <span className="text-xs text-muted-foreground">No music data</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Interests</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.interests.slice(0, 3).map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Matched 2 days ago
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartChat(match.id)}
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;