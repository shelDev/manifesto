import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, Title, Paragraph, Chip, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { getJournalEntries, getEntryStatistics } from '../utils/storage';
import { generateInsights, generateHeroJourney } from '../utils/aiUtils';

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

const InsightsScreenFunctional = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('mood');
  const [entries, setEntries] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [heroJourney, setHeroJourney] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Generate hero journey
        const journey = generateHeroJourney(journalEntries);
        setHeroJourney(journey);
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
              selected={activeTab === 'stats'}
              onPress={() => setActiveTab('stats')}
              style={[styles.tab, activeTab === 'stats' ? styles.activeTab : {}]}
              textStyle={activeTab === 'stats' ? styles.activeTabText : {}}
            >
              Stats
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
                      insights.suggestions.map((suggestion, index) => (
                        <View key={index} style={styles.insightItem}>
                          <Ionicons 
                            name={index === 0 ? "trending-up" : "bulb-outline"} 
                            size={20} 
                            color={theme.colors.primary} 
                          />
                          <Text style={styles.insightText}>{suggestion}</Text>
                        </View>
                      ))
                    ) : (
                      <>
                        <View style={styles.insightItem}>
                          <Ionicons name="trending-up" size={20} color={theme.colors.success} />
                          <Text style={styles.insightText}>Your mood has improved by 15% this {timeRange}</Text>
                        </View>
                        <View style={styles.insightItem}>
                          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                          <Text style={styles.insightText}>You tend to feel happiest on Fridays</Text>
                        </View>
                        <View style={styles.insightItem}>
                          <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                          <Text style={styles.insightText}>Morning entries are generally more positive</Text>
                        </View>
                      </>
                    )}
                  </Card.Content>
                </Card>
              </>
            )}

            {activeTab === 'topics' && (
              <>
                <Card style={styles.chartCard}>
                  <Card.Content>
                    <Title style={styles.chartTitle}>Topics Mentioned</Title>
                    <MockPieChart data={getTopicsData()} />
                  </Card.Content>
                </Card>

                <Card style={styles.chartCard}>
                  <Card.Content>
                    <Title style={styles.chartTitle}>Common Themes</Title>
                    <View style={styles.themesContainer}>
                      {getCommonThemes().map((theme, index) => (
                        <Chip
                          key={index}
                          style={styles.themeChip}
                          textStyle={styles.themeChipText}
                        >
                          {theme}
                        </Chip>
                      ))}
                    </View>
                  </Card.Content>
                </Card>

                <Card style={styles.insightsCard}>
                  <Card.Content>
                    <Title style={styles.insightsTitle}>Topic Insights</Title>
                    <View style={styles.insightItem}>
                      <Ionicons name="briefcase" size={20} color={theme.colors.primary} />
                      <Text style={styles.insightText}>
                        {getTopicsData()[0].label} is your most discussed topic ({getTopicsData()[0].percentage}% of entries)
                      </Text>
                    </View>
                    <View style={styles.insightItem}>
                      <Ionicons name="trending-up" size={20} color={theme.colors.success} />
                      <Text style={styles.insightText}>
                        {getTopicsData()[1].label} mentions have increased by 10% this month
                      </Text>
                    </View>
                    <View style={styles.insightItem}>
                      <Ionicons name="bulb-outline" size={20} color={theme.colors.accent2} />
                      <Text style={styles.insightText}>
                        {getCommonThemes()[2]} appears in 25% of your positive entries
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </>
            )}

            {activeTab === 'stats' && (
              <>
                <Card style={styles.statsCard}>
                  <Card.Content>
            
(Content truncated due to size limit. Use line ranges to read in chunks)