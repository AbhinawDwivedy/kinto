import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Camera, Music, Instagram, MapPin, Heart, Edit3, AlignJustify as Spotify, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { profile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    interests: profile?.interests || []
  });

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const commonInterests = [
    'Music', 'Movies', 'Travel', 'Food', 'Sports', 'Art', 'Books', 'Gaming',
    'Photography', 'Dancing', 'Hiking', 'Cooking', 'Fitness', 'Technology',
    'Fashion', 'Animals', 'Nature', 'Comedy', 'Adventure', 'Meditation'
  ];

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-playfair font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your Kinto profile</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          {/* Profile Header */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.photos?.[0]} />
                    <AvatarFallback className="bg-primary/10 text-primary-glow text-2xl">
                      {profile.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-playfair font-bold flex items-center gap-2">
                      {profile.name}
                      {profile.isVerified && (
                        <div className="w-5 h-5 bg-primary-glow rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{profile.age} years old</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.location?.city}</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editData.bio}
                          onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <Button onClick={handleSave} className="bg-gradient-primary">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Interests</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {commonInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-sm transition-smooth ${
                          editData.interests.includes(interest)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-primary/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Spotify className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Spotify</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.spotify ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {profile.spotify ? 'Disconnect' : 'Connect'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.instagram ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {profile.instagram ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Discovery Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Age Range</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={profile.preferences?.ageRange[0] || 18}
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={profile.preferences?.ageRange[1] || 50}
                    className="w-20"
                  />
                </div>
              </div>

              <div>
                <Label>Maximum Distance</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={profile.preferences?.maxDistance || 50}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">km</span>
                </div>
              </div>

              <div>
                <Label>Looking For</Label>
                <div className="flex gap-2 mt-1">
                  {['dating', 'friends', 'both'].map((option) => (
                    <Badge
                      key={option}
                      variant={profile.preferences?.lookingFor === option ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Privacy & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show me on Kinto</p>
                  <p className="text-sm text-muted-foreground">Control your visibility</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Distance visibility</p>
                  <p className="text-sm text-muted-foreground">Show distance to matches</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Read receipts</p>
                  <p className="text-sm text-muted-foreground">Let matches know when you've read messages</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6 mt-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Music Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.spotify ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Top Artists</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.spotify.topArtists?.map((artist) => (
                        <Badge key={artist} variant="outline">
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Top Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.spotify.topGenres?.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Connect your Spotify to show your music taste</p>
                  <Button className="bg-gradient-primary">
                    <Spotify className="h-4 w-4 mr-2" />
                    Connect Spotify
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-playfair">Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-primary-glow" />
                <div className="flex-1">
                  <p className="font-medium">Profile Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.isVerified 
                      ? 'Your profile is verified' 
                      : 'Verify your profile to increase trust'
                    }
                  </p>
                </div>
                {!profile.isVerified && (
                  <Button variant="outline" size="sm">
                    Verify Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;