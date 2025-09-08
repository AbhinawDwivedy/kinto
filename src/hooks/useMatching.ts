import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, getPotentialMatches } from '@/lib/supabase-client';
import { User } from '@/types';

export const useMatching = () => {
  const { user } = useAuth();
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPotentialMatches = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const matches = await getPotentialMatches(user.id, 20);
      
      // Transform the data to include full user profiles
      const fullProfiles = await Promise.all(
        matches.map(async (match: any) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select(`
              *,
              user_photos(*),
              user_interests(*),
              spotify_data(*)
            `)
            .eq('id', match.id)
            .single();

          return {
            ...profile,
            photos: profile.user_photos?.map((p: any) => p.photo_url) || [],
            interests: profile.user_interests?.map((i: any) => i.interest) || [],
            spotify: profile.spotify_data?.[0] || null,
            distance: match.distance,
            compatibilityScore: match.compatibility_score,
            location: {
              latitude: 0,
              longitude: 0,
              city: profile.location_city || '',
              country: profile.location_country || '',
            },
            preferences: {
              ageRange: [profile.age_range_min || 18, profile.age_range_max || 50],
              maxDistance: profile.max_distance || 50,
              interestedIn: profile.interested_in || [],
              lookingFor: profile.looking_for || 'both',
            },
          };
        })
      );

      setPotentialMatches(fullProfiles);
    } catch (error) {
      console.error('Error fetching potential matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeUser = async (likedUserId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: likedUserId,
          action: 'like',
        });

      // Move to next match
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const passUser = async (passedUserId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: passedUserId,
          action: 'pass',
        });

      // Move to next match
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error passing user:', error);
    }
  };

  const superLikeUser = async (likedUserId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: likedUserId,
          action: 'super_like',
        });

      // Move to next match
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error super liking user:', error);
    }
  };

  useEffect(() => {
    fetchPotentialMatches();
  }, [user]);

  // Fetch more matches when running low
  useEffect(() => {
    if (currentIndex >= potentialMatches.length - 3) {
      fetchPotentialMatches();
    }
  }, [currentIndex, potentialMatches.length]);

  return {
    potentialMatches,
    currentMatch: potentialMatches[currentIndex] || null,
    loading,
    likeUser,
    passUser,
    superLikeUser,
    hasMoreMatches: currentIndex < potentialMatches.length,
    refreshMatches: fetchPotentialMatches,
  };
};