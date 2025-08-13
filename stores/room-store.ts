import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { useUser } from './user-store';

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Participant {
  id: string;
  name: string;
  location?: Location;
  isOnline: boolean;
  lastSeen: number;
}

export interface Room {
  id: string;
  ownerId: string;
  participants: Participant[];
  destination?: Location;
  createdAt: number;
}

export const [RoomProvider, useRoom] = createContextHook(() => {
  const [room, setRoom] = useState<Room | null>(null);
  const { user } = useUser();

  const createRoom = useCallback(async (roomId: string) => {
    if (!user) throw new Error('User not found');

    const newRoom: Room = {
      id: roomId,
      ownerId: user.id,
      participants: [{
        id: user.id,
        name: user.name,
        isOnline: true,
        lastSeen: Date.now(),
      }],
      createdAt: Date.now(),
    };

    setRoom(newRoom);
    console.log('Room created:', newRoom);
  }, [user]);

  const joinRoom = useCallback(async (roomId: string) => {
    if (!user) return;

    setRoom(currentRoom => {
      // In a real app, this would fetch the room from a server
      // For now, we'll simulate joining a room
      const existingRoom = currentRoom?.id === roomId ? currentRoom : null;
      
      if (existingRoom) {
        // Update existing room with current user
        const updatedParticipants = existingRoom.participants.filter(p => p.id !== user.id);
        updatedParticipants.push({
          id: user.id,
          name: user.name,
          isOnline: true,
          lastSeen: Date.now(),
        });

        return {
          ...existingRoom,
          participants: updatedParticipants,
        };
      } else {
        // Create new room if it doesn't exist (for demo purposes)
        const newRoom: Room = {
          id: roomId,
          ownerId: user.id,
          participants: [{
            id: user.id,
            name: user.name,
            isOnline: true,
            lastSeen: Date.now(),
          }],
          createdAt: Date.now(),
        };
        return newRoom;
      }
    });

    console.log('Joined room:', roomId);
  }, [user]);

  const updateUserLocation = useCallback((location: Location) => {
    if (!user) return;

    setRoom(currentRoom => {
      if (!currentRoom) return currentRoom;

      const updatedParticipants = currentRoom.participants.map(participant => {
        if (participant.id === user.id) {
          return {
            ...participant,
            location,
            lastSeen: Date.now(),
          };
        }
        return participant;
      });

      return {
        ...currentRoom,
        participants: updatedParticipants,
      };
    });

    console.log('Location updated:', location);
  }, [user]);

  const setDestination = useCallback((destination: Location) => {
    if (!user) return;

    setRoom(currentRoom => {
      if (!currentRoom || currentRoom.ownerId !== user.id) return currentRoom;

      return {
        ...currentRoom,
        destination,
      };
    });

    console.log('Destination set:', destination);
  }, [user]);

  const leaveRoom = useCallback(() => {
    setRoom(null);
  }, []);

  const isOwner = room && user ? room.ownerId === user.id : false;

  return useMemo(() => ({
    room,
    createRoom,
    joinRoom,
    updateUserLocation,
    setDestination,
    leaveRoom,
    isOwner,
  }), [room, createRoom, joinRoom, updateUserLocation, setDestination, leaveRoom, isOwner]);
});