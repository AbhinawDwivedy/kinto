import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const { updateLocation } = useAuth();
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          error: null,
          loading: false,
        });

        // Update location in database
        try {
          await updateLocation(latitude, longitude);
        } catch (error) {
          console.error('Failed to update location:', error);
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const watchLocation = () => {
    if (!navigator.geolocation) return null;

    return navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(prev => ({
          ...prev,
          latitude,
          longitude,
          error: null,
        }));

        try {
          await updateLocation(latitude, longitude);
        } catch (error) {
          console.error('Failed to update location:', error);
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          error: error.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
    const watchId = watchLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return {
    ...location,
    getCurrentLocation,
    watchLocation,
  };
};