export const mockUsers = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'],
    bio: 'Love indie music, coffee shops, and weekend adventures. Looking for someone to explore the city with! 🎵☕',
    distance: 2.5,
    compatibilityScore: 89,
    interests: ['Music', 'Coffee', 'Travel', 'Photography'],
    isVerified: true,
    spotify: {
      topArtists: ['Arctic Monkeys', 'The Strokes', 'Tame Impala'],
      topGenres: ['Indie Rock', 'Alternative', 'Psychedelic'],
    },
    location: { city: 'Downtown', country: 'US' }
  },
  {
    id: '2',
    name: 'James',
    age: 27,
    photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'],
    bio: 'Software engineer by day, DJ by night. Always looking for new music and good vibes! 🎧💻',
    distance: 1.8,
    compatibilityScore: 92,
    interests: ['Music', 'Technology', 'DJing', 'Gaming'],
    isVerified: true,
    spotify: {
      topArtists: ['Daft Punk', 'Justice', 'Disclosure'],
      topGenres: ['Electronic', 'House', 'Techno'],
    },
    location: { city: 'Tech District', country: 'US' }
  },
  {
    id: '3',
    name: 'Sofia',
    age: 23,
    photos: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'],
    bio: 'Artist and yoga instructor. Love creating, moving, and connecting with nature 🎨🧘‍♀️',
    distance: 3.2,
    compatibilityScore: 85,
    interests: ['Art', 'Yoga', 'Nature', 'Meditation'],
    isVerified: false,
    spotify: {
      topArtists: ['Bon Iver', 'Phoebe Bridgers', 'Lana Del Rey'],
      topGenres: ['Indie Folk', 'Dream Pop', 'Alternative'],
    },
    location: { city: 'Arts Quarter', country: 'US' }
  },
  {
    id: '4',
    name: 'Alex',
    age: 26,
    photos: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'],
    bio: 'Fitness enthusiast and food lover. Let\'s grab a healthy meal after a workout! 💪🥗',
    distance: 4.1,
    compatibilityScore: 78,
    interests: ['Fitness', 'Food', 'Health', 'Cooking'],
    isVerified: true,
    spotify: {
      topArtists: ['The Weeknd', 'Drake', 'Post Malone'],
      topGenres: ['Hip Hop', 'R&B', 'Pop'],
    },
    location: { city: 'Fitness District', country: 'US' }
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Rooftop Summer Party',
    description: 'Join us for an amazing rooftop party with great music, drinks, and city views!',
    type: 'party' as const,
    location: {
      address: '123 Sky Tower, Downtown',
      venue: 'Sky Lounge'
    },
    date: '2024-02-15',
    time: '20:00',
    maxAttendees: 50,
    currentAttendees: ['1', '2', '3'],
    interestedUsers: ['4', '5'],
    createdBy: '1',
    photos: ['https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'],
    tags: ['party', 'rooftop', 'music', 'drinks'],
    ageRange: [21, 35] as [number, number],
    isPrivate: false
  },
  {
    id: '2',
    title: 'Coffee & Code Meetup',
    description: 'Casual meetup for developers and tech enthusiasts. Bring your laptop and let\'s code together!',
    type: 'casual' as const,
    location: {
      address: '456 Tech Street, Silicon Valley',
      venue: 'Code Café'
    },
    date: '2024-02-12',
    time: '14:00',
    maxAttendees: 20,
    currentAttendees: ['2', '4'],
    interestedUsers: ['1', '3'],
    createdBy: '2',
    photos: ['https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg'],
    tags: ['tech', 'coding', 'coffee', 'networking'],
    ageRange: [18, 40] as [number, number],
    isPrivate: false
  },
  {
    id: '3',
    title: 'Yoga in the Park',
    description: 'Morning yoga session in the beautiful Central Park. All levels welcome!',
    type: 'sports' as const,
    location: {
      address: 'Central Park, Main Lawn',
      venue: 'Central Park'
    },
    date: '2024-02-10',
    time: '08:00',
    maxAttendees: 30,
    currentAttendees: ['3', '1'],
    interestedUsers: ['2', '4'],
    createdBy: '3',
    photos: ['https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'],
    tags: ['yoga', 'fitness', 'nature', 'wellness'],
    ageRange: [18, 50] as [number, number],
    isPrivate: false
  }
];

export const mockMatches = [
  {
    id: '1',
    ...mockUsers[0],
    matchedAt: '2024-02-08T10:30:00Z',
    compatibility: {
      overall: 89,
      music: 85,
      interests: 92,
      location: 90
    }
  },
  {
    id: '2',
    ...mockUsers[1],
    matchedAt: '2024-02-07T15:45:00Z',
    compatibility: {
      overall: 92,
      music: 95,
      interests: 88,
      location: 93
    }
  }
];

export const mockMessages = [
  {
    id: '1',
    conversationId: 'conv1',
    senderId: '1',
    content: 'Hey! I saw we both love indie music. Have you heard the new Arctic Monkeys album?',
    timestamp: '2024-02-08T11:00:00Z',
    isRead: true
  },
  {
    id: '2',
    conversationId: 'conv1',
    senderId: 'current-user',
    content: 'Yes! It\'s amazing. "I Ain\'t Quite Where I Think I Am" is my favorite track. What about you?',
    timestamp: '2024-02-08T11:15:00Z',
    isRead: true
  },
  {
    id: '3',
    conversationId: 'conv2',
    senderId: '2',
    content: 'Your profile says you\'re into electronic music too! Want to check out this new club downtown?',
    timestamp: '2024-02-07T16:00:00Z',
    isRead: false
  }
];

export const mockConversations = [
  {
    id: 'conv1',
    participants: ['current-user', '1'],
    otherUser: mockUsers[0],
    lastMessage: mockMessages[1],
    isSlowChat: false,
    unreadCount: 0
  },
  {
    id: 'conv2',
    participants: ['current-user', '2'],
    otherUser: mockUsers[1],
    lastMessage: mockMessages[2],
    isSlowChat: true,
    slowChatDelay: 30,
    unreadCount: 1
  }
];