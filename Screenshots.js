import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import theme from '../theme';

// Mock screenshot component for demonstration purposes
const Screenshot = ({ name, description }) => {
  return (
    <View style={styles.screenshotContainer}>
      <View style={styles.mockScreenshot}>
        <Text style={styles.mockScreenshotText}>{name}</Text>
      </View>
      <Text style={styles.screenshotDescription}>{description}</Text>
    </View>
  );
};

const DashboardScreenshot = () => (
  <Screenshot 
    name="Dashboard" 
    description="Overview of journal activity, recent entries, and personalized prompts"
  />
);

const RecordingScreenshot = () => (
  <Screenshot 
    name="Recording" 
    description="Voice recording interface with waveform visualization and mood analysis"
  />
);

const BrowsingScreenshot = () => (
  <Screenshot 
    name="Browsing" 
    description="Journal entry list with search and filtering capabilities"
  />
);

const AskJournalScreenshot = () => (
  <Screenshot 
    name="Ask Journal" 
    description="Natural language query interface with confidence indicators"
  />
);

const InsightsScreenshot = () => (
  <Screenshot 
    name="Insights" 
    description="Data visualization of mood trends, topics, and hero's journey"
  />
);

const styles = StyleSheet.create({
  screenshotContainer: {
    alignItems: 'center',
    margin: 20,
  },
  mockScreenshot: {
    width: 300,
    height: 600,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mockScreenshotText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenshotDescription: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export { 
  DashboardScreenshot, 
  RecordingScreenshot, 
  BrowsingScreenshot, 
  AskJournalScreenshot, 
  InsightsScreenshot 
};
