import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Navigation, Flag } from 'lucide-react-native';
import { Participant, Location } from '@/stores/room-store';
import { User } from '@/stores/user-store';

interface MapViewProps {
  participants: Participant[];
  destination?: Location;
  currentUser?: User | null;
  onDestinationPress?: () => void;
}

const { width, height } = Dimensions.get('window');

// Simple map colors for different participants
const participantColors = [
  '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', 
  '#c2410c', '#0891b2', '#be123c', '#4338ca', '#059669'
];

export const MapView: React.FC<MapViewProps> = ({
  participants,
  destination,
  currentUser,
  onDestinationPress,
}) => {
  // Calculate bounds to center the map around all participants
  const participantsWithLocation = participants.filter(p => p.location);
  
  let centerLat = 37.7749; // Default to San Francisco
  let centerLng = -122.4194;
  
  if (participantsWithLocation.length > 0) {
    const avgLat = participantsWithLocation.reduce((sum, p) => sum + p.location!.latitude, 0) / participantsWithLocation.length;
    const avgLng = participantsWithLocation.reduce((sum, p) => sum + p.location!.longitude, 0) / participantsWithLocation.length;
    centerLat = avgLat;
    centerLng = avgLng;
  }

  const getParticipantPosition = (participant: Participant) => {
    if (!participant.location) return null;
    
    // Simple projection for demo - in real app you'd use proper map projection
    const latRange = 0.01; // ~1km
    const lngRange = 0.01;
    
    const x = ((participant.location.longitude - centerLng + lngRange/2) / lngRange) * width;
    const y = ((centerLat - participant.location.latitude + latRange/2) / latRange) * (height * 0.6);
    
    return { x: Math.max(20, Math.min(width - 20, x)), y: Math.max(20, Math.min(height * 0.6 - 20, y)) };
  };

  const getDestinationPosition = () => {
    if (!destination) return null;
    
    const latRange = 0.01;
    const lngRange = 0.01;
    
    const x = ((destination.longitude - centerLng + lngRange/2) / lngRange) * width;
    const y = ((centerLat - destination.latitude + latRange/2) / latRange) * (height * 0.6);
    
    return { x: Math.max(20, Math.min(width - 20, x)), y: Math.max(20, Math.min(height * 0.6 - 20, y)) };
  };

  return (
    <View style={styles.container}>
      {/* Simple grid background to simulate map */}
      <View style={styles.mapBackground}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLine, { top: (i * height * 0.6) / 20 }]} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineVertical, { left: (i * width) / 20 }]} />
        ))}
      </View>

      {/* Participant markers */}
      {participants.map((participant, index) => {
        const position = getParticipantPosition(participant);
        if (!position) return null;

        const isCurrentUser = currentUser?.id === participant.id;
        const color = participantColors[index % participantColors.length];

        return (
          <View
            key={participant.id}
            style={[
              styles.participantMarker,
              {
                left: position.x - 20,
                top: position.y - 40,
                backgroundColor: color,
                borderColor: isCurrentUser ? '#fbbf24' : 'white',
                borderWidth: isCurrentUser ? 3 : 2,
              }
            ]}
          >
            <Navigation size={16} color="white" />
            <Text style={styles.participantName}>{participant.name}</Text>
            {!participant.isOnline && <View style={styles.offlineIndicator} />}
          </View>
        );
      })}

      {/* Destination marker */}
      {destination && (
        <TouchableOpacity
          style={[
            styles.destinationMarker,
            {
              left: getDestinationPosition()!.x - 20,
              top: getDestinationPosition()!.y - 40,
            }
          ]}
          onPress={onDestinationPress}
        >
          <Flag size={20} color="white" />
          <Text style={styles.destinationLabel}>Meeting Point</Text>
        </TouchableOpacity>
      )}

      {/* Map legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendItem}>
          <Navigation size={16} color="#2563eb" />
          <Text style={styles.legendText}>Participants</Text>
        </View>
        {destination && (
          <View style={styles.legendItem}>
            <Flag size={16} color="#dc2626" />
            <Text style={styles.legendText}>Meeting Point</Text>
          </View>
        )}
      </View>

      {/* Center coordinates display */}
      <View style={styles.coordinates}>
        <Text style={styles.coordinatesText}>
          {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  participantMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  participantName: {
    position: 'absolute',
    top: 45,
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
    textAlign: 'center',
  },
  offlineIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: 'white',
  },
  destinationMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  destinationLabel: {
    position: 'absolute',
    top: 45,
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  legend: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748b',
  },
  coordinates: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coordinatesText: {
    fontSize: 11,
    color: 'white',
    fontFamily: 'monospace',
  },
});