import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Clock, Search, Plus, Filter } from 'lucide-react';
import { Event } from '@/types';

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Indie Music Night',
      description: 'Join us for an evening of indie music and great vibes. Local bands will be performing.',
      type: 'nightlife',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Music Ave, New York, NY',
        venue: 'The Underground'
      },
      date: '2025-01-20',
      time: '20:00',
      maxAttendees: 50,
      currentAttendees: ['user1', 'user2'],
      interestedUsers: ['user3', 'user4', 'user5'],
      createdBy: 'organizer1',
      photos: ['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'],
      tags: ['music', 'indie', 'nightlife'],
      ageRange: [21, 35],
      isPrivate: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Coffee & Connections',
      description: 'Casual meetup for coffee lovers. Perfect for making new friends in a relaxed setting.',
      type: 'casual',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: '456 Brew St, New York, NY',
        venue: 'Central Perk Cafe'
      },
      date: '2025-01-18',
      time: '15:00',
      maxAttendees: 20,
      currentAttendees: ['user1'],
      interestedUsers: ['user2', 'user3'],
      createdBy: 'organizer2',
      photos: ['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'],
      tags: ['coffee', 'casual', 'networking'],
      ageRange: [18, 40],
      isPrivate: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Weekend Hiking Adventure',
      description: 'Explore beautiful trails and meet fellow nature enthusiasts. All skill levels welcome!',
      type: 'sports',
      location: {
        latitude: 41.0082,
        longitude: -73.7357,
        address: 'Bear Mountain State Park, NY',
        venue: 'Bear Mountain Trail'
      },
      date: '2025-01-19',
      time: '09:00',
      maxAttendees: 15,
      currentAttendees: ['user1', 'user2', 'user3'],
      interestedUsers: ['user4'],
      createdBy: 'organizer3',
      photos: ['https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg'],
      tags: ['hiking', 'nature', 'adventure'],
      ageRange: [20, 45],
      isPrivate: false,
      createdAt: new Date().toISOString()
    }
  ];

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'party', label: 'Parties' },
    { id: 'casual', label: 'Casual' },
    { id: 'sports', label: 'Sports' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'food', label: 'Food' },
    { id: 'nightlife', label: 'Nightlife' }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinEvent = (eventId: string) => {
    console.log('Joining event:', eventId);
    // Handle join event logic
  };

  const handleInterestedEvent = (eventId: string) => {
    console.log('Interested in event:', eventId);
    // Handle interested logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-playfair font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Discover and join local events</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="shadow-card hover-lift overflow-hidden">
            <div className="flex">
              <img
                src={event.photos[0]}
                alt={event.title}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-playfair">{event.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{event.currentAttendees.length}/{event.maxAttendees || '∞'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInterestedEvent(event.id)}
                      >
                        Interested
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-primary"
                        onClick={() => handleJoinEvent(event.id)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create a new event!</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;