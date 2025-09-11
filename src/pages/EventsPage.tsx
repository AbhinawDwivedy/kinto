import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, Plus, Search, Filter, Heart } from 'lucide-react';
import { mockEvents } from '@/data/mockData';

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-events'>('discover');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinEvent = (eventId: string) => {
    console.log('Joining event:', eventId);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'party': return 'bg-purple-500';
      case 'casual': return 'bg-blue-500';
      case 'sports': return 'bg-green-500';
      case 'cultural': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-foreground to-primary-glow bg-clip-text text-transparent">
              Events & Meetups
            </h1>
            <p className="text-muted-foreground">Discover local events and meet new people</p>
          </div>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-muted/20 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'discover' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('discover')}
            className={activeTab === 'discover' ? 'bg-gradient-primary' : ''}
          >
            <Search className="h-4 w-4 mr-2" />
            Discover ({mockEvents.length})
          </Button>
          <Button
            variant={activeTab === 'my-events' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('my-events')}
            className={activeTab === 'my-events' ? 'bg-gradient-primary' : ''}
          >
            <Calendar className="h-4 w-4 mr-2" />
            My Events (2)
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-muted">
              <div className="relative">
                <img
                  src={event.photos[0]}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-playfair">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary-glow" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary-glow" />
                    <span>{event.location.venue}, {event.location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary-glow" />
                    <span>{event.currentAttendees.length} going • {event.interestedUsers.length} interested</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleJoinEvent(event.id)}
                    className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Join Event
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-glow text-primary-glow hover:bg-primary-glow hover:text-white"
                  >
                    Interested
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;