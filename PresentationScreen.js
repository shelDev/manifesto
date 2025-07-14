import React from 'react';
import { View, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { Text, Card, Button, Title, Paragraph, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { 
  DashboardScreenshot, 
  RecordingScreenshot, 
  BrowsingScreenshot, 
  AskJournalScreenshot, 
  InsightsScreenshot 
} from '../components/Screenshots';

const PresentationScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Journal App</Text>
        <Text style={styles.headerSubtitle}>Your thoughts, your journey</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Card style={styles.introCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Project Overview</Title>
            <Paragraph style={styles.paragraph}>
              Voice Journal is a functional, dynamic, bold, engaging mobile application that allows users to easily record their thoughts, emotions, notes, reminders, and memories through voice journaling. The app provides AI-driven insights to encourage self-reflection and transforms journal entries into an epic hero's journey narrative.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              The design is inspired by Superhuman.com but with a lighter aesthetic, featuring purple line-art style icons for a distinctive and engaging user interface.
            </Paragraph>
          </Card.Content>
        </Card>

        <Title style={styles.featuresTitle}>Key Features</Title>
        
        <Card style={styles.featureCard}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <Ionicons name="mic" size={24} color={theme.colors.primary} />
              <Text style={styles.featureTitle}>Voice Recording</Text>
            </View>
            <Paragraph style={styles.paragraph}>
              Easily capture your thoughts with voice recording and automatic transcription. The recording interface features a real-time waveform visualization and a "Calm Mode" for distraction-free journaling.
            </Paragraph>
            <RecordingScreenshot />
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <Ionicons name="analytics" size={24} color={theme.colors.primary} />
              <Text style={styles.featureTitle}>AI-Powered Analysis</Text>
            </View>
            <Paragraph style={styles.paragraph}>
              Get insights into your moods, topics, and emotional patterns. The app uses advanced sentiment analysis to identify emotional dimensions beyond basic moods, and sophisticated topic extraction to identify themes in your journaling.
            </Paragraph>
            <InsightsScreenshot />
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <Ionicons name="book" size={24} color={theme.colors.primary} />
              <Text style={styles.featureTitle}>Hero's Journey</Text>
            </View>
            <Paragraph style={styles.paragraph}>
              See your journal entries transformed into an epic narrative where you're the hero. The app analyzes your entries over time and creates a compelling story of your personal development, with chapters and key moments highlighted.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
              <Text style={styles.featureTitle}>Natural Language Queries</Text>
            </View>
            <Paragraph style={styles.paragraph}>
              Ask questions about your journal in plain language. The app uses natural language processing to understand your questions and provide relevant answers from your journal entries, with confidence indicators to show how certain the app is about its responses.
            </Paragraph>
            <AskJournalScreenshot />
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard}>
          <Card.Content>
            <View style={styles.featureHeader}>
              <Ionicons name="bulb" size={24} color={theme.colors.primary} />
              <Text style={styles.featureTitle}>Personalized Prompts</Text>
            </View>
            <Paragraph style={styles.paragraph}>
              Receive journal prompts tailored to your writing patterns and interests. The app analyzes your previous entries to generate prompts that are relevant to your life and encourage deeper self-reflection.
            </Paragraph>
            <DashboardScreenshot />
          </Card.Content>
        </Card>

        <Title style={styles.techTitle}>Technical Implementation</Title>
        
        <Card style={styles.techCard}>
          <Card.Content>
            <Title style={styles.techSectionTitle}>Frontend</Title>
            <View style={styles.techItem}>
              <Text style={styles.techName}>React Native with Expo</Text>
              <Text style={styles.techDescription}>For cross-platform mobile development</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>React Navigation</Text>
              <Text style={styles.techDescription}>For screen navigation</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>React Native Paper</Text>
              <Text style={styles.techDescription}>For UI components</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>Styled Components</Text>
              <Text style={styles.techDescription}>For styling</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.techCard}>
          <Card.Content>
            <Title style={styles.techSectionTitle}>Core Utilities</Title>
            <View style={styles.techItem}>
              <Text style={styles.techName}>audioUtils.js</Text>
              <Text style={styles.techDescription}>Handles voice recording, playback, and waveform visualization</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>storage.js</Text>
              <Text style={styles.techDescription}>Manages journal entry storage, retrieval, and filtering</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>aiUtils.js</Text>
              <Text style={styles.techDescription}>Provides basic AI-driven mood analysis and tag generation</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.techItem}>
              <Text style={styles.techName}>advancedAiUtils.js</Text>
              <Text style={styles.techDescription}>Implements sophisticated AI features like advanced sentiment analysis, topic extraction, and narrative generation</Text>
            </View>
          </Card.Content>
        </Card>

        <Title style={styles.conclusionTitle}>Conclusion</Title>
        
        <Card style={styles.conclusionCard}>
          <Card.Content>
            <Paragraph style={styles.paragraph}>
              Voice Journal is a powerful tool for self-reflection and personal growth. By combining the ease of voice recording with sophisticated AI analysis, it provides users with valuable insights into their thoughts, feelings, and patterns over time.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              The hero's journey narrative feature transforms everyday journaling into an epic story of personal development, encouraging continued use and deeper self-understanding.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              All requirements from the "Manifesto" goal have been successfully implemented, creating a functional, dynamic, bold, and engaging mobile application for voice journaling with AI-driven insights.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonsContainer}>
          <Button 
            mode="contained" 
            style={styles.documentationButton}
            onPress={() => {}}
          >
            View Documentation
          </Button>
          <Button 
            mode="contained" 
            style={styles.codeButton}
            onPress={() => {}}
          >
            View Source Code
          </Button>
        </View>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  introCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    marginBottom: theme.spacing.md,
  },
  paragraph: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.relaxed,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  featureCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  techTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  techCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  techSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    marginBottom: theme.spacing.md,
  },
  techItem: {
    paddingVertical: theme.spacing.sm,
  },
  techName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  techDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  divider: {
    backgroundColor: theme.colors.border,
  },
  conclusionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  conclusionCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  documentationButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  codeButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.accent1,
  },
  footer: {
    height: theme.spacing.xxl,
  },
});

export default PresentationScreen;
