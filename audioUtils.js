import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

/**
 * Utility functions for audio recording, playback, and transcription
 */

// Directory for storing audio recordings
const RECORDINGS_DIRECTORY = `${FileSystem.documentDirectory}recordings/`;

// Ensure recordings directory exists
const ensureDirectoryExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(RECORDINGS_DIRECTORY, { intermediates: true });
  }
};

/**
 * Start a new voice recording
 * @returns {Object} recording object
 */
export const startRecording = async () => {
  try {
    // Ensure we have permissions
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access microphone was denied');
    }

    // Ensure directory exists
    await ensureDirectoryExists();

    // Set audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    // Create recording object
    const recording = new Audio.Recording();
    
    // Prepare recording
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    
    // Start recording
    await recording.startAsync();
    
    return recording;
  } catch (error) {
    console.error('Failed to start recording', error);
    throw error;
  }
};

/**
 * Stop the current recording and save the file
 * @param {Object} recording - The recording object
 * @returns {Object} - Information about the saved recording
 */
export const stopRecording = async (recording) => {
  try {
    // Stop recording
    await recording.stopAndUnloadAsync();
    
    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
    
    // Get recording URI
    const uri = recording.getURI();
    
    // Generate a unique filename with timestamp
    const filename = `recording-${Date.now()}.m4a`;
    const fileUri = `${RECORDINGS_DIRECTORY}${filename}`;
    
    // Move the recording to our app directory
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });
    
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    return {
      uri: fileUri,
      filename,
      size: fileInfo.size,
      duration: recording.durationMillis,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Failed to stop recording', error);
    throw error;
  }
};

/**
 * Play an audio recording
 * @param {string} uri - URI of the recording to play
 * @returns {Object} - Sound object
 */
export const playRecording = async (uri) => {
  try {
    // Load the sound
    const { sound } = await Audio.Sound.createAsync({ uri });
    
    // Play the sound
    await sound.playAsync();
    
    return sound;
  } catch (error) {
    console.error('Failed to play recording', error);
    throw error;
  }
};

/**
 * Stop playing an audio recording
 * @param {Object} sound - Sound object
 */
export const stopPlayback = async (sound) => {
  try {
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch (error) {
    console.error('Failed to stop playback', error);
    throw error;
  }
};

/**
 * Delete a recording
 * @param {string} uri - URI of the recording to delete
 */
export const deleteRecording = async (uri) => {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error('Failed to delete recording', error);
    throw error;
  }
};

/**
 * Get all saved recordings
 * @returns {Array} - Array of recording objects
 */
export const getRecordings = async () => {
  try {
    // Ensure directory exists
    await ensureDirectoryExists();
    
    // Get all files in the recordings directory
    const files = await FileSystem.readDirectoryAsync(RECORDINGS_DIRECTORY);
    
    // Filter for audio files and get info for each
    const recordings = await Promise.all(
      files
        .filter(filename => filename.endsWith('.m4a'))
        .map(async (filename) => {
          const uri = `${RECORDINGS_DIRECTORY}${filename}`;
          const fileInfo = await FileSystem.getInfoAsync(uri);
          
          // Extract timestamp from filename (if available)
          const timestampMatch = filename.match(/recording-(\d+)\.m4a/);
          const timestamp = timestampMatch ? parseInt(timestampMatch[1]) : 0;
          
          return {
            uri,
            filename,
            size: fileInfo.size,
            timestamp,
          };
        })
    );
    
    // Sort by timestamp (newest first)
    return recordings.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get recordings', error);
    return [];
  }
};

/**
 * Transcribe audio to text (mock implementation)
 * In a real app, this would connect to a speech-to-text service
 * @param {string} uri - URI of the recording to transcribe
 * @returns {string} - Transcribed text
 */
export const transcribeAudio = async (uri) => {
  try {
    // This is a mock implementation
    // In a real app, you would send the audio to a speech-to-text service
    
    // For demo purposes, we'll return a mock transcription after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random transcription for demo purposes
        const mockTranscriptions = [
          "Today I'm feeling really productive. I managed to complete most of my tasks and I'm looking forward to the weekend.",
          "I've been thinking about that new project idea. It seems promising but I need to do more research before committing to it.",
          "Had a great conversation with my friend today. We talked about our future plans and it was really inspiring.",
          "Feeling a bit stressed about the upcoming deadline. I need to manage my time better to ensure everything gets done.",
          "Today was a good day. The weather was nice and I took some time to go for a walk in the park."
        ];
        
        const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
        resolve(mockTranscriptions[randomIndex]);
      }, 2000); // Simulate processing delay
    });
  } catch (error) {
    console.error('Failed to transcribe audio', error);
    throw error;
  }
};

/**
 * Get audio waveform data (mock implementation)
 * In a real app, this would analyze the audio file
 * @param {Object} recording - Recording object or URI
 * @returns {Array} - Array of amplitude values
 */
export const getWaveformData = (recording) => {
  // This is a mock implementation
  // In a real app, you would analyze the audio file to get actual waveform data
  
  // Generate random waveform data for visualization
  const numPoints = 50;
  const waveformData = [];
  
  for (let i = 0; i < numPoints; i++) {
    // Generate random amplitude between 0.1 and 1.0
    const amplitude = 0.1 + Math.random() * 0.9;
    waveformData.push(amplitude);
  }
  
  return waveformData;
};

/**
 * Text-to-speech function to read journal entries aloud
 * @param {string} text - Text to be spoken
 */
export const speakText = async (text) => {
  try {
    await Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  } catch (error) {
    console.error('Failed to speak text', error);
    throw error;
  }
};

/**
 * Stop text-to-speech
 */
export const stopSpeaking = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Failed to stop speaking', error);
    throw error;
  }
};
