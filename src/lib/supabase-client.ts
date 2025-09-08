import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Real-time subscriptions helper
export const subscribeToMatches = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('matches')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `user1_id=eq.${userId},user2_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// Location services
export const updateUserLocation = async (userId: string, latitude: number, longitude: number) => {
  const { error } = await supabase
    .from('user_locations')
    .upsert({
      user_id: userId,
      coordinates: `POINT(${longitude} ${latitude})`,
      is_active: true,
      created_at: new Date().toISOString(),
    });

  if (error) throw error;

  // Also update the profile location
  await supabase
    .from('profiles')
    .update({
      location_coordinates: `POINT(${longitude} ${latitude})`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
};

// Advanced matching functions
export const getPotentialMatches = async (userId: string, limit = 10) => {
  const { data, error } = await supabase.rpc('get_potential_matches', {
    user_id: userId,
    limit_count: limit,
  });

  if (error) throw error;
  return data;
};

// Event functions
export const getNearbyEvents = async (latitude: number, longitude: number, radiusKm = 50) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      creator:profiles!events_creator_id_fkey(name, age),
      attendee_count:event_attendees(count)
    `)
    .eq('status', 'active')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data;
};

// Chat functions
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  messageType = 'text'
) => {
  // Check if slow chat is enabled and if user can reply
  const { data: conversation } = await supabase
    .from('conversations')
    .select('is_slow_chat, slow_chat_delay')
    .eq('id', conversationId)
    .single();

  let nextReplyTime = null;
  if (conversation?.is_slow_chat) {
    const delay = conversation.slow_chat_delay || 30;
    nextReplyTime = new Date(Date.now() + delay * 60 * 1000).toISOString();
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType,
      next_reply_time: nextReplyTime,
    })
    .select()
    .single();

  if (error) throw error;

  // Update conversation last message time
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
};

// Safety functions
export const reportUser = async (
  reporterId: string,
  reportedId: string,
  reason: string,
  description?: string
) => {
  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      reported_id: reportedId,
      reason,
      description,
    });

  if (error) throw error;
};

export const blockUser = async (blockerId: string, blockedId: string) => {
  const { error } = await supabase
    .from('blocks')
    .insert({
      blocker_id: blockerId,
      blocked_id: blockedId,
    });

  if (error) throw error;

  // Remove any existing matches
  await supabase
    .from('matches')
    .update({ status: 'blocked' })
    .or(`user1_id.eq.${blockerId},user2_id.eq.${blockerId}`)
    .or(`user1_id.eq.${blockedId},user2_id.eq.${blockedId}`);
};

// Spotify integration
export const updateSpotifyData = async (userId: string, spotifyData: any) => {
  const { error } = await supabase
    .from('spotify_data')
    .upsert({
      user_id: userId,
      ...spotifyData,
      last_synced: new Date().toISOString(),
    });

  if (error) throw error;
};

// Instagram integration
export const updateInstagramData = async (userId: string, instagramData: any) => {
  const { error } = await supabase
    .from('instagram_data')
    .upsert({
      user_id: userId,
      ...instagramData,
      last_synced: new Date().toISOString(),
    });

  if (error) throw error;
};