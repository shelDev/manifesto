import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const RecordingScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [calmModeActive, setCalmModeActive] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic would go here
      setRecordingTime(0);
    } else {
      // Stop recording logic would go here
      // Navigate to review screen or save entry
    }
  };

  const toggleCalmMode = () => {
    setCalmModeActive(!calmModeActive);
  };

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
        />
        <Text style={styles.headerTitle}>Voice Journal</Text>
        <IconButton
          icon={calmModeActive ? "water" : "water-outline"}
          size={24}
          color={calmModeActive ? theme.colors.accent1 : theme.colors.text}
          onPress={toggleCalmMode}
        />
      </View>

      <View style={styles.waveformContainer}>
        {isRecording ? (
          <View style={styles.waveformVisualization}>
            {/* Waveform visualization would be implemented here */}
            {Array.from({ length: 30 }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.waveformBar,
                  { 
                    height: 20 + Math.random() * 60,
                    backgroundColor: theme.colors.primary
                  }
                ]} 
              />
            ))}
          </View>
        ) : (
          <View style={styles.waveformPlaceholder}>
            <Text style={styles.waveformPlaceholderText}>
              Tap the microphone button to start recording
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
            isRecording ? styles.recordingActive : {}
          ]}
          onPress={toggleRecording}
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

      {calmModeActive && (
        <View style={styles.calmModeControls}>
          <Text style={styles.calmModeTitle}>Calm Mode</Text>
          <View style={styles.soundOptions}>
            <Button 
              mode="outlined" 
              style={[styles.soundButton, styles.soundButtonActive]} 
              labelStyle={styles.soundButtonLabel}
            >
              Rain
            </Button>
            <Button 
              mode="outlined" 
              style={styles.soundButton} 
              labelStyle={styles.soundButtonLabel}
            >
              Ocean
            </Button>
            <Button 
              mode="outlined" 
              style={styles.soundButton} 
              labelStyle={styles.soundButtonLabel}
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

export default RecordingScreen;
