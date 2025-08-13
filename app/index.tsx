import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Users, Plus } from 'lucide-react-native';
import { useUser } from '@/stores/user-store';

export default function HomeScreen() {
  const { roomId } = useLocalSearchParams();
  const { user, setUserName } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [isJoining] = useState(!!roomId);

  useEffect(() => {
    if (roomId && user?.name) {
      router.replace(`/room/${roomId}`);
    }
  }, [roomId, user?.name]);

  const handleSetName = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your display name to continue.');
      return;
    }
    
    setUserName(name.trim());
    
    if (roomId) {
      router.replace(`/room/${roomId}`);
    }
  };

  const handleCreateRoom = () => {
    if (!user?.name) {
      Alert.alert('Name Required', 'Please enter your display name first.');
      return;
    }
    router.push('/create-room');
  };

  if (user?.name && !roomId) {
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
              <Text style={styles.title}>MeetUp</Text>
              <Text style={styles.subtitle}>Share your location and coordinate meetups with friends</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateRoom}>
                <Plus size={24} color="white" />
                <Text style={styles.primaryButtonText}>Create Room</Text>
              </TouchableOpacity>

              <View style={styles.welcomeBack}>
                <Users size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>MeetUp</Text>
            <Text style={styles.subtitle}>
              {isJoining 
                ? 'Enter your name to join the room' 
                : 'Share your location and coordinate meetups with friends'
              }
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your Display Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="rgba(0,0,0,0.5)"
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSetName}
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleSetName}>
              <Text style={styles.primaryButtonText}>
                {isJoining ? 'Join Room' : 'Continue'}
              </Text>
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
    fontSize: 32,
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
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  primaryButton: {
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
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    gap: 24,
  },
  welcomeBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
});