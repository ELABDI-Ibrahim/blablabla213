import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, Share } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Copy, Share2, MapPin, ArrowRight } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useRoom } from '@/stores/room-store';
import { generateRoomId } from '@/utils/room-utils';

export default function CreateRoomScreen() {
  const { createRoom } = useRoom();
  const [roomId] = useState(generateRoomId());
  const [isCreating, setIsCreating] = useState(false);
  
  const roomUrl = `https://your-app-domain.com/?roomId=${roomId}`;

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      await createRoom(roomId);
      router.replace(`/room/${roomId}`);
    } catch {
      Alert.alert('Error', 'Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(roomUrl);
    Alert.alert('Copied!', 'Room link copied to clipboard');
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join my location sharing room: ${roomUrl}`,
        url: roomUrl,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <MapPin size={48} color="white" />
            <Text style={styles.title}>Room Created!</Text>
            <Text style={styles.subtitle}>Share this link with friends to invite them to your location sharing room</Text>
          </View>

          <View style={styles.roomInfo}>
            <Text style={styles.roomIdLabel}>Room ID</Text>
            <Text style={styles.roomId}>{roomId}</Text>
            
            <View style={styles.linkContainer}>
              <Text style={styles.linkLabel}>Shareable Link</Text>
              <View style={styles.linkBox}>
                <Text style={styles.link} numberOfLines={2}>{roomUrl}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
                <Copy size={20} color="white" />
                <Text style={styles.actionButtonText}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShareLink}>
                <Share2 size={20} color="white" />
                <Text style={styles.actionButtonText}>Share Link</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.enterButton} 
              onPress={handleCreateRoom}
              disabled={isCreating}
            >
              <Text style={styles.enterButtonText}>
                {isCreating ? 'Creating Room...' : 'Enter Room'}
              </Text>
              <ArrowRight size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  roomInfo: {
    gap: 24,
  },
  roomIdLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  roomId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },
  linkContainer: {
    gap: 8,
  },
  linkLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  linkBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  link: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  enterButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  enterButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});