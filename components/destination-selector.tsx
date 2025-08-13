import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { X, MapPin, Search } from 'lucide-react-native';
import { Location } from '@/stores/room-store';

interface DestinationSelectorProps {
  onClose: () => void;
  onSelect: (destination: Location) => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');

  // Predefined popular locations for demo
  const popularLocations = [
    { name: 'Central Park, NYC', lat: 40.7829, lng: -73.9654 },
    { name: 'Golden Gate Bridge, SF', lat: 37.8199, lng: -122.4783 },
    { name: 'Times Square, NYC', lat: 40.7580, lng: -73.9855 },
    { name: 'Hollywood Sign, LA', lat: 34.1341, lng: -118.3215 },
    { name: 'Space Needle, Seattle', lat: 47.6205, lng: -122.3493 },
  ];

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (lat: number, lng: number) => {
    const destination: Location = {
      latitude: lat,
      longitude: lng,
      timestamp: Date.now(),
    };
    onSelect(destination);
  };

  const handleCustomLocation = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Invalid Coordinates', 'Please enter valid latitude and longitude values.');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Invalid Coordinates', 'Latitude must be between -90 and 90, longitude between -180 and 180.');
      return;
    }

    handleSelectLocation(lat, lng);
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
          <Text style={styles.title}>Set Meeting Point</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Search Popular Places</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for a place..."
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.locationsList}>
              {filteredLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(location.lat, location.lng)}
                >
                  <MapPin size={20} color="#2563eb" />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationCoords}>
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.customSection}>
            <Text style={styles.sectionTitle}>Custom Coordinates</Text>
            <View style={styles.coordinatesContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Latitude</Text>
                <TextInput
                  style={styles.coordinateInput}
                  value={customLat}
                  onChangeText={setCustomLat}
                  placeholder="37.7749"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Longitude</Text>
                <TextInput
                  style={styles.coordinateInput}
                  value={customLng}
                  onChangeText={setCustomLng}
                  placeholder="-122.4194"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.setButton} onPress={handleCustomLocation}>
              <MapPin size={20} color="white" />
              <Text style={styles.setButtonText}>Set Custom Location</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  searchSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  locationsList: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  locationCoords: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  customSection: {
    gap: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  coordinateInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontFamily: 'monospace',
  },
  setButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  setButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});