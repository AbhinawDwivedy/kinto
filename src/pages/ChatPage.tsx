import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Clock, Heart, Smile, ArrowLeft } from 'lucide-react';
import { mockConversations, mockMessages } from '@/data/mockData';

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const selectedConversation = mockConversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage);
    setNewMessage('');
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

  if (!selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-hero">
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
                      <AvatarImage src={conversation.otherUser.photos[0]} />
                      <AvatarFallback className="bg-primary/10 text-primary-glow">
                        {conversation.otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold flex items-center gap-2">
                          {conversation.otherUser.name}
                          {conversation.otherUser.isVerified && (
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
                            {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ''}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
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
      </div>
    );
  }

  const chatMessages = mockMessages.filter(m => m.conversationId === selectedChat);

  return (
    <div className="min-h-screen bg-gradient-hero">
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation?.otherUser.photos[0]} />
                <AvatarFallback className="bg-primary/10 text-primary-glow">
                  {selectedConversation?.otherUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="font-semibold flex items-center gap-2">
                  {selectedConversation?.otherUser.name}
                  {selectedConversation?.otherUser.isVerified && (
                    <div className="w-4 h-4 bg-primary-glow rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation?.otherUser.location.city}
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
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'current-user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
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
    </div>
  );
};

export default ChatPage;