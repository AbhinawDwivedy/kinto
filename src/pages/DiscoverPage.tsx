import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Music, Instagram, AlignJustify as Spotify, Star, Info } from 'lucide-react';
import { useMatching } from '@/hooks/useMatching';
import { useLocation } from '@/hooks/useLocation';

const DiscoverPage: React.FC = () => {
  const { currentMatch, loading, likeUser, passUser, superLikeUser, hasMoreMatches, refreshMatches } = useMatching();
  const { latitude, longitude, error: locationError } = useLocation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-glow mx-auto mb-4"></div>
          <h2 className="text-xl font-playfair font-bold mb-2">Finding your perfect matches...</h2>
          <p className="text-muted-foreground">This might take a moment</p>
        </div>
      </div>
    );
  }

  if (!hasMoreMatches || !currentMatch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-playfair font-bold mb-2">No more profiles</h2>
          <p className="text-muted-foreground mb-4">Check back later for new people to discover!</p>
          <Button onClick={refreshMatches} className="bg-gradient-primary">
            Refresh Matches
          </Button>
        </div>
      </div>
    );
  }

  const handleLike = () => likeUser(currentMatch.id);
  const handlePass = () => passUser(currentMatch.id);
  const handleSuperLike = () => superLikeUser(currentMatch.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-playfair font-bold mb-2">Discover</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Find your perfect match through music and vibes</p>
          {locationError && (
            <div className="flex items-center text-yellow-500 text-xs">
              <Info className="h-3 w-3 mr-1" />
              Location disabled
            </div>
          )}
        </div>
      </div>

      <Card className="shadow-card hover-lift overflow-hidden">
        <div className="relative">
          <img
            src={currentMatch.photos[0]}
            alt={currentMatch.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {currentMatch.compatibilityScore || 0}% Match
            </Badge>
          </div>
          {currentMatch.distance && (
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                {Math.round(currentMatch.distance)}km away
              </Badge>
            </div>
          )}
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
            <span>{currentMatch.location?.city || 'Location not set'}</span>
          </div>

          <p className="text-sm mb-4 leading-relaxed">{currentMatch.bio}</p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Music className="h-4 w-4" />
                Music Taste
              </h4>
              <div className="flex flex-wrap gap-1">
                {currentMatch.spotify?.topGenres?.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                )) || (
                  <span className="text-xs text-muted-foreground">No music data</span>
                )}
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
              {currentMatch.spotify && (
                <div className="flex items-center gap-1">
                  <Spotify className="h-4 w-4 text-green-500" />
                  <span>Spotify</span>
                </div>
              )}
              {currentMatch.instagram && (
                <div className="flex items-center gap-1">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Instagram</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handlePass}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-12 h-12 border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
          onClick={handleSuperLike}
        >
          <Star className="h-4 w-4" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-primary hover:shadow-glow"
          onClick={handleLike}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Tap ❌ to pass • ⭐ to super like • ❤️ to like
        </p>
      </div>
    </div>
  );
};

export default DiscoverPage;