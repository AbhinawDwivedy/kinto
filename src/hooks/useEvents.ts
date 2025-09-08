import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { Event } from '@/types';

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!events_creator_id_fkey(name, age, user_photos(*)),
          attendees:event_attendees(
            *,
            user:profiles!event_attendees_user_id_fkey(name, user_photos(*))
          )
        `)
        .eq('status', 'active')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (error) throw error;

      const transformedEvents = data.map((event: any) => ({
        ...event,
        createdBy: event.creator.id,
        currentAttendees: event.attendees
          .filter((a: any) => a.status === 'going')
          .map((a: any) => a.user_id),
        interestedUsers: event.attendees
          .filter((a: any) => a.status === 'interested')
          .map((a: any) => a.user_id),
        location: {
          latitude: 0, // Will be parsed from PostGIS
          longitude: 0,
          address: event.location_address,
          venue: event.location_venue,
        },
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          attendees:event_attendees(
            *,
            user:profiles!event_attendees_user_id_fkey(name, user_photos(*))
          )
        `)
        .eq('creator_id', user.id)
        .order('event_date', { ascending: true });

      if (error) throw error;

      const transformedEvents = data.map((event: any) => ({
        ...event,
        createdBy: event.creator_id,
        currentAttendees: event.attendees
          .filter((a: any) => a.status === 'going')
          .map((a: any) => a.user_id),
        interestedUsers: event.attendees
          .filter((a: any) => a.status === 'interested')
          .map((a: any) => a.user_id),
        location: {
          latitude: 0,
          longitude: 0,
          address: event.location_address,
          venue: event.location_venue,
        },
      }));

      setMyEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          creator_id: user.id,
          title: eventData.title,
          description: eventData.description,
          event_type: eventData.type,
          location_address: eventData.location?.address,
          location_venue: eventData.location?.venue,
          event_date: eventData.date,
          event_time: eventData.time,
          max_attendees: eventData.maxAttendees,
          age_range_min: eventData.ageRange?.[0] || 18,
          age_range_max: eventData.ageRange?.[1] || 100,
          is_private: eventData.isPrivate || false,
          tags: eventData.tags || [],
          photos: eventData.photos || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh events
      await fetchEvents();
      await fetchMyEvents();

      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const joinEvent = async (eventId: string, status: 'interested' | 'going') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        });

      if (error) throw error;

      // Refresh events
      await fetchEvents();
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const leaveEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh events
      await fetchEvents();
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
  }, [user]);

  return {
    events,
    myEvents,
    loading,
    createEvent,
    joinEvent,
    leaveEvent,
    refreshEvents: fetchEvents,
  };
};