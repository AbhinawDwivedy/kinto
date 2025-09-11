import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Search, Filter, MapPin, Music, Star, Clock } from 'lucide-react';
import { mockMatches } from '@/data/mockData';

const MatchesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = mockMatches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (matchId: string) => {
    console.log('Starting chat with:', matchId);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
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
            Matches ({mockMatches.length})
          </Button>
          <Button
            variant={activeTab === 'likes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('likes')}
            className={activeTab === 'likes' ? 'bg-gradient-primary' : ''}
          >
            <Heart className="h-4 w-4 mr-2" />
            Likes (5)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <Card key={match.id} className="group hover:shadow-glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={match.photos[0]}
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
                      <span>{match.location.city}</span>
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
                        ))}
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
      </div>
    </div>
  );
};

export default MatchesPage;