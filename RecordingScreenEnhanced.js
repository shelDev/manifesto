import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, IconButton, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { saveJournalEntry } from '../utils/storage';
import { recordAudio, stopRecording, getAudioWaveform } from '../utils/audioUtils';
import { analyzeMood, generateTags } from '../utils/aiUtils';
import { advancedSentimentAnalysis, extractTopicsAndThemes } from '../utils/advancedAiUtils';

// Mock waveform component - in a real app, we would use a library for visualization
const WaveformVisualizer = ({ waveform, isRecording }) => {
  return (
    <View style={styles.waveformContainer}>
      {waveform.map((value, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: value * 50,
              backgroundColor: isRecording
                ? theme.colors.primary
                : theme.colors.primaryLight,
            },
          ]}
        />
      ))}
    </View>
  );
};

const RecordingScreenEnhanced = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState(null);
  const [waveform, setWaveform] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState(null);
  const [topicsAndThemes, setTopicsAndThemes] = useState(null);
  const [calmMode, setCalmMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (isRecording) {
        stopRecordingAudio();
      }
    };
  }, [isRecording, recordingTimer]);

  // Start recording
  const startRecordingAudio = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      setWaveform([]);
      setTranscription('');
      setMoodAnalysis(null);
      setAdvancedAnalysis(null);
      setTopicsAndThemes(null);

      // Start recording
      const uri = await recordAudio();
      setRecordingUri(uri);

      // Start timer
      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
        
        // Generate random waveform data for visualization
        if (waveform.length < 50) {
          setWaveform((prev) => [
            ...prev,
            Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
          ]);
        } else {
          setWaveform((prev) => [
            ...prev.slice(1),
            Math.random() * 0.5 + 0.5,
          ]);
        }
      }, 1000);
      
      setRecordingTimer(timer);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecordingAudio = async () => {
    try {
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }

      setIsRecording(false);
      setIsProcessing(true);

      // Stop recording
      await stopRecording();

      // Mock transcription - in a real app, we would use a speech-to-text service
      const mockTranscription = generateMockTranscription(recordingDuration);
      setTranscription(mockTranscription);

      // Basic mood analysis
      const mood = analyzeMood(mockTranscription);
      setMoodAnalysis(mood);

      // Advanced sentiment analysis
      const advancedMood = await advancedSentimentAnalysis(mockTranscription);
      setAdvancedAnalysis(advancedMood);

      // Extract topics and themes
      const topics = await extractTopicsAndThemes(mockTranscription);
      setTopicsAndThemes(topics);

      setIsProcessing(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  // Generate mock transcription
  const generateMockTranscription = (duration) => {
    const sentences = [
      "Today was a really productive day at work.",
      "I managed to complete the project ahead of schedule.",
      "I'm feeling quite proud of what I accomplished.",
      "The team was very supportive and helped me overcome some challenges.",
      "I'm looking forward to starting the new project tomorrow.",
      "I had a great conversation with my friend about our future plans.",
      "The weather was beautiful today, which lifted my mood.",
      "I'm grateful for the small moments of joy throughout the day.",
      "I need to remember to take breaks and not overwork myself.",
      "Overall, I feel optimistic about the direction things are going."
    ];

    // Select a number of sentences based on recording duration
    const numSentences = Math.min(Math.max(Math.floor(duration / 3), 1), sentences.length);
    return sentences.slice(0, numSentences).join(" ");
  };

  // Save journal entry
  const saveEntry = async () => {
    try {
      setIsSaving(true);

      // Create journal entry object
      const entry = {
        id: Date.now().toString(),
        title: `Journal Entry - ${new Date().toLocaleDateString()}`,
        content: transcription,
        audioUri: recordingUri,
        createdAt: new Date().toISOString(),
        mood: moodAnalysis ? moodAnalysis.primaryMood : 'Neutral',
        intensity: moodAnalysis ? moodAnalysis.intensity : 0.5,
        tags: topicsAndThemes ? topicsAndThemes.topics : generateTags(transcription),
        themes: topicsAndThemes ? topicsAndThemes.themes : [],
        emotionalDimensions: advancedAnalysis ? advancedAnalysis.emotionalDimensions : null,
        keyPhrases: topicsAndThemes ? topicsAndThemes.keyPhrases : []
      };

      // Save entry
      await saveJournalEntry(entry);

      // Show success message
      Alert.alert(
        'Success',
        'Your journal entry has been saved!',
        [
          {
            text: 'View Entries',
            onPress: () => navigation.navigate('Browse'),
          },
          {
            text: 'New Entry',
            onPress: () => {
              setRecordingUri(null);
              setWaveform([]);
              setTranscription('');
              setMoodAnalysis(null);
              setAdvancedAnalysis(null);
              setTopicsAndThemes(null);
              setRecordingDuration(0);
            },
          },
        ]
      );

      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save entry', error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
      setIsSaving(false);
    }
  };

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render emotional dimensions
  const renderEmotionalDimensions = () => {
    if (!advancedAnalysis || !advancedAnalysis.emotionalDimensions) return null;

    const dimensions = advancedAnalysis.emotionalDimensions;
    const sortedDimensions = Object.entries(dimensions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Show top 4 emotions

    return (
      <View style={styles.emotionalDimensions}>
        {sortedDimensions.map(([emotion, value], index) => (
          <View key={emotion} style={styles.emotionItem}>
            <Text style={styles.emotionLabel}>{emotion}</Text>
            <View style={styles.emotionBarContainer}>
              <View
                style={[
                  styles.emotionBar,
                  {
                    width: `${value * 100}%`,
                    backgroundColor: index === 0 ? theme.colors.primary :
                                    index === 1 ? theme.colors.accent1 :
                                    index === 2 ? theme.colors.accent2 :
                                    theme.colors.textLight
                  }
                ]}
              />
            </View>
            <Text style={styles.emotionValue}>{Math.round(value * 100)}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, calmMode && styles.calmModeContainer]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={calmMode ? 'white' : theme.colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, calmMode && styles.calmModeText]}>
          {isRecording ? 'Recording...' : 'Voice Journal'}
        </Text>
        <IconButton
          icon={calmMode ? "sunny-outline" : "moon-outline"}
          size={24}
          color={calmMode ? 'white' : theme.colors.text}
          onPress={() => setCalmMode(!calmMode)}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.recordingSection}>
          {isRecording ? (
            <>
              <Text style={[styles.recordingDuration, calmMode && styles.calmModeText]}>
                {formatDuration(recordingDuration)}
              </Text>
              <WaveformVisualizer waveform={waveform} isRecording={isRecording} />
              <Text style={[styles.recordingHint, calmMode && styles.calmModeText]}>
                Speak naturally about your thoughts and feelings...
              </Text>
              <Button
                mode="contained"
                icon="stop"
                onPress={stopRecordingAudio}
                style={[styles.recordingButton, styles.stopButton]}
                labelStyle={styles.recordingButtonLabel}
              >
                Stop Recording
              </Button>
            </>
          ) : isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.processingText, calmMode && styles.calmModeText]}>
                Processing your journal entry...
              </Text>
            </View>
          ) : transcription ? (
            <Card style={styles.transcriptionCard}>
              <Card.Content>
                <Title style={styles.transcriptionTitle}>Your Journal Entry</Title>
                <Paragraph style={styles.transcriptionText}>{transcription}</Paragraph>
              </Card.Content>
            </Card>
          ) : (
            <>
              <View style={styles.emptyRecordingState}>
                <Ionicons
                  name="mic-outline"
                  size={64}
                  color={calmMode ? 'white' : theme.colors.textLight}
                />
                <Text style={[styles.emptyRecordingText, calmMode && styles.calmModeText]}>
                  Tap the button below to start recording your thoughts
                </Text>
              </View>
              <Button
                mode="contained"
                icon="mic"
                onPress={startRecordingAudio}
                style={styles.recordingButton}
                labelStyle={styles.recordingButtonLabel}
              >
                Start Recording
              </Button>
            </>
          )}
        </View>

        {advancedAnalysis && (
          <Card style={styles.analysisCard}>
            <Card.Content>
              <Title style={styles.analysisTitle}>Mood Analysis</Title>
              <View style={styles.moodContainer}>
                <View style={styles.primaryMood}>
                  <Text style={styles.primaryMoodLabel}>Primary Mood</Text>
                  <View
                    style={[
                      styles.moodBadge,
                      {
                        backgroundColor:
                          advancedAnalysis.primaryMood === 'Happy' || 
                          advancedAnalysis.primaryMood === 'Excited' ||
                          advancedAnalysis.primaryMood === 'Optimistic'
                            ? theme.colors.success
                            : advancedAnalysis.primaryMood === 'Anxious' ||
                              advancedAnalysis.primaryMood === 'Stressed' ||
                              advancedAnalysis.primaryMood === 'Frustrated'
                            ? theme.colors.error
                            : theme.colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.moodBadgeText}>
                      {advancedAnalysis.primaryMood}
                    </Text>
                  </View>
                </View>
                <View style={styles.sentimentScore}>
                  <Text style={styles.sentimentScoreLabel}>Sentiment</Text>
                  <View
                    style={[
                      styles.sentimentBadge,
                      {
                        backgroundColor:
                          advancedAnalysis.sentimentScore > 0.2
                            ? theme.colors.success
                            : advancedAnalysis.sentimentScore < -0.2
                            ? theme.colors.error
                            : theme.colors.accent1,
                      },
                    ]}
                  >
                    <Text style={styles.sentimentBadgeText}>
                      {advancedAnalysis.sentimentScore > 0.2
                        ? 'Positive'
                        : advancedAnalysis.sentimentScore < -0.2
                        ? 'Negative'
                        : 'Neutral'}
                    </Text>
                  </View>
                </View>
              </View>

              {renderEmotionalDimensions()}

              {advancedAnalysis.insights && advancedAnalysis.insights.length > 0 && (
                <View style={styles.insightsContainer}>
                  <Text style={styles.insightsTitle}>Emotional Insights</Text>
                  {advancedAnalysis.insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons
                        name="bulb-outline"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {topicsAndThemes && (
          <Card style={styles.topicsCard}>
            <Card.Content>
              <Title style={styles.topicsTitle}>Topics & Themes</Title>
              
              {topicsAndThemes.topics && topicsAndThemes.topics.length > 0 && (
                <View style={styles.topicsContainer}>
                  <Text style={styles.topicsLabel}>Topics Mentioned</Text>
                  <View style={styles.topicTags}>
                    {topicsAndThemes.topics.map((topic, index) => (
                      <View key={index} style={styles.topicTag}>
                        <Text style={styles.topicTagText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {topicsAndThemes.themes && topicsAndThemes.themes.length > 0 && (
                <View style={
(Content truncated due to size limit. Use line ranges to read in chunks)