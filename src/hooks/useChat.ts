import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, subscribeToMessages, sendMessage } from '@/lib/supabase-client';

export const useChat = (conversationId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          match:matches!conversations_match_id_fkey(
            *,
            user1:profiles!matches_user1_id_fkey(*),
            user2:profiles!matches_user2_id_fkey(*)
          ),
          last_message:messages(*)
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Transform data to include the other user's info
      const transformedConversations = data.map((conv: any) => {
        const match = conv.match;
        const otherUser = match.user1.id === user.id ? match.user2 : match.user1;
        
        return {
          ...conv,
          otherUser,
          lastMessage: conv.last_message?.[0] || null,
        };
      });

      setConversations(transformedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, user_photos(*))
        `)
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const handleSendMessage = async (content: string, messageType = 'text') => {
    if (!user || !conversationId) return;

    try {
      const message = await sendMessage(conversationId, user.id, content, messageType);
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);

    const subscription = subscribeToMessages(conversationId, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    messages,
    conversations,
    loading,
    sendMessage: handleSendMessage,
    refreshConversations: fetchConversations,
  };
};