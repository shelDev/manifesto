import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, Title, Paragraph, Chip, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

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

const InsightsScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('mood');

  // Mock data for UI design
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

  const topicsData = [
    { label: 'Work', percentage: 45 },
    { label: 'Family', percentage: 30 },
    { label: 'Hobbies', percentage: 25 },
  ];

  const moodDistribution = [
    { label: 'Happy', percentage: 40 },
    { label: 'Calm', percentage: 25 },
    { label: 'Anxious', percentage: 20 },
    { label: 'Tired', percentage: 15 },
  ];

  const journalingStats = {
    totalEntries: 42,
    currentStreak: 5,
    longestStreak: 14,
    averageLength: 230,
    mostActiveDay: 'Wednesday',
    mostActiveTime: 'Evening',
  };

  const commonThemes = [
    'Work-life balance',
    'Personal growth',
    'Family relationships',
    'Creative projects',
    'Health and fitness',
  ];

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
          icon="share-outline"
          size={24}
          color={theme.colors.text}
          onPress={() => {}}
        />
      </View>

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
                <MockBarChart data={moodData[timeRange]} color={theme.colors.primary} />
              </Card.Content>
            </Card>

            <Card style={styles.chartCard}>
              <Card.Content>
                <Title style={styles.chartTitle}>Mood Distribution</Title>
                <View style={styles.moodDistribution}>
                  {moodDistribution.map((mood, index) => (
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
              </Card.Content>
            </Card>
          </>
        )}

        {activeTab === 'topics' && (
          <>
            <Card style={styles.chartCard}>
              <Card.Content>
                <Title style={styles.chartTitle}>Topics Mentioned</Title>
                <MockPieChart data={topicsData} />
              </Card.Content>
            </Card>

            <Card style={styles.chartCard}>
              <Card.Content>
                <Title style={styles.chartTitle}>Common Themes</Title>
                <View style={styles.themesContainer}>
                  {commonThemes.map((theme, index) => (
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
                  <Text style={styles.insightText}>Work is your most discussed topic (45% of entries)</Text>
                </View>
                <View style={styles.insightItem}>
                  <Ionicons name="trending-up" size={20} color={theme.colors.success} />
                  <Text style={styles.insightText}>Family mentions have increased by 10% this month</Text>
                </View>
                <View style={styles.insightItem}>
                  <Ionicons name="bulb-outline" size={20} color={theme.colors.accent2} />
                  <Text style={styles.insightText}>Creative projects appear in 25% of your positive entries</Text>
                </View>
              </Card.Content>
            </Card>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <Card style={styles.statsCard}>
              <Card.Content>
                <Title style={styles.statsTitle}>Journaling Stats</Title>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.totalEntries}</Text>
                    <Text style={styles.statLabel}>Total Entries</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.currentStreak}</Text>
                    <Text style={styles.statLabel}>Current Streak</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.longestStreak}</Text>
                    <Text style={styles.statLabel}>Longest Streak</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.averageLength}</Text>
                    <Text style={styles.statLabel}>Avg. Words</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.mostActiveDay}</Text>
                    <Text style={styles.statLabel}>Most Active Day</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{journalingStats.mostActiveTime}</Text>
                    <Text style={styles.statLabel}>Most Active Time</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.heroStoryCard}>
              <Card.Content>
                <Title style={styles.heroStoryTitle}>Your Hero's Journey</Title>
                <Paragraph style={styles.heroStoryText}>
                  In the past {timeRange}, you've navigated challenges at work while maintaining your creative pursuits. 
                  Your journey shows resilience in balancing professional responsibilities with personal growth. 
                  The recurring themes of determination and adaptability highlight your character strengths.
                </Paragraph>
                <Button
                  mode="contained"
                  style={styles.heroStoryButton}
                  onPress={() => {}}
                >
                  View Full Story
                </Button>
              </Card.Content>
            </Card>
          </>
        )}

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
  timeRangeSelector: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.card,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  chartCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.lg,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: theme.borderRadius.sm,
  },
  barLabel: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  moodDistribution: {
    marginTop: theme.spacing.md,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  moodPercentage: {
    width: 40,
    marginRight: theme.spacing.sm,
  },
  moodPercentageText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  moodBar: {
    height: 20,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  moodLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  insightsCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  insightsTitle: {
    fontSize: theme.typography.fontSize.lg,
    marginBottom: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  insightText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  pieChart: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    height: '100%',
    tr
(Content truncated due to size limit. Use line ranges to read in chunks)