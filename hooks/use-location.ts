import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (!hasPermission) return;

    setIsLoading(true);
    setError(null);

    try {
      // For web compatibility, handle location differently
      if (Platform.OS === 'web') {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: Date.now(),
              });
              setIsLoading(false);
            },
            (error) => {
              console.log('Web geolocation error:', error);
              setError('Failed to get location');
              setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
        } else {
          setError('Geolocation not supported');
          setIsLoading(false);
        }
      } else {
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.log('Error getting location:', err);
      setError('Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    if (hasPermission) {
      getCurrentLocation();
      // Set up periodic location updates
      const interval = setInterval(getCurrentLocation, 15000); // Every 15 seconds
      return () => clearInterval(interval);
    }
  }, [hasPermission, getCurrentLocation]);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (err) {
      console.log('Error checking location permission:', err);
      setError('Failed to check location permission');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (granted) {
        getCurrentLocation();
      }
      
      return granted;
    } catch (err) {
      console.log('Error requesting location permission:', err);
      setError('Failed to request location permission');
      return false;
    }
  };

  const refreshLocation = () => {
    getCurrentLocation();
  };

  return {
    location,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    refreshLocation,
  };
};