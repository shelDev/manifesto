import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Searchbar, Chip, IconButton, Divider, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { getJournalEntries, deleteJournalEntry } from '../utils/storage';
import { playRecording, stopPlayback } from '../utils/audioUtils';

const BrowsingScreenFunctional = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Load entries
  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
      applyFilters(journalEntries, activeFilter, searchQuery);
    } catch (error) {
      console.error('Failed to load entries', error);
      Alert.alert('Error', 'Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and search
  const applyFilters = (allEntries, filter, query) => {
    let result = allEntries;
    
    // Apply tag filter
    if (filter !== 'All') {
      result = result.filter(entry => entry.tags && entry.tags.includes(filter));
    }
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(entry => 
        (entry.title && entry.title.toLowerCase().includes(lowerQuery)) || 
        (entry.content && entry.content.toLowerCase().includes(lowerQuery)) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    setFilteredEntries(result);
  };

  // Handle search
  const onChangeSearch = query => {
    setSearchQuery(query);
    applyFilters(entries, activeFilter, query);
  };

  // Handle filter change
  const onFilterChange = filter => {
    setActiveFilter(filter);
    applyFilters(entries, filter, searchQuery);
  };

  // Play audio recording
  const handlePlayAudio = async (entry) => {
    try {
      // Stop current playback if any
      if (currentSound) {
        await stopPlayback(currentSound);
        setCurrentSound(null);
        setPlayingId(null);
      }
      
      // If clicking the same entry that's playing, just stop
      if (playingId === entry.id) {
        return;
      }
      
      // Play the selected entry
      if (entry.audioUri) {
        const sound = await playRecording(entry.audioUri);
        setCurrentSound(sound);
        setPlayingId(entry.id);
        
        // Reset when playback finishes
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            setCurrentSound(null);
            setPlayingId(null);
          }
        });
      }
    } catch (error) {
      console.error('Failed to play audio', error);
      Alert.alert('Error', 'Failed to play audio recording');
    }
  };

  // Delete entry
  const handleDeleteEntry = async (entryId) => {
    try {
      // Confirm deletion
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this journal entry? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              // Stop playback if deleting the playing entry
              if (playingId === entryId && currentSound) {
                await stopPlayback(currentSound);
                setCurrentSound(null);
                setPlayingId(null);
              }
              
              // Delete the entry
              await deleteJournalEntry(entryId);
              
              // Reload entries
              loadEntries();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to delete entry', error);
      Alert.alert('Error', 'Failed to delete journal entry');
    }
  };

  // Load entries on mount and when navigation focus changes
  useEffect(() => {
    loadEntries();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });
    
    // Clean up
    return () => {
      unsubscribe();
      // Stop any playing audio
      if (currentSound) {
        stopPlayback(currentSound);
      }
    };
  }, [navigation]);

  // Generate filters from entries
  const filters = ['All', ...new Set(entries.flatMap(entry => entry.tags || []))].slice(0, 10);

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
          icon="refresh"
          size={24}
          color={theme.colors.text}
          onPress={loadEntries}
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
            onPress={() => onFilterChange(filter)}
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading entries...</Text>
          </View>
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <Card key={entry.id} style={styles.entryCard}>
              <Card.Content>
                <View style={styles.entryHeader}>
                  <Title style={styles.entryTitle}>{entry.title}</Title>
                  <Text style={styles.entryDate}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </Text>
                </View>
                <Paragraph style={styles.entryPreview} numberOfLines={3}>
                  {entry.content}
                </Paragraph>
                <View style={styles.entryFooter}>
                  <View style={styles.moodIndicator}>
                    <Ionicons 
                      name={
                        entry.mood === 'Happy' || entry.mood === 'Excited' ? 'sunny-outline' :
                        entry.mood === 'Calm' || entry.mood === 'Content' ? 'water-outline' :
                        entry.mood === 'Sad' ? 'rainy-outline' :
                        entry.mood === 'Anxious' || entry.mood === 'Stressed' ? 'thunderstorm-outline' :
                        'ellipsis-horizontal'
                      } 
                      size={16} 
                      color={theme.colors.textSecondary} 
                    />
                    <Text style={styles.moodText}>{entry.mood || 'Neutral'}</Text>
                  </View>
                  <View style={styles.tagsContainer}>
                    {entry.tags && entry.tags.map(tag => (
                      <Text key={tag} style={styles.tagText}>#{tag}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.entryActions}>
                  {entry.audioUri && (
                    <IconButton
                      icon={playingId === entry.id ? "pause-circle" : "play-circle"}
                      size={24}
                      color={theme.colors.primary}
                      onPress={() => handlePlayAudio(entry)}
                    />
                  )}
                  <IconButton
                    icon="create-outline"
                    size={24}
                    color={theme.colors.textSecondary}
                    onPress={() => navigation.navigate('EditEntry', { entryId: entry.id })}
                  />
                  <IconButton
                    icon="trash-outline"
                    size={24}
                    color={theme.colors.error}
                    onPress={() => handleDeleteEntry(entry.id)}
                  />
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
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
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
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
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

export default BrowsingScreenFunctional;
