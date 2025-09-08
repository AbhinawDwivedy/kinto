import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { User as AppUser } from '@/types';
import { subscribeToNotifications } from '@/lib/supabase-client';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  notifications: any[];
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  updateLocation: (latitude: number, longitude: number) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          setupNotifications(session.user.id);
        } else {
          setProfile(null);
          setNotifications([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_photos(*),
          user_interests(*),
          spotify_data(*),
          instagram_data(*)
        `)
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      // Transform the data to match our AppUser type
      const transformedProfile = {
        ...profileData,
        photos: profileData.user_photos?.map((p: any) => p.photo_url) || [],
        interests: profileData.user_interests?.map((i: any) => i.interest) || [],
        spotify: profileData.spotify_data?.[0] || null,
        instagram: profileData.instagram_data?.[0] || null,
        location: profileData.location_coordinates ? {
          latitude: 0, // Will be parsed from PostGIS point
          longitude: 0,
          city: profileData.location_city || '',
          country: profileData.location_country || '',
        } : null,
        preferences: {
          ageRange: [profileData.age_range_min || 18, profileData.age_range_max || 50],
          maxDistance: profileData.max_distance || 50,
          interestedIn: profileData.interested_in || [],
          lookingFor: profileData.looking_for || 'both',
        },
      };
      
      setProfile(transformedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const setupNotifications = async (userId: string) => {
    // Fetch existing notifications
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    
    if (data) {
      setNotifications(data);
    }

    // Subscribe to new notifications
    const subscription = subscribeToNotifications(userId, (payload) => {
      setNotifications(prev => [payload.new, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  };
  const signUp = async (email: string, password: string, userData: Partial<AppUser>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          email,
          name: userData.name || '',
          age: userData.age || 18,
          gender: userData.gender || 'other',
          bio: userData.bio || '',
          looking_for: userData.preferences?.lookingFor || 'both',
          age_range_min: userData.preferences?.ageRange?.[0] || 18,
          age_range_max: userData.preferences?.ageRange?.[1] || 50,
          max_distance: userData.preferences?.maxDistance || 50,
          interested_in: userData.preferences?.interestedIn || [],
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Add interests if provided
      if (userData.interests && userData.interests.length > 0) {
        const interestInserts = userData.interests.map(interest => ({
          user_id: data.user!.id,
          interest,
        }));

        await supabase
          .from('user_interests')
          .insert(interestInserts);
      }

      // Add photos if provided
      if (userData.photos && userData.photos.length > 0) {
        const photoInserts = userData.photos.map((photo, index) => ({
          user_id: data.user!.id,
          photo_url: photo,
          is_primary: index === 0,
          order_index: index,
        }));

        await supabase
          .from('user_photos')
          .insert(photoInserts);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) throw new Error('No user logged in');

    // Update main profile
    const profileUpdates: any = {};
    if (updates.name) profileUpdates.name = updates.name;
    if (updates.age) profileUpdates.age = updates.age;
    if (updates.bio) profileUpdates.bio = updates.bio;
    if (updates.preferences?.lookingFor) profileUpdates.looking_for = updates.preferences.lookingFor;
    if (updates.preferences?.ageRange) {
      profileUpdates.age_range_min = updates.preferences.ageRange[0];
      profileUpdates.age_range_max = updates.preferences.ageRange[1];
    }
    if (updates.preferences?.maxDistance) profileUpdates.max_distance = updates.preferences.maxDistance;
    if (updates.preferences?.interestedIn) profileUpdates.interested_in = updates.preferences.interestedIn;
    
    profileUpdates.updated_at = new Date().toISOString();

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Update interests if provided
    if (updates.interests) {
      // Delete existing interests
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);

      // Insert new interests
      if (updates.interests.length > 0) {
        const interestInserts = updates.interests.map(interest => ({
          user_id: user.id,
          interest,
        }));

        await supabase
          .from('user_interests')
          .insert(interestInserts);
      }
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('user_locations')
      .upsert({
        user_id: user.id,
        coordinates: `POINT(${longitude} ${latitude})`,
        is_active: true,
      });

    if (error) throw error;

    // Update profile location
    await supabase
      .from('profiles')
      .update({
        location_coordinates: `POINT(${longitude} ${latitude})`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;

    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const value = {
    user,
    profile,
    loading,
    notifications,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateLocation,
    markNotificationAsRead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};