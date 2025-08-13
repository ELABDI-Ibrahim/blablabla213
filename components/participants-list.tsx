import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, Navigation, Clock, Wifi, WifiOff } from 'lucide-react-native';
import { Participant } from '@/stores/room-store';

interface ParticipantsListProps {
  participants: Participant[];
  onClose: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onClose,
}) => {
  const formatLastSeen = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Participants ({participants.length})</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <View style={styles.participantInfo}>
                <View style={styles.participantHeader}>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  <View style={styles.statusIndicator}>
                    {participant.isOnline ? (
                      <Wifi size={16} color="#10b981" />
                    ) : (
                      <WifiOff size={16} color="#ef4444" />
                    )}
                  </View>
                </View>
                
                <View style={styles.participantDetails}>
                  {participant.location ? (
                    <View style={styles.locationInfo}>
                      <Navigation size={14} color="#10b981" />
                      <Text style={styles.locationText}>
                        Location shared • {formatLastSeen(participant.location.timestamp)}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.locationInfo}>
                      <Navigation size={14} color="#ef4444" />
                      <Text style={styles.noLocationText}>Location not shared</Text>
                    </View>
                  )}
                  
                  <View style={styles.lastSeenInfo}>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.lastSeenText}>
                      Last seen {formatLastSeen(participant.lastSeen)}
                    </Text>
                  </View>
                </View>
              </View>

              {participant.location && (
                <View style={styles.coordinates}>
                  <Text style={styles.coordinatesText}>
                    {participant.location.latitude.toFixed(4)}, {participant.location.longitude.toFixed(4)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  participantItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  participantInfo: {
    gap: 8,
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusIndicator: {
    padding: 4,
  },
  participantDetails: {
    gap: 6,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#10b981',
  },
  noLocationText: {
    fontSize: 14,
    color: '#ef4444',
  },
  lastSeenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastSeenText: {
    fontSize: 12,
    color: '#64748b',
  },
  coordinates: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});