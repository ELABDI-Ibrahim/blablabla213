import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface User {
  name: string;
  id: string;
}

const USER_STORAGE_KEY = 'meetup_user';

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserName = useCallback(async (name: string) => {
    const newUser: User = {
      name,
      id: Math.random().toString(36).substring(2, 15),
    };
    
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.log('Error saving user:', error);
    }
  }, []);

  const clearUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.log('Error clearing user:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    setUserName,
    clearUser,
  }), [user, isLoading, setUserName, clearUser]);
});