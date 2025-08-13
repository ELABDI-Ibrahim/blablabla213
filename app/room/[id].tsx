import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MapPin, Users, Navigation, RefreshCw } from 'lucide-react-native';
import { useRoom } from '@/stores/room-store';
import { useUser } from '@/stores/user-store';
import { useLocation } from '@/hooks/use-location';
import { MapView } from '@/components/map-view';
import { ParticipantsList } from '@/components/participants-list';
import { DestinationSelector } from '@/components/destination-selector';

export default function RoomScreen() {
  const { id } = useLocalSearchParams();
  const roomId = Array.isArray(id) ? id[0] : id;
  const { user } = useUser();
  const { room, joinRoom, updateUserLocation, isOwner } = useRoom();
  const { location, requestPermission, refreshLocation, isLoading } = useLocation();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);

  useEffect(() => {
    if (!user?.name) {
      router.replace(`/?roomId=${roomId}`);
      return;
    }

    if (roomId) {
      joinRoom(roomId);
    }
  }, [roomId, user?.name, joinRoom]);

  useEffect(() => {
    if (location) {
      updateUserLocation(location);
    }
  }, [location, updateUserLocation]);

  const handleLocationPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Location Required',
        'Location access is required to share your position with other participants.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: requestPermission }
        ]
      );
    }
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <MapPin size={48} color="#2563eb" />
          <Text style={styles.loadingText}>Joining room...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MapPin size={24} color="#2563eb" />
          <Text style={styles.roomTitle}>Room {room.id}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowParticipants(!showParticipants)}
          >
            <Users size={20} color="#2563eb" />
            <Text style={styles.participantCount}>{room.participants.length}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={refreshLocation}
            disabled={isLoading}
          >
            <RefreshCw size={20} color={isLoading ? "#9ca3af" : "#2563eb"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView 
          participants={room.participants}
          destination={room.destination}
          currentUser={user}
          onDestinationPress={isOwner ? () => setShowDestinationSelector(true) : undefined}
        />
        
        {!location && (
          <View style={styles.locationPrompt}>
            <Navigation size={24} color="#f59e0b" />
            <Text style={styles.locationPromptText}>Enable location to share your position</Text>
            <TouchableOpacity style={styles.enableButton} onPress={handleLocationPermission}>
              <Text style={styles.enableButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {isOwner && !room.destination && (
          <TouchableOpacity 
            style={styles.setDestinationButton}
            onPress={() => setShowDestinationSelector(true)}
          >
            <MapPin size={20} color="white" />
            <Text style={styles.setDestinationText}>Set Meeting Point</Text>
          </TouchableOpacity>
        )}
      </View>

      {showParticipants && (
        <ParticipantsList 
          participants={room.participants}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {showDestinationSelector && isOwner && (
        <DestinationSelector
          onClose={() => setShowDestinationSelector(false)}
          onSelect={(destination) => {
            // This would update the room destination
            setShowDestinationSelector(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  participantCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  locationPrompt: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationPromptText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  enableButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  enableButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  setDestinationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  setDestinationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});