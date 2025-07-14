import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton, Surface, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const DashboardScreen = ({ navigation }) => {
  // Mock data for UI design
  const recentEntries = [
    { id: 1, title: 'Morning Reflection', date: 'Today, 8:30 AM', preview: 'Started the day feeling optimistic about the project deadline...' },
    { id: 2, title: 'Work Thoughts', date: 'Yesterday, 6:15 PM', preview: 'The meeting went better than expected. The team was receptive to my ideas...' },
    { id: 3, title: 'Weekend Plans', date: 'Apr 20, 2:45 PM', preview: 'Looking forward to hiking this weekend. Need to prepare gear and...' },
  ];

  const moodData = [
    { day: 'Mon', mood: 'Happy' },
    { day: 'Tue', mood: 'Calm' },
    { day: 'Wed', mood: 'Stressed' },
    { day: 'Thu', mood: 'Productive' },
    { day: 'Fri', mood: 'Excited' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good afternoon, User</Text>
        <IconButton
          icon="settings-outline"
          size={24}
          color={theme.colors.text}
          onPress={() => {}}
        />
      </View>

      <View style={styles.statsContainer}>
        <Surface style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </Surface>
        <Surface style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Surface>
        <Surface style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Surface>
      </View>

      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          icon="microphone"
          style={styles.recordButton}
          contentStyle={styles.recordButtonContent}
          labelStyle={styles.recordButtonLabel}
          onPress={() => navigation.navigate('Recording')}
        >
          Record New Entry
        </Button>
      </View>

      <View style={styles.sectionHeader}>
        <Title>Recent Entries</Title>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Browse')}
        >
          See All
        </Button>
      </View>

      {recentEntries.map(entry => (
        <Card key={entry.id} style={styles.entryCard} onPress={() => {}}>
          <Card.Content>
            <Title style={styles.entryTitle}>{entry.title}</Title>
            <Paragraph style={styles.entryDate}>{entry.date}</Paragraph>
            <Paragraph numberOfLines={2} style={styles.entryPreview}>
              {entry.preview}
            </Paragraph>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Title>Mood Trends</Title>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Insights')}
        >
          Details
        </Button>
      </View>

      <Card style={styles.moodCard}>
        <Card.Content>
          <View style={styles.moodChartPlaceholder}>
            {/* This would be replaced with an actual chart component */}
            <View style={styles.moodChartBars}>
              {moodData.map((data, index) => (
                <View key={index} style={styles.moodChartBarContainer}>
                  <View 
                    style={[
                      styles.moodChartBar, 
                      { 
                        height: data.mood === 'Happy' ? 80 : 
                                data.mood === 'Calm' ? 60 : 
                                data.mood === 'Stressed' ? 90 : 
                                data.mood === 'Productive' ? 70 : 50,
                        backgroundColor: data.mood === 'Happy' ? theme.colors.accent2 : 
                                        data.mood === 'Calm' ? theme.colors.accent1 : 
                                        data.mood === 'Stressed' ? theme.colors.error : 
                                        data.mood === 'Productive' ? theme.colors.success : theme.colors.accent3
                      }
                    ]} 
                  />
                  <Text style={styles.moodChartLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.askContainer}>
        <Button
          mode="outlined"
          icon="help-circle-outline"
          style={styles.askButton}
          onPress={() => navigation.navigate('AskJournal')}
        >
          Ask Your Journal
        </Button>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  statCard: {
    width: '30%',
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    elevation: 2,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionContainer: {
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  recordButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  recordButtonContent: {
    height: 50,
  },
  recordButtonLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  entryCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  entryTitle: {
    fontSize: theme.typography.fontSize.lg,
  },
  entryDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  entryPreview: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  moodCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  moodChartPlaceholder: {
    height: 150,
    justifyContent: 'flex-end',
  },
  moodChartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  moodChartBarContainer: {
    alignItems: 'center',
  },
  moodChartBar: {
    width: 20,
    borderRadius: theme.borderRadius.sm,
  },
  moodChartLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  askContainer: {
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  askButton: {
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  footer: {
    height: theme.spacing.xl,
  },
});

export default DashboardScreen;
