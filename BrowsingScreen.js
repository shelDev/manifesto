import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Searchbar, Chip, IconButton, Divider, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

const BrowsingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock data for UI design
  const journalEntries = [
    { 
      id: 1, 
      title: 'Morning Reflection', 
      date: 'Today, 8:30 AM', 
      preview: 'Started the day feeling optimistic about the project deadline. Had a good breakfast and planned my day carefully. I think I can finish everything on time if I stay focused.',
      mood: 'Optimistic',
      tags: ['Work', 'Planning']
    },
    { 
      id: 2, 
      title: 'Work Thoughts', 
      date: 'Yesterday, 6:15 PM', 
      preview: 'The meeting went better than expected. The team was receptive to my ideas and we made good progress on the project roadmap. Need to follow up with Sarah about the design assets.',
      mood: 'Satisfied',
      tags: ['Work', 'Meetings']
    },
    { 
      id: 3, 
      title: 'Weekend Plans', 
      date: 'Apr 20, 2:45 PM', 
      preview: 'Looking forward to hiking this weekend. Need to prepare gear and check the weather forecast. Hoping for clear skies and moderate temperatures.',
      mood: 'Excited',
      tags: ['Personal', 'Outdoors']
    },
    { 
      id: 4, 
      title: 'Missing home', 
      date: 'Apr 19, 9:30 PM', 
      preview: 'Been feeling a bit homesick lately. It\'s been three months since I moved to the new city and while I\'m enjoying the job, I miss my family and old friends. Should schedule a video call soon.',
      mood: 'Nostalgic',
      tags: ['Personal', 'Family']
    },
    { 
      id: 5, 
      title: 'Project ideas', 
      date: 'Apr 18, 11:20 AM', 
      preview: 'Had some interesting ideas for side projects today. Thinking about building a small app to track my reading habits. Could be a good way to practice my coding skills.',
      mood: 'Creative',
      tags: ['Ideas', 'Projects']
    },
  ];

  const filters = ['All', 'Work', 'Personal', 'Ideas', 'Family'];
  
  const filteredEntries = activeFilter === 'All' 
    ? journalEntries 
    : journalEntries.filter(entry => entry.tags.includes(activeFilter));

  const searchedEntries = searchQuery 
    ? filteredEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredEntries;

  const onChangeSearch = query => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Journal Entries</Text>
        <IconButton
          icon="options-outline"
          size={24}
          color={theme.colors.text}
          onPress={() => {}}
        />
      </View>

      <Searchbar
        placeholder="Search entries"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={theme.colors.primary}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map(filter => (
          <Chip
            key={filter}
            selected={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterChip,
              activeFilter === filter ? styles.activeFilterChip : {}
            ]}
            textStyle={[
              styles.filterChipText,
              activeFilter === filter ? styles.activeFilterChipText : {}
            ]}
          >
            {filter}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.entriesContainer}>
        {searchedEntries.length > 0 ? (
          searchedEntries.map(entry => (
            <Card key={entry.id} style={styles.entryCard} onPress={() => {}}>
              <Card.Content>
                <View style={styles.entryHeader}>
                  <Title style={styles.entryTitle}>{entry.title}</Title>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>
                <Paragraph style={styles.entryPreview}>
                  {entry.preview}
                </Paragraph>
                <View style={styles.entryFooter}>
                  <View style={styles.moodIndicator}>
                    <Ionicons 
                      name={
                        entry.mood === 'Optimistic' ? 'sunny-outline' :
                        entry.mood === 'Satisfied' ? 'checkmark-circle-outline' :
                        entry.mood === 'Excited' ? 'star-outline' :
                        entry.mood === 'Nostalgic' ? 'heart-outline' : 'bulb-outline'
                      } 
                      size={16} 
                      color={theme.colors.textSecondary} 
                    />
                    <Text style={styles.moodText}>{entry.mood}</Text>
                  </View>
                  <View style={styles.tagsContainer}>
                    {entry.tags.map(tag => (
                      <Text key={tag} style={styles.tagText}>#{tag}</Text>
                    ))}
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={theme.colors.textLight} />
            <Text style={styles.noResultsText}>No entries found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
          </View>
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
  searchbar: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    elevation: 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.card,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.textSecondary,
  },
  activeFilterChipText: {
    color: 'white',
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  entryCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  entryTitle: {
    fontSize: theme.typography.fontSize.lg,
    flex: 1,
  },
  entryDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  entryPreview: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  noResultsText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  noResultsSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  footer: {
    height: theme.spacing.xl,
  },
});

export default BrowsingScreen;
