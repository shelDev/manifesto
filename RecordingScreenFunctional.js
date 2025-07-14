import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Surface, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import theme from '../theme';
import { startRecording, stopRecording, getWaveformData } from '../utils/audioUtils';
import { saveJournalEntry } from '../utils/storage';
import { analyzeMood, generateTags } from '../utils/aiUtils';

const RecordingScreenFunctional = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [calmModeActive, setCalmModeActive] = useState(false);
  const [waveformData, setWaveformData] = useState([]);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calmSound, setCalmSound] = useState(null);
  const [selectedCalmSound, setSelectedCalmSound] = useState('rain');
  
  const timerRef = useRef(null);
  
  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecordingProcess = async () => {
    try {
      const recording = await startRecording();
      setRecordingInstance(recording);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // Update waveform data every second
        setWaveformData(getWaveformData());
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording. Please check microphone permissions.');
    }
  };

  // Stop recording
  const stopRecordingProcess = async () => {
    try {
      if (!recordingInstance) return;
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsProcessing(true);
      
      // Stop recording
      const recordingData = await stopRecording(recordingInstance);
      setRecordingInstance(null);
      setIsRecording(false);
      
      // Mock transcription (in a real app, this would use a speech-to-text service)
      const transcriptionText = await new Promise(resolve => {
        setTimeout(() => {
          const mockTranscriptions = [
            "Today I'm feeling really productive. I managed to complete most of my tasks and I'm looking forward to the weekend.",
            "I've been thinking about that new project idea. It seems promising but I need to do more research before committing to it.",
            "Had a great conversation with my friend today. We talked about our future plans and it was really inspiring.",
            "Feeling a bit stressed about the upcoming deadline. I need to manage my time better to ensure everything gets done.",
            "Today was a good day. The weather was nice and I took some time to go for a walk in the park."
          ];
          
          const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
          resolve(mockTranscriptions[randomIndex]);
        }, 1500);
      });
      
      // Analyze mood and generate tags
      const moodAnalysis = analyzeMood(transcriptionText);
      const tags = generateTags(transcriptionText);
      
      // Create journal entry
      const entry = {
        title: `Voice Entry - ${new Date().toLocaleString()}`,
        content: transcriptionText,
        audioUri: recordingData.uri,
        duration: recordingData.duration,
        mood: moodAnalysis.primaryMood,
        tags: tags,
        createdAt: new Date().toISOString(),
      };
      
      // Save entry
      await saveJournalEntry(entry);
      
      setIsProcessing(false);
      
      // Navigate to dashboard
      navigation.navigate('Dashboard');
      
      // Show success message
      Alert.alert(
        'Entry Saved',
        'Your voice journal entry has been saved successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to stop recording', error);
      setIsProcessing(false);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to save recording. Please try again.');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecordingProcess();
    } else {
      startRecordingProcess();
    }
  };

  const toggleCalmMode = async () => {
    const newCalmModeState = !calmModeActive;
    setCalmModeActive(newCalmModeState);
    
    // Handle calm sounds
    if (newCalmModeState) {
      try {
        // Load and play calm sound
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/rain.mp3'),
          { isLooping: true }
        );
        setCalmSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error('Failed to play calm sound', error);
      }
    } else {
      // Stop calm sound
      if (calmSound) {
        await calmSound.stopAsync();
        await calmSound.unloadAsync();
        setCalmSound(null);
      }
    }
  };

  const selectCalmSound = async (soundName) => {
    setSelectedCalmSound(soundName);
    
    // Stop current sound if playing
    if (calmSound) {
      await calmSound.stopAsync();
      await calmSound.unloadAsync();
    }
    
    if (calmModeActive) {
      try {
        // Load and play new calm sound
        const soundFile = 
          soundName === 'rain' ? require('../assets/sounds/rain.mp3') :
          soundName === 'ocean' ? require('../assets/sounds/ocean.mp3') :
          require('../assets/sounds/forest.mp3');
          
        const { sound } = await Audio.Sound.createAsync(
          soundFile,
          { isLooping: true }
        );
        setCalmSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error('Failed to play calm sound', error);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Stop recording if active
      if (recordingInstance) {
        recordingInstance.stopAndUnloadAsync();
      }
      
      // Stop calm sound if playing
      if (calmSound) {
        calmSound.stopAsync();
        calmSound.unloadAsync();
      }
    };
  }, [recordingInstance, calmSound]);

  return (
    <View style={[
      styles.container, 
      calmModeActive ? styles.calmModeContainer : {}
    ]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
          disabled={isRecording || isProcessing}
        />
        <Text style={styles.headerTitle}>Voice Journal</Text>
        <IconButton
          icon={calmModeActive ? "water" : "water-outline"}
          size={24}
          color={calmModeActive ? theme.colors.accent1 : theme.colors.text}
          onPress={toggleCalmMode}
          disabled={isProcessing}
        />
      </View>

      <View style={styles.waveformContainer}>
        {isRecording ? (
          <View style={styles.waveformVisualization}>
            {waveformData.map((amplitude, index) => (
              <View 
                key={index} 
                style={[
                  styles.waveformBar,
                  { 
                    height: amplitude * 80,
                    backgroundColor: theme.colors.primary
                  }
                ]} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.waveformPlaceholder}>
            <Text style={styles.waveformPlaceholderText}>
              {isProcessing 
                ? "Processing your recording..." 
                : "Tap the microphone button to start recording"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {formatTime(recordingTime)}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[
            styles.recordButton,
            isRecording ? styles.recordingActive : {},
            isProcessing ? styles.recordingDisabled : {}
          ]}
          onPress={toggleRecording}
          disabled={isProcessing}
        >
          <Ionicons 
            name={isRecording ? "square" : "mic"} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {isRecording && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Speak naturally. Your voice will be transcribed automatically.
          </Text>
        </View>
      )}

      {isProcessing && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Processing your recording. This may take a moment...
          </Text>
        </View>
      )}

      {calmModeActive && (
        <View style={styles.calmModeControls}>
          <Text style={styles.calmModeTitle}>Calm Mode</Text>
          <View style={styles.soundOptions}>
            <Button 
              mode="outlined" 
              style={[
                styles.soundButton, 
                selectedCalmSound === 'rain' ? styles.soundButtonActive : {}
              ]} 
              labelStyle={styles.soundButtonLabel}
              onPress={() => selectCalmSound('rain')}
              disabled={isProcessing}
            >
              Rain
            </Button>
            <Button 
              mode="outlined" 
              style={[
                styles.soundButton, 
                selectedCalmSound === 'ocean' ? styles.soundButtonActive : {}
              ]} 
              labelStyle={styles.soundButtonLabel}
              onPress={() => selectCalmSound('ocean')}
              disabled={isProcessing}
            >
              Ocean
            </Button>
            <Button 
              mode="outlined" 
              style={[
                styles.soundButton, 
                selectedCalmSound === 'forest' ? styles.soundButtonActive : {}
              ]} 
              labelStyle={styles.soundButtonLabel}
              onPress={() => selectCalmSound('forest')}
              disabled={isProcessing}
            >
              Forest
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  calmModeContainer: {
    backgroundColor: '#E6F7F6', // Slight teal tint for calm mode
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  waveformVisualization: {
    width: '100%',
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveformBar: {
    width: 4,
    borderRadius: theme.borderRadius.sm,
  },
  waveformPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  waveformPlaceholderText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  timerText: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: theme.colors.error,
  },
  recordingDisabled: {
    backgroundColor: theme.colors.textLight,
  },
  hintContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  hintText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  calmModeControls: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
  },
  calmModeTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.accent1,
    marginBottom: theme.spacing.md,
  },
  soundOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  soundButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderColor: theme.colors.accent1,
  },
  soundButtonActive: {
    backgroundColor: 'rgba(56, 178, 172, 0.1)',
  },
  soundButtonLabel: {
    fontSize: theme.typography.fontSize.sm,
  },
});

export default RecordingScreenFunctional;
