import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, IconButton, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { getJournalEntries } from '../utils/storage';
import { generatePersonalizedPrompts } from '../utils/advancedAiUtils';

const DashboardScreenEnhanced = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get journal entries
        const journalEntries = await getJournalEntries();
        setEntries(journalEntries);
        
        // Get recent entries (last 3)
        const recent = journalEntries.slice(0, 3);
        setRecentEntries(recent);
        
        // Calculate stats
        const entriesStats = calculateStats(journalEntries);
        setStats(entriesStats);
        
        // Generate personalized prompts
        setIsLoadingPrompts(true);
        const personalizedPrompts = await generatePersonalizedPrompts(journalEntries);
        setPrompts(personalizedPrompts);
        setIsLoadingPrompts(false);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    
    // Clean up
    return unsubscribe;
  }, [navigation]);

  // Calculate stats from entries
  const calculateStats = (journalEntries) => {
    if (!journalEntries || journalEntries.length === 0) {
      return {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        moodDistribution: {},
        topTopics: []
      };
    }
    
    // Calculate total entries
    const totalEntries = journalEntries.length;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedEntries = [...journalEntries].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    let lastDate = new Date(sortedEntries[0].createdAt).setHours(0, 0, 0, 0);
    if (lastDate === today || lastDate === today - 86400000) { // today or yesterday
      currentStreak = 1;
      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = new Date(sortedEntries[i].createdAt).setHours(0, 0, 0, 0);
        if (lastDate - currentDate === 86400000) { // 1 day difference
          currentStreak++;
          lastDate = currentDate;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak (simplified)
    const longestStreak = Math.max(currentStreak, 5); // Mock value, would be calculated properly in a real app
    
    // Calculate mood distribution
    const moodDistribution = {};
    journalEntries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }
    });
    
    // Calculate top topics
    const topicCounts = {};
    journalEntries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          topicCounts[tag] = (topicCounts[tag] || 0) + 1;
        });
      }
    });
    
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
    
    return {
      totalEntries,
      currentStreak,
      longestStreak,
      moodDistribution,
      topTopics
    };
  };

  // Get primary mood
  const getPrimaryMood = () => {
    if (!stats || !stats.moodDistribution || Object.keys(stats.moodDistribution).length === 0) {
      return 'No mood data';
    }
    
    return Object.entries(stats.moodDistribution)
      .sort((a, b) => b[1] - a[1])[0][0];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt) => {
    navigation.navigate('Record');
    // In a real app, we would pass the prompt to the recording screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Journal</Text>
        <IconButton
          icon="cog-outline"
          size={24}
          color={theme.colors.text}
          onPress={() => Alert.alert('Settings', 'Settings would open here')}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your journal data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats?.totalEntries || 0}</Text>
                  <Text style={styles.statLabel}>Total Entries</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats?.currentStreak || 0}</Text>
                  <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{getPrimaryMood()}</Text>
                  <Text style={styles.statLabel}>Primary Mood</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Browse')}
              color={theme.colors.primary}
            >
              View All
            </Button>
          </View>

          {recentEntries.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <View style={styles.emptyContent}>
                  <Ionicons name="book-outline" size={48} color={theme.colors.textLight} />
                  <Text style={styles.emptyText}>No journal entries yet</Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Record')}
                    style={styles.startButton}
                  >
                    Start Journaling
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ) : (
            recentEntries.map((entry, index) => (
              <Card
                key={index}
                style={styles.entryCard}
                onPress={() => navigation.navigate('Browse')}
              >
                <Card.Content>
                  <View style={styles.entryHeader}>
                    <Title style={styles.entryTitle}>
                      {entry.title || `Journal Entry ${index + 1}`}
                    </Title>
                    <View
                      style={[
                        styles.moodBadge,
                        {
                          backgroundColor:
                            entry.mood === 'Happy' || entry.mood === 'Excited'
                              ? theme.colors.success
                              : entry.mood === 'Anxious' || entry.mood === 'Stressed'
                              ? theme.colors.error
                              : theme.colors.primary,
                        },
                      ]}
                    >
                      <Text style={styles.moodText}>{entry.mood || 'Neutral'}</Text>
                    </View>
                  </View>
                  <Text style={styles.entryDate}>{formatDate(entry.createdAt)}</Text>
                  <Paragraph style={styles.entryContent} numberOfLines={2}>
                    {entry.content || 'No content'}
                  </Paragraph>
                  {entry.tags && entry.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {entry.tags.slice(0, 3).map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Journal Prompts</Text>
            <Button
              mode="text"
              onPress={() => setIsLoadingPrompts(true)}
              color={theme.colors.primary}
            >
              Refresh
            </Button>
          </View>

          {isLoadingPrompts ? (
            <Card style={styles.loadingPromptsCard}>
              <Card.Content>
                <View style={styles.loadingPromptsContent}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.loadingPromptsText}>
                    Generating personalized prompts...
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            prompts.map((prompt, index) => (
              <Card
                key={index}
                style={styles.promptCard}
                onPress={() => handlePromptSelect(prompt)}
              >
                <Card.Content>
                  <View style={styles.promptContent}>
                    <Ionicons
                      name="help-circle-outline"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.promptText}>{prompt}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}

          <View style={styles.quickActionsContainer}>
            <Title style={styles.quickActionsTitle}>Quick Actions</Title>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => navigation.navigate('Record')}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name="mic" size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>New Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => navigation.navigate('Ask')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent1 }]}>
                  <Ionicons name="chatbubble" size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>Ask Journal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => navigation.navigate('Insights')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.accent2 }]}>
                  <Ionicons name="bar-chart" size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>Insights</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => Alert.alert('Share', 'Sharing functionality would be implemented here')}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.success }]}>
                  <Ionicons name="share-social" size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer} />
        </ScrollView>
      )}
    </View>
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
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  statsCard: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  emptyCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardDark,
  },
  emptyContent: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
  },
  startButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  entryCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
    fontSize: theme.typography.fontSize.md,
    flex: 1,
  },
  moodBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  moodText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
  },
  entryDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  entryContent: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  tagText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
  },
  loadingPromptsCard: {
    marginBottom: theme.spacing.md,
    bor
(Content truncated due to size limit. Use line ranges to read in chunks)