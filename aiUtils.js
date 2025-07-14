/**
 * Utility functions for AI-driven features like mood analysis, tag generation, and insights
 */

/**
 * Analyze text to determine mood
 * @param {string} text - Text to analyze
 * @returns {Object} - Mood analysis result
 */
export const analyzeMood = (text) => {
  // This is a mock implementation
  // In a real app, this would use NLP or a sentiment analysis API
  
  const moods = [
    'Happy', 'Excited', 'Calm', 'Content', 'Optimistic',
    'Sad', 'Anxious', 'Stressed', 'Tired', 'Frustrated',
    'Grateful', 'Inspired', 'Motivated', 'Confused', 'Nostalgic'
  ];
  
  // Simple keyword-based analysis
  const moodKeywords = {
    'Happy': ['happy', 'joy', 'great', 'wonderful', 'fantastic', 'smile', 'laugh'],
    'Excited': ['excited', 'thrilled', 'can\'t wait', 'looking forward', 'anticipate'],
    'Calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet'],
    'Content': ['content', 'satisfied', 'comfortable', 'pleased', 'fine'],
    'Optimistic': ['optimistic', 'hopeful', 'positive', 'promising', 'bright'],
    'Sad': ['sad', 'unhappy', 'down', 'blue', 'depressed', 'upset', 'cry'],
    'Anxious': ['anxious', 'nervous', 'worry', 'concerned', 'uneasy', 'fear'],
    'Stressed': ['stressed', 'overwhelmed', 'pressure', 'tense', 'strain'],
    'Tired': ['tired', 'exhausted', 'fatigue', 'sleepy', 'drained', 'weary'],
    'Frustrated': ['frustrated', 'annoyed', 'irritated', 'bothered', 'angry'],
    'Grateful': ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
    'Inspired': ['inspired', 'creative', 'imagination', 'idea', 'vision'],
    'Motivated': ['motivated', 'determined', 'driven', 'focused', 'goal'],
    'Confused': ['confused', 'uncertain', 'unsure', 'puzzled', 'perplexed'],
    'Nostalgic': ['nostalgic', 'memory', 'remember', 'past', 'childhood', 'miss']
  };
  
  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Count occurrences of mood keywords
  const moodScores = {};
  Object.keys(moodKeywords).forEach(mood => {
    moodScores[mood] = 0;
    moodKeywords[mood].forEach(keyword => {
      // Count occurrences of the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        moodScores[mood] += matches.length;
      }
    });
  });
  
  // Find the mood with the highest score
  let topMood = 'Neutral';
  let topScore = 0;
  
  Object.keys(moodScores).forEach(mood => {
    if (moodScores[mood] > topScore) {
      topMood = mood;
      topScore = moodScores[mood];
    }
  });
  
  // If no strong mood detected, return a random mood for demo purposes
  if (topScore === 0) {
    topMood = moods[Math.floor(Math.random() * moods.length)];
  }
  
  return {
    primaryMood: topMood,
    intensity: topScore > 0 ? Math.min(topScore / 3, 1) : Math.random() * 0.7 + 0.3, // Scale 0-1
    moodScores
  };
};

/**
 * Generate tags from text content
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of generated tags
 */
export const generateTags = (text) => {
  // This is a mock implementation
  // In a real app, this would use NLP or keyword extraction API
  
  const commonTags = [
    'Work', 'Family', 'Friends', 'Health', 'Fitness',
    'Travel', 'Food', 'Music', 'Movies', 'Books',
    'Hobbies', 'Personal', 'Ideas', 'Goals', 'Reflection',
    'Learning', 'Projects', 'Meetings', 'Planning', 'Outdoors'
  ];
  
  // Simple keyword-based tag generation
  const tagKeywords = {
    'Work': ['work', 'job', 'career', 'office', 'project', 'deadline', 'meeting', 'colleague', 'boss', 'client'],
    'Family': ['family', 'parent', 'child', 'mom', 'dad', 'brother', 'sister', 'spouse', 'wife', 'husband', 'kid'],
    'Friends': ['friend', 'buddy', 'pal', 'hang out', 'social', 'party', 'gathering'],
    'Health': ['health', 'doctor', 'sick', 'illness', 'symptom', 'medicine', 'hospital', 'appointment'],
    'Fitness': ['fitness', 'exercise', 'workout', 'gym', 'run', 'jog', 'weight', 'training', 'yoga'],
    'Travel': ['travel', 'trip', 'vacation', 'flight', 'hotel', 'visit', 'explore', 'journey', 'adventure'],
    'Food': ['food', 'eat', 'meal', 'restaurant', 'cook', 'recipe', 'dinner', 'lunch', 'breakfast'],
    'Music': ['music', 'song', 'concert', 'listen', 'album', 'artist', 'band', 'playlist'],
    'Movies': ['movie', 'film', 'watch', 'cinema', 'theater', 'actor', 'director', 'show', 'series'],
    'Books': ['book', 'read', 'author', 'novel', 'story', 'chapter', 'literature'],
    'Hobbies': ['hobby', 'craft', 'paint', 'draw', 'photography', 'garden', 'collect'],
    'Personal': ['personal', 'private', 'myself', 'self', 'identity', 'growth', 'reflection'],
    'Ideas': ['idea', 'thought', 'concept', 'inspiration', 'creative', 'innovation', 'brainstorm'],
    'Goals': ['goal', 'aim', 'objective', 'target', 'plan', 'aspiration', 'achievement', 'accomplish'],
    'Reflection': ['reflect', 'think', 'contemplate', 'ponder', 'meditate', 'introspection'],
    'Learning': ['learn', 'study', 'education', 'course', 'class', 'knowledge', 'skill', 'training'],
    'Projects': ['project', 'task', 'develop', 'build', 'create', 'make', 'construct', 'design'],
    'Meetings': ['meeting', 'conference', 'discussion', 'call', 'presentation', 'team', 'client'],
    'Planning': ['plan', 'schedule', 'organize', 'prepare', 'strategy', 'calendar', 'agenda'],
    'Outdoors': ['outdoor', 'nature', 'hike', 'walk', 'park', 'garden', 'beach', 'mountain', 'forest']
  };
  
  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Count occurrences of tag keywords
  const tagScores = {};
  Object.keys(tagKeywords).forEach(tag => {
    tagScores[tag] = 0;
    tagKeywords[tag].forEach(keyword => {
      // Count occurrences of the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        tagScores[tag] += matches.length;
      }
    });
  });
  
  // Select tags with scores above 0
  const generatedTags = Object.keys(tagScores)
    .filter(tag => tagScores[tag] > 0)
    .sort((a, b) => tagScores[b] - tagScores[a]);
  
  // If no tags detected, return random tags for demo purposes
  if (generatedTags.length === 0) {
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 random tags
    const randomTags = [];
    
    for (let i = 0; i < numTags; i++) {
      const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)];
      if (!randomTags.includes(randomTag)) {
        randomTags.push(randomTag);
      }
    }
    
    return randomTags;
  }
  
  // Return top 3 tags (or fewer if less than 3 were found)
  return generatedTags.slice(0, 3);
};

/**
 * Generate AI insights from journal entries
 * @param {Array} entries - Array of journal entries
 * @returns {Object} - Insights object
 */
export const generateInsights = (entries) => {
  // This is a mock implementation
  // In a real app, this would use more sophisticated NLP and pattern recognition
  
  if (!entries || entries.length === 0) {
    return {
      moodTrends: [],
      commonThemes: [],
      suggestions: [],
      summary: "Start journaling to see insights about your thoughts and feelings."
    };
  }
  
  // Extract moods from entries
  const moods = entries.map(entry => entry.mood || 'Neutral');
  
  // Count mood occurrences
  const moodCounts = {};
  moods.forEach(mood => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  
  // Sort moods by frequency
  const sortedMoods = Object.keys(moodCounts)
    .sort((a, b) => moodCounts[b] - moodCounts[a])
    .map(mood => ({
      mood,
      count: moodCounts[mood],
      percentage: Math.round((moodCounts[mood] / moods.length) * 100)
    }));
  
  // Extract tags from entries
  const allTags = entries
    .flatMap(entry => entry.tags || [])
    .filter(tag => tag);
  
  // Count tag occurrences
  const tagCounts = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  // Sort tags by frequency
  const sortedTags = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .map(tag => ({
      tag,
      count: tagCounts[tag],
      percentage: Math.round((tagCounts[tag] / allTags.length) * 100)
    }));
  
  // Generate common themes
  const commonThemes = sortedTags.slice(0, 5).map(item => item.tag);
  
  // Generate mood trends
  const moodTrends = sortedMoods.slice(0, 5);
  
  // Generate suggestions based on mood and themes
  const suggestions = [];
  
  const primaryMood = sortedMoods[0]?.mood;
  
  if (primaryMood === 'Stressed' || primaryMood === 'Anxious') {
    suggestions.push('Try a 5-minute breathing exercise to reduce stress');
    suggestions.push('Consider scheduling short breaks throughout your day');
  } else if (primaryMood === 'Sad' || primaryMood === 'Frustrated') {
    suggestions.push('Reach out to a friend or family member for support');
    suggestions.push('List three things you're grateful for today');
  } else if (primaryMood === 'Tired') {
    suggestions.push('Review your sleep schedule and bedtime routine');
    suggestions.push('Consider a short power nap or meditation session');
  } else if (primaryMood === 'Happy' || primaryMood === 'Excited') {
    suggestions.push('Share your positive feelings with someone you care about');
    suggestions.push('Reflect on what contributed to these positive emotions');
  }
  
  // Add a theme-based suggestion
  if (commonThemes.includes('Work')) {
    suggestions.push('Set clear boundaries between work and personal time');
  }
  if (commonThemes.includes('Family')) {
    suggestions.push('Schedule quality time with family members');
  }
  if (commonThemes.includes('Health')) {
    suggestions.push('Consider tracking your health habits in your journal');
  }
  
  // Ensure we have at least 3 suggestions
  const defaultSuggestions = [
    'Try journaling at the same time each day to build a habit',
    'Use voice journaling when you don't feel like typing',
    'Review past entries to see how you've grown over time',
    'Set a journaling reminder to maintain consistency'
  ];
  
  while (suggestions.length < 3) {
    const randomSuggestion = defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)];
    if (!suggestions.includes(randomSuggestion)) {
      suggestions.push(randomSuggestion);
    }
  }
  
  // Generate a summary
  let summary = '';
  
  if (entries.length === 1) {
    summary = `You've started your journaling journey! Keep going to discover patterns in your thoughts and feelings.`;
  } else {
    const dayCount = Math.min(entries.length, 30);
    summary = `Over the past ${dayCount} days, you've primarily felt ${primaryMood.toLowerCase()}. `;
    
    if (commonThemes.length > 0) {
      summary += `You've written most frequently about ${commonThemes.slice(0, 2).join(' and ')}. `;
    }
    
    // Add a random insight
    const insights = [
      `Your entries tend to be more positive in the morning.`,
      `You seem most reflective on weekends.`,
      `Your mood appears to improve after writing about your goals.`,
      `You often mention future plans when feeling optimistic.`,
      `Your entries are more detailed when discussing personal topics.`
    ];
    
    summary += insights[Math.floor(Math.random() * insights.length)];
  }
  
  return {
    moodTrends,
    commonThemes,
    suggestions,
    summary
  };
};

/**
 * Generate a hero's journey narrative from journal entries
 * @param {Array} entries - Array of journal entries
 * @returns {string} - Hero's journey narrative
 */
export const generateHeroJourney = (entries) => {
  // This is a mock implementation
  // In a real app, this would use more sophisticated NLP and narrative generation
  
  if (!entries || entries.length < 3) {
    return "Continue journaling to unlock your hero's journey narrative. The more you write, the richer your story will become.";
  }
  
  // Extract key information
  const moods = entries.map(entry => entry.mood || 'Neutral');
  const allTags = entries.flatMap(entry => entry.tags || []);
  
  // Count mood occurrences
  const moodCounts = {};
  moods.forEach(mood => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  
  // Get primary mood
  const primaryMood = Object.keys(moodCounts)
    .sort((a, b) => moodCounts[b] - moodCounts[a])[0];
  
  // Count tag occurrences
  const tagCounts = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  // Get top themes
  const topThemes = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 3);
  
  // Generate a narrative based on the hero's journey structure
  const timeframe = entries.length > 30 ? 'month' : 'weeks';
  
  let narrative = `## Your Hero's Journey\n\n`;
  
  // Introduction - The Ordinary World
  narrative += `In the past ${timeframe}, your journal reveals the story of someone navigating the complexities of daily life. `;
  
  if (topThemes.length > 0) {
    narrative += `Your world has been centered around ${topThemes.join(', ')}, forming the backdrop of your journey. `;
  }
  
  // The Call to Adventure
  const positiveThemes = ['Goals', 'Ideas', 'Projects', 'Learning'].filter(theme => topThemes.includes(theme));
  const challengeThemes = ['Work', 'Health', 'Fitness'].filter(theme => topThemes.includes(theme));
  
  if (positiveThemes.length > 0) {
    narrative += `\n\nYou've been called to adventure through your focus on ${positiveThemes.join(' and ')}, pushing you beyond your comfort zone. `;
  } else if (challengeThemes.length > 0) {
    narrative += `\n\nYour journey has presented challenges in the realm of ${challengeThemes.join(' and ')}, calling you to rise to the occasion. `;
  } else {
    narrative += `\n\nYour journey has presented both opportunities and challenges, calling you to grow and adapt. `;
  }
  
  // Challenges & Transformation
  if (primaryMood === 'Stressed' || primaryMood === 'Anxious' || primaryMood === 'Frustrated') {
    narrative += `\n\nYou've faced obstacles that have often left you feeling ${primaryMood.toLowerCase()}, yet your persistence in journaling shows your commitment to self-reflection and growth. `;
    narrative += `These challenges are shaping you, developing resilience and inner strength that will serve you well. `;
  } else if (primaryMood === 'Happy' || primaryMood === 'Excited' || primaryMood === 'Optimistic') {
    narrative += `\n\nYour journey has been characterized by ${primaryMood.toLowerCase()} moments, showing your ability to find joy and meaning in your experiences. `;
    narrative += `This positive outlook has been your strength, helping you navigate challenges with grace and optimism. `;
  } else {
    narrative += `\n\nThroughout your journey, you've experienced a range of emotions, learning to navigate both the highs and lows with increasing self-awareness. `;
    narrative += `This emotional range is developing your capacity for resilience and adaptability. `;
  }
  
  // The Return & Reward
  narrative += `\n\nAs your story continues to unfold, your journal stands as a testament to your growth. `;
  narrative += `The insights you're gaining through self-reflection are your reward—a deeper understanding of yourself and your place in the world. `;
  
  // Conclusion
  narrative += `\n\nYour hero's journey isn't about reaching a final destination, but about the ongoing process of discovery and transformation. `;
  narrative += `Each journal entry adds a new chapter to your story, revealing the hero that you are becoming day by day.`;
  
  return narrative;
};

/**
 * Process a natural language query about journal entries
 * @param {string} query - User's question
 * @param {Array} entries - Array of journal entries
 * @returns {Object} - Query response
 */
export const processJournalQuery = (query, entries) => {
  // This is a mock implementation
  // In a real app, this would use NL
(Content truncated due to size limit. Use line ranges to read in chunks)