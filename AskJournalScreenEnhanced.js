import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, TextInput, Button, IconButton, Title, Paragraph, Avatar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { getJournalEntries } from '../utils/storage';
import { processAdvancedJournalQuery, generatePersonalizedPrompts } from '../utils/advancedAiUtils';

const AskJournalScreenEnhanced = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [entries, setEntries] = useState([]);
  const [personalizedPrompts, setPersonalizedPrompts] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [confidence, setConfidence] = useState(0);

  // Load journal entries and personalized prompts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load journal entries
        const journalEntries = await getJournalEntries();
        setEntries(journalEntries);
        
        // Generate personalized prompts
        setIsLoadingPrompts(true);
        const prompts = await generatePersonalizedPrompts(journalEntries);
        setPersonalizedPrompts(prompts);
        setIsLoadingPrompts(false);
      } catch (error) {
        console.error('Failed to load data', error);
        setIsLoadingPrompts(false);
      }
    };

    loadData();

    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    
    // Clean up
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Process the query using advanced AI utils
      const queryResponse = await processAdvancedJournalQuery(query, entries);
      
      setResponse(queryResponse);
      setConfidence(queryResponse.confidence || 0);
      setIsProcessing(false);
    } catch (error) {
      console.error('Failed to process query', error);
      Alert.alert('Error', 'Failed to process your question. Please try again.');
      setIsProcessing(false);
    }
  };

  const clearResponse = () => {
    setResponse(null);
    setQuery('');
    setConfidence(0);
  };

  const viewEntry = (entryId) => {
    // Navigate to entry details
    navigation.navigate('Browse');
    // In a real app, we would navigate to a specific entry view
  };

  const usePrompt = (prompt) => {
    setQuery(prompt);
  };

  // Get confidence level color
  const getConfidenceColor = (level) => {
    if (level >= 0.8) return theme.colors.success;
    if (level >= 0.6) return theme.colors.accent2;
    return theme.colors.error;
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
        <Text style={styles.headerTitle}>Ask Your Journal</Text>
        <IconButton
          icon="information-circle-outline"
          size={24}
          color={theme.colors.text}
          onPress={() => Alert.alert(
            'Ask Your Journal',
            'Ask questions about your thoughts, feelings, or experiences from your journal entries. The AI will analyze your entries and provide insights.'
          )}
        />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.queryCard}>
          <Card.Content>
            <Paragraph style={styles.queryInstructions}>
              Ask a question about your thoughts, feelings, or experiences from your journal entries.
            </Paragraph>
            <TextInput
              mode="outlined"
              placeholder="e.g., How was I feeling last weekend?"
              value={query}
              onChangeText={setQuery}
              style={styles.queryInput}
              outlineColor={theme.colors.border}
              activeOutlineColor={theme.colors.primary}
              multiline
              numberOfLines={3}
              disabled={isProcessing}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isProcessing}
              disabled={!query.trim() || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Ask Journal'}
            </Button>
          </Card.Content>
        </Card>

        {response && (
          <View style={styles.responseContainer}>
            <Card style={styles.responseCard}>
              <Card.Content>
                <View style={styles.responseHeader}>
                  <Avatar.Icon 
                    size={40} 
                    icon="book-outline" 
                    style={styles.responseAvatar}
                    color="white"
                  />
                  <Title style={styles.responseTitle}>Your journal's answer</Title>
                  {confidence > 0 && (
                    <View style={[styles.confidenceIndicator, { backgroundColor: getConfidenceColor(confidence) }]}>
                      <Text style={styles.confidenceText}>{Math.round(confidence * 100)}%</Text>
                    </View>
                  )}
                </View>
                <Paragraph style={styles.responseText}>
                  {response.answer}
                </Paragraph>
              </Card.Content>
            </Card>

            {response.relatedEntries && response.relatedEntries.length > 0 && (
              <>
                <Title style={styles.sectionTitle}>Related Entries</Title>
                {response.relatedEntries.map((entry, index) => (
                  <Card key={index} style={styles.entryCard} onPress={() => viewEntry(entry.id)}>
                    <Card.Content>
                      <View style={styles.entryHeader}>
                        <Title style={styles.entryTitle}>{entry.title}</Title>
                        <Text style={styles.entryDate}>{entry.date}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </>
            )}

            {response.suggestedActions && response.suggestedActions.length > 0 && (
              <>
                <Title style={styles.sectionTitle}>Suggested Actions</Title>
                <Card style={styles.suggestionsCard}>
                  <Card.Content>
                    {response.suggestedActions.map((action, index) => (
                      <View key={index} style={styles.suggestionItem}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.suggestionText}>{action}</Text>
                      </View>
                    ))}
                  </Card.Content>
                </Card>
              </>
            )}

            {response.queryAnalysis && (
              <Card style={styles.queryAnalysisCard}>
                <Card.Content>
                  <Title style={styles.queryAnalysisTitle}>Query Analysis</Title>
                  <View style={styles.queryAnalysisItem}>
                    <Text style={styles.queryAnalysisLabel}>Type:</Text>
                    <Chip style={styles.queryAnalysisChip}>{response.queryAnalysis.type || 'unknown'}</Chip>
                  </View>
                  {response.queryAnalysis.timeFrame && (
                    <View style={styles.queryAnalysisItem}>
                      <Text style={styles.queryAnalysisLabel}>Time Frame:</Text>
                      <Chip style={styles.queryAnalysisChip}>{response.queryAnalysis.timeFrame}</Chip>
                    </View>
                  )}
                  {response.queryAnalysis.topic && (
                    <View style={styles.queryAnalysisItem}>
                      <Text style={styles.queryAnalysisLabel}>Topic:</Text>
                      <Chip style={styles.queryAnalysisChip}>{response.queryAnalysis.topic}</Chip>
                    </View>
                  )}
                  {response.queryAnalysis.emotion && (
                    <View style={styles.queryAnalysisItem}>
                      <Text style={styles.queryAnalysisLabel}>Emotion:</Text>
                      <Chip style={styles.queryAnalysisChip}>{response.queryAnalysis.emotion}</Chip>
                    </View>
                  )}
                </Card.Content>
              </Card>
            )}

            <Button
              mode="outlined"
              onPress={clearResponse}
              style={styles.newQueryButton}
            >
              Ask Another Question
            </Button>
          </View>
        )}

        {!response && entries.length === 0 && (
          <Card style={styles.noEntriesCard}>
            <Card.Content>
              <Title style={styles.noEntriesTitle}>No Journal Entries Yet</Title>
              <Paragraph style={styles.noEntriesText}>
                Start journaling to unlock the power of AI insights. Record your thoughts and feelings to build your personal journal.
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Record')}
                style={styles.startJournalingButton}
              >
                Start Journaling
              </Button>
            </Card.Content>
          </Card>
        )}

        {!response && entries.length > 0 && (
          <>
            <Title style={styles.promptsTitle}>Personalized Questions</Title>
            {isLoadingPrompts ? (
              <Card style={styles.loadingPromptsCard}>
                <Card.Content>
                  <Paragraph style={styles.loadingPromptsText}>
                    Generating personalized questions based on your journal...
                  </Paragraph>
                </Card.Content>
              </Card>
            ) : (
              personalizedPrompts.map((prompt, index) => (
                <Card 
                  key={index} 
                  style={styles.promptCard} 
                  onPress={() => usePrompt(prompt)}
                >
                  <Card.Content>
                    <View style={styles.promptContent}>
                      <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
                      <Text style={styles.promptText}>{prompt}</Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  queryCard: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  queryInstructions: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  queryInput: {
    backgroundColor: theme.colors.card,
    fontSize: theme.typography.fontSize.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  responseContainer: {
    marginTop: theme.spacing.lg,
  },
  responseCard: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  responseAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  responseTitle: {
    marginLeft: theme.spacing.md,
    color: 'white',
    fontSize: theme.typography.fontSize.lg,
    flex: 1,
  },
  confidenceIndicator: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  confidenceText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
  },
  responseText: {
    color: 'white',
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  sectionTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
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
  },
  entryDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  suggestionsCard: {
    borderRadius: theme.borderRadius.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  suggestionText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  queryAnalysisCard: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardDark,
  },
  queryAnalysisTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  queryAnalysisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  queryAnalysisLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    width: 100,
  },
  queryAnalysisChip: {
    backgroundColor: theme.colors.primaryLight,
  },
  newQueryButton: {
    marginTop: theme.spacing.lg,
    borderColor: theme.colors.primary,
  },
  noEntriesCard: {
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardDark,
  },
  noEntriesTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noEntriesText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  startJournalingButton: {
    backgroundColor: theme.colors.primary,
  },
  promptsTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  loadingPromptsCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardDark,
  },
  loadingPromptsText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  promptCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardDark,
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  footer: {
    height: theme.spacing.xxl,
  },
});

export default AskJournalScreenEnhanced;
