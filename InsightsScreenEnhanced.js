import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, Title, Paragraph, Chip, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { getJournalEntries, getEntryStatistics } from '../utils/storage';
import { generateInsights, generateHeroJourney } from '../utils/aiUtils';
import { generateEnhancedHeroJourney, generateCorrelationInsights } from '../utils/advancedAiUtils';

// Mock chart component - in a real app, we would use a library like react-native-chart-kit
const MockBarChart = ({ data, color }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <View 
            style={[
              styles.bar, 
              { 
                height: (item.value / maxValue) * 150,
                backgroundColor: color || theme.colors.primary
              }
            ]} 
          />
          <Text style={styles.barLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

// Mock pie chart component
const MockPieChart = ({ data }) => {
  return (
    <View style={styles.pieChartContainer}>
      <View style={styles.pieChart}>
        {/* This would be replaced with an actual pie chart component */}
        <View style={[styles.pieSlice, { backgroundColor: theme.colors.primary, transform: [{ rotate: '0deg' }], width: '50%' }]} />
        <View style={[styles.pieSlice, { backgroundColor: theme.colors.accent1, transform: [{ rotate: '180deg' }], width: '30%' }]} />
        <View style={[styles.pieSlice, { backgroundColor: theme.colors.accent2, transform: [{ rotate: '280deg' }], width: '20%' }]} />
      </View>
      <View style={styles.pieChartLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { 
                  backgroundColor: index === 0 ? theme.colors.primary : 
                                   index === 1 ? theme.colors.accent1 : theme.colors.accent2
                }
              ]} 
            />
            <Text style={styles.legendText}>{item.label}: {item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const InsightsScreenEnhanced = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('mood');
  const [entries, setEntries] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [heroJourney, setHeroJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCorrelations, setIsLoadingCorrelations] = useState(false);
  const [isLoadingHeroJourney, setIsLoadingHeroJourney] = useState(false);
  const [showFullHeroJourney, setShowFullHeroJourney] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get journal entries
        const journalEntries = await getJournalEntries();
        setEntries(journalEntries);
        
        // Get statistics
        const stats = await getEntryStatistics();
        setStatistics(stats);
        
        // Generate insights
        const insightsData = generateInsights(journalEntries);
        setInsights(insightsData);
        
        // Load correlations
        loadCorrelations(journalEntries);
        
        // Load hero journey
        loadHeroJourney(journalEntries);
      } catch (error) {
        console.error('Failed to load insights data', error);
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

  // Load correlation insights
  const loadCorrelations = async (journalEntries) => {
    setIsLoadingCorrelations(true);
    try {
      const correlationData = await generateCorrelationInsights(journalEntries);
      setCorrelations(correlationData);
    } catch (error) {
      console.error('Failed to load correlation insights', error);
    } finally {
      setIsLoadingCorrelations(false);
    }
  };

  // Load enhanced hero journey
  const loadHeroJourney = async (journalEntries) => {
    setIsLoadingHeroJourney(true);
    try {
      const journeyData = await generateEnhancedHeroJourney(journalEntries);
      setHeroJourney(journeyData);
    } catch (error) {
      console.error('Failed to load hero journey', error);
    } finally {
      setIsLoadingHeroJourney(false);
    }
  };

  // Mock data for UI when real data is not available
  const moodData = {
    week: [
      { label: 'Mon', value: 70 },
      { label: 'Tue', value: 60 },
      { label: 'Wed', value: 90 },
      { label: 'Thu', value: 75 },
      { label: 'Fri', value: 85 },
      { label: 'Sat', value: 65 },
      { label: 'Sun', value: 80 },
    ],
    month: [
      { label: 'Week 1', value: 75 },
      { label: 'Week 2', value: 80 },
      { label: 'Week 3', value: 65 },
      { label: 'Week 4', value: 85 },
    ],
    year: [
      { label: 'Jan', value: 70 },
      { label: 'Feb', value: 75 },
      { label: 'Mar', value: 80 },
      { label: 'Apr', value: 85 },
      { label: 'May', value: 75 },
      { label: 'Jun', value: 70 },
      { label: 'Jul', value: 65 },
      { label: 'Aug', value: 75 },
      { label: 'Sep', value: 80 },
      { label: 'Oct', value: 85 },
      { label: 'Nov', value: 75 },
      { label: 'Dec', value: 80 },
    ]
  };

  // Get mood trends data
  const getMoodTrendsData = () => {
    if (insights && insights.moodTrends && insights.moodTrends.length > 0) {
      // Convert insights data to chart format
      return moodData[timeRange].map((item, index) => ({
        ...item,
        value: Math.random() * 100 // In a real app, this would use actual mood values
      }));
    }
    return moodData[timeRange];
  };

  // Get topics data
  const getTopicsData = () => {
    if (insights && insights.commonThemes && insights.commonThemes.length > 0) {
      // Convert insights data to chart format
      return insights.commonThemes.slice(0, 3).map((theme, index) => ({
        label: theme,
        percentage: 45 - (index * 15) // Mock percentages
      }));
    }
    return [
      { label: 'Work', percentage: 45 },
      { label: 'Family', percentage: 30 },
      { label: 'Hobbies', percentage: 25 },
    ];
  };

  // Get mood distribution
  const getMoodDistribution = () => {
    if (insights && insights.moodTrends && insights.moodTrends.length > 0) {
      return insights.moodTrends.map(item => ({
        label: item.mood,
        percentage: item.percentage
      }));
    }
    return [
      { label: 'Happy', percentage: 40 },
      { label: 'Calm', percentage: 25 },
      { label: 'Anxious', percentage: 20 },
      { label: 'Tired', percentage: 15 },
    ];
  };

  // Get journaling stats
  const getJournalingStats = () => {
    if (statistics) {
      return {
        totalEntries: statistics.totalEntries || 0,
        currentStreak: statistics.currentStreak || 0,
        longestStreak: statistics.longestStreak || 0,
        averageLength: 230, // Mock value
        mostActiveDay: 'Wednesday', // Mock value
        mostActiveTime: 'Evening', // Mock value
      };
    }
    return {
      totalEntries: entries.length,
      currentStreak: 5,
      longestStreak: 14,
      averageLength: 230,
      mostActiveDay: 'Wednesday',
      mostActiveTime: 'Evening',
    };
  };

  // Get common themes
  const getCommonThemes = () => {
    if (insights && insights.commonThemes && insights.commonThemes.length > 0) {
      return insights.commonThemes;
    }
    return [
      'Work-life balance',
      'Personal growth',
      'Family relationships',
      'Creative projects',
      'Health and fitness',
    ];
  };

  // Render hero journey chapter
  const renderHeroJourneyChapter = (chapter, index) => {
    return (
      <View key={index} style={styles.journeyChapter}>
        <Title style={styles.journeyChapterTitle}>{chapter.title}</Title>
        <Paragraph style={styles.journeyChapterContent}>
          {chapter.content}
        </Paragraph>
      </View>
    );
  };

  // Render hero journey highlight
  const renderHeroJourneyHighlight = (highlight, index) => {
    return (
      <Card key={index} style={styles.highlightCard}>
        <Card.Content>
          <View style={styles.highlightHeader}>
            <Title style={styles.highlightTitle}>{highlight.title}</Title>
            <Chip style={styles.highlightMoodChip}>{highlight.mood}</Chip>
          </View>
          <Paragraph style={styles.highlightExcerpt}>
            "{highlight.excerpt}"
          </Paragraph>
          <Text style={styles.highlightDate}>{highlight.date}</Text>
        </Card.Content>
      </Card>
    );
  };

  // Render correlation item
  const renderCorrelationItem = (correlation, index) => {
    return (
      <View key={index} style={styles.correlationItem}>
        <View style={styles.correlationHeader}>
          <Text style={styles.correlationTitle}>
            {correlation.topic} → {correlation.mood}
          </Text>
          <View 
            style={[
              styles.correlationStrength, 
              { 
                backgroundColor: correlation.direction === 'positive' 
                  ? theme.colors.success 
                  : theme.colors.error 
              }
            ]}
          >
            <Text style={styles.correlationStrengthText}>
              {Math.round(correlation.strength * 100)}%
            </Text>
          </View>
        </View>
        <View style={styles.correlationBar}>
          <View 
            style={[
              styles.correlationBarFill, 
              { 
                width: `${correlation.strength * 100}%`,
                backgroundColor: correlation.direction === 'positive' 
                  ? theme.colors.success 
                  : theme.colors.error 
              }
            ]} 
          />
        </View>
        <Text style={styles.correlationDirection}>
          {correlation.direction === 'positive' 
            ? 'Positive correlation' 
            : 'Negative correlation'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Insights</Text>
        <IconButton
          icon="refresh"
          size={24}
          color={theme.colors.text}
          onPress={() => {
            setIsLoading(true);
            // Reload data
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analyzing your journal entries...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.noEntriesContainer}>
          <Ionicons name="book-outline" size={64} color={theme.colors.textLight} />
          <Text style={styles.noEntriesTitle}>No Journal Entries Yet</Text>
          <Text style={styles.noEntriesText}>
            Start journaling to see insights about your thoughts and feelings.
          </Text>
          <Button
            mode="contained"
            style={styles.startJournalingButton}
            onPress={() => navigation.navigate('Record')}
          >
            Start Journaling
          </Button>
        </View>
      ) : (
        <>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
            style={styles.timeRangeSelector}
          />

          <View style={styles.tabsContainer}>
            <Chip
              selected={activeTab === 'mood'}
              onPress={() => setActiveTab('mood')}
              style={[styles.tab, activeTab === 'mood' ? styles.activeTab : {}]}
              textStyle={activeTab === 'mood' ? styles.activeTabText : {}}
            >
              Mood Trends
            </Chip>
            <Chip
              selected={activeTab === 'topics'}
              onPress={() => setActiveTab('topics')}
              style={[styles.tab, activeTab === 'topics' ? styles.activeTab : {}]}
              textStyle={activeTab === 'topics' ? styles.activeTabText : {}}
            >
              Topics
            </Chip>
            <Chip
              selected={activeTab === 'correlations'}
              onPress={() => setActiveTab('correlations')}
              style={[styles.tab, activeTab === 'correlations' ? styles.activeTab : {}]}
              textStyle={activeTab === 'correlations' ? styles.activeTabText : {}}
            >
              Correlations
            </Chip>
            <Chip
              selected={activeTab === 'journey'}
              onPress={() => setActiveTab('journey')}
              style={[styles.tab, activeTab === 'journey' ? styles.activeTab : {}]}
              textStyle={activeTab === 'journey' ? styles.activeTabText : {}}
            >
              Journey
            </Chip>
          </View>

          <ScrollView style={styles.content}>
            {activeTab === 'mood' && (
              <>
                <Card style={styles.chartCard}>
                  <Card.Content>
                    <Title style={styles.chartTitle}>Mood Over Time</Title>
                    <MockBarChart data={getMoodTrendsData()} color={theme.colors.primary} />
                  </Card.Content>
                </Card>

                <Card style={styles.chartCard}>
                  <Card.Content>
                    <Title style={styles.chartTitle}>Mood Distribution</Title>
                    <View style={styles.moodDistribution}>
                      {getMoodDistribution().map((mood, index) => (
                        <View key={index} style={styles.moodItem}>
                          <View style={styles.moodPercentage}>
                            <Text style={styles.moodPercentageText}>{mood.percentage}%</Text>
                          </View>
                          <View 
                            style={[
                              styles.moodBar, 
                              { 
                                width: `${mood.percentage}%`,
                                backgroundColor: index === 0 ? theme.colors.accent2 :
                                               index === 1 ? theme.colors.accent1 :
                                               index === 2 ? theme.colors.error :
                                               theme.colors.textLight
                              }
                            ]} 
                          />
                          <Text style={styles.moodLabel}>{mood.label}</Text>
                        </View>
                      ))}
                    </View>
                  </Card.Content>
                </Card>

                <Card style={styles.insightsCard}>
                  <Card.Content>
                    <Title style={styles.insightsTitle}>Mood Insights</Title>
                    {insights && insights.suggestions ? (
 
(Content truncated due to size limit. Use line ranges to read in chunks)