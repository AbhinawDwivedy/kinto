import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Clock, Heart, Smile } from 'lucide-react';
import { Conversation, Message, User } from '@/types';

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const mockConversations: (Conversation & { user: User; lastMessage: Message })[] = [
    {
      id: '1',
      participants: ['current_user', 'user1'],
      isSlowChat: true,
      slowChatDelay: 30,
      unreadCount: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'user1',
        email: 'emma@example.com',
        name: 'Emma',
        age: 25,
        gender: 'female',
        bio: 'Art enthusiast and music lover.',
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
        interests: ['Art', 'Music', 'Travel'],
        isVerified: true,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      lastMessage: {
        id: 'msg1',
        matchId: '1',
        senderId: 'user1',
        content: 'That playlist you shared is amazing! I love discovering new artists through music.',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        canReply: true
      }
    },
    {
      id: '2',
      participants: ['current_user', 'user2'],
      isSlowChat: false,
      slowChatDelay: 0,
      unreadCount: 0,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 'user2',
        email: 'james@example.com',
        name: 'James',
        age: 28,
        gender: 'male',
        bio: 'Software developer and musician.',
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
        interests: ['Music', 'Technology', 'Coffee'],
        isVerified: true,
        lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      },
      lastMessage: {
        id: 'msg2',
        matchId: '2',
        senderId: 'current_user',
        content: 'Would love to check out that coffee shop you mentioned!',
        type: 'text',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        canReply: true
      }
    }
  ];

  // Mock messages for selected chat
  const mockMessages: Message[] = [
    {
      id: 'msg1',
      matchId: '1',
      senderId: 'current_user',
      content: 'Hey Emma! I saw we have a 92% music compatibility. That\'s amazing!',
      type: 'text',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      canReply: true
    },
    {
      id: 'msg2',
      matchId: '1',
      senderId: 'user1',
      content: 'I know right! I love your taste in indie pop. Have you heard the new Phoebe Bridgers album?',
      type: 'text',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      canReply: true
    },
    {
      id: 'msg3',
      matchId: '1',
      senderId: 'current_user',
      content: 'Yes! It\'s incredible. I actually made a playlist inspired by it. Want me to share it?',
      type: 'text',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      canReply: true
    },
    {
      id: 'msg4',
      matchId: '1',
      senderId: 'user1',
      content: 'That playlist you shared is amazing! I love discovering new artists through music.',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      canReply: true,
      nextReplyTime: new Date(Date.now() + 28 * 60 * 1000).toISOString()
    }
  ];

  const selectedConversation = mockConversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
    // Handle send message logic
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNextReplyTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    return `${Math.ceil(diffInMinutes / 60)}h`;
  };

  if (!selectedChat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-playfair font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Your conversations with matches</p>
        </div>

        <div className="space-y-3">
          {mockConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="shadow-card hover-lift cursor-pointer transition-smooth"
              onClick={() => setSelectedChat(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.photos[0]} />
                    <AvatarFallback className="bg-primary/10 text-primary-glow">
                      {conversation.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {conversation.user.name}
                        {conversation.user.isVerified && (
                          <div className="w-4 h-4 bg-primary-glow rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        {conversation.isSlowChat && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Slow Chat
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.senderId === 'current_user' ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-primary-glow rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{conversation.unreadCount}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">Start matching with people to begin chatting!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Chat Header */}
      <Card className="shadow-card mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
            >
              ← Back
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation?.user.photos[0]} />
              <AvatarFallback className="bg-primary/10 text-primary-glow">
                {selectedConversation?.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="font-semibold flex items-center gap-2">
                {selectedConversation?.user.name}
                {selectedConversation?.user.isVerified && (
                  <div className="w-4 h-4 bg-primary-glow rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedConversation?.user.location.city}
              </p>
            </div>

            {selectedConversation?.isSlowChat && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Slow Chat ({selectedConversation.slowChatDelay}min)
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="shadow-card mb-4">
        <CardContent className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'current_user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 'current_user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.nextReplyTime && message.senderId !== 'current_user' && (
                    <span className="text-xs opacity-70 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Reply in {getNextReplyTime(message.nextReplyTime)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder={
                selectedConversation?.isSlowChat 
                  ? "Take your time crafting a thoughtful message..."
                  : "Type a message..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-primary hover:shadow-glow"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {selectedConversation?.isSlowChat && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Slow chat mode encourages thoughtful conversations. Take your time!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;