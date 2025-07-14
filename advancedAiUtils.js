import * as FileSystem from 'expo-file-system';
import { analyzeMood, generateTags } from './aiUtils';

// OpenAI API key would be stored securely in a real app
// For this demo, we'll use mock implementations
const OPENAI_API_KEY = 'mock-api-key';

/**
 * Enhanced AI utilities for advanced sentiment analysis, 
 * natural language processing, and narrative generation
 */

/**
 * Perform advanced sentiment analysis on text
 * @param {string} text - Text to analyze
 * @returns {Object} - Detailed sentiment analysis
 */
export const advancedSentimentAnalysis = async (text) => {
  // In a real app, this would call an external API like OpenAI
  // For demo purposes, we'll use a more sophisticated mock implementation
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic mood analysis from aiUtils.js
    const basicMood = analyzeMood(text);
    
    // Enhanced analysis with more dimensions
    const emotionalDimensions = {
      joy: Math.random() * 0.8,
      sadness: Math.random() * 0.5,
      anger: Math.random() * 0.3,
      fear: Math.random() * 0.4,
      surprise: Math.random() * 0.6,
      disgust: Math.random() * 0.2,
      trust: Math.random() * 0.7,
      anticipation: Math.random() * 0.6
    };
    
    // Determine dominant emotions (top 2)
    const sortedEmotions = Object.entries(emotionalDimensions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([emotion, score]) => ({ emotion, score }));
    
    // Generate emotional insights
    const insights = [
      `Your entry shows a blend of ${sortedEmotions[0].emotion} and ${sortedEmotions[1].emotion}.`,
      `The ${sortedEmotions[0].emotion} in your writing suggests ${getEmotionInsight(sortedEmotions[0].emotion)}.`,
      `Consider how your ${sortedEmotions[1].emotion} might be influencing your perspective on this situation.`
    ];
    
    return {
      primaryMood: basicMood.primaryMood,
      intensity: basicMood.intensity,
      emotionalDimensions,
      dominantEmotions: sortedEmotions,
      insights,
      sentimentScore: (emotionalDimensions.joy + emotionalDimensions.trust) - 
                      (emotionalDimensions.sadness + emotionalDimensions.anger + emotionalDimensions.fear)
    };
  } catch (error) {
    console.error('Advanced sentiment analysis failed', error);
    // Fall back to basic analysis
    return analyzeMood(text);
  }
};

/**
 * Get insight for a specific emotion
 * @param {string} emotion - Emotion name
 * @returns {string} - Insight about the emotion
 */
const getEmotionInsight = (emotion) => {
  const insights = {
    joy: "a positive outlook and appreciation for your experiences",
    sadness: "you may be processing loss or disappointment",
    anger: "you might be encountering obstacles or violations of your values",
    fear: "you're anticipating potential threats or uncertainties",
    surprise: "you're experiencing unexpected developments",
    disgust: "you may be reacting to something that conflicts with your values",
    trust: "you have confidence in someone or something in your life",
    anticipation: "you're looking forward to future events or outcomes"
  };
  
  return insights[emotion] || "interesting emotional patterns in your writing";
};

/**
 * Extract key topics and themes with advanced NLP
 * @param {string} text - Text to analyze
 * @returns {Object} - Extracted topics and themes
 */
export const extractTopicsAndThemes = async (text) => {
  // In a real app, this would use an NLP API
  // For demo purposes, we'll use a more sophisticated mock implementation
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Basic tags from aiUtils.js
    const basicTags = generateTags(text);
    
    // Enhanced topic extraction
    const topics = [...basicTags];
    
    // Add some additional topics based on text length
    if (text.length > 100) {
      const additionalTopics = [
        'Self-reflection', 'Growth', 'Challenges', 
        'Relationships', 'Career', 'Wellness',
        'Creativity', 'Learning', 'Balance'
      ];
      
      // Add 1-3 random additional topics
      const numToAdd = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numToAdd; i++) {
        const randomTopic = additionalTopics[Math.floor(Math.random() * additionalTopics.length)];
        if (!topics.includes(randomTopic)) {
          topics.push(randomTopic);
        }
      }
    }
    
    // Extract key phrases
    const keyPhrases = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length > 0) {
      // Select 1-2 sentences as key phrases
      const numPhrases = Math.min(sentences.length, Math.floor(Math.random() * 2) + 1);
      for (let i = 0; i < numPhrases; i++) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        const phrase = sentences[randomIndex].trim();
        if (phrase.length > 20 && !keyPhrases.includes(phrase)) {
          keyPhrases.push(phrase);
        }
      }
    }
    
    // Identify themes (higher-level concepts)
    const themes = [
      'Personal growth',
      'Work-life balance',
      'Emotional well-being',
      'Relationship dynamics',
      'Self-discovery',
      'Resilience',
      'Mindfulness',
      'Goal pursuit'
    ];
    
    // Select 1-2 random themes
    const selectedThemes = [];
    const numThemes = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numThemes; i++) {
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      if (!selectedThemes.includes(randomTheme)) {
        selectedThemes.push(randomTheme);
      }
    }
    
    return {
      topics,
      keyPhrases,
      themes: selectedThemes
    };
  } catch (error) {
    console.error('Topic extraction failed', error);
    // Fall back to basic tags
    return {
      topics: generateTags(text),
      keyPhrases: [],
      themes: []
    };
  }
};

/**
 * Generate an enhanced hero's journey narrative
 * @param {Array} entries - Journal entries
 * @returns {Object} - Enhanced narrative with sections and highlights
 */
export const generateEnhancedHeroJourney = async (entries) => {
  // In a real app, this would use a language model API
  // For demo purposes, we'll use a more sophisticated mock implementation
  
  try {
    if (!entries || entries.length < 3) {
      return {
        summary: "Continue journaling to unlock your hero's journey narrative. The more you write, the richer your story will become.",
        chapters: [],
        highlights: []
      };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract moods and themes from entries
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
    
    // Create chapters of the hero's journey
    const chapters = [
      {
        title: "The Ordinary World",
        content: `In the past ${timeframe}, your journal reveals the story of someone navigating the complexities of daily life. ${topThemes.length > 0 ? `Your world has been centered around ${topThemes.join(', ')}, forming the backdrop of your journey.` : 'Your diverse interests and experiences have formed a rich backdrop for your journey.'}`
      },
      {
        title: "The Call to Adventure",
        content: generateCallToAdventure(topThemes, entries.length)
      },
      {
        title: "Challenges & Trials",
        content: generateChallengesSection(primaryMood, entries)
      },
      {
        title: "Transformation",
        content: generateTransformationSection(entries, primaryMood)
      },
      {
        title: "The Return & Reward",
        content: `As your story continues to unfold, your journal stands as a testament to your growth. The insights you're gaining through self-reflection are your reward—a deeper understanding of yourself and your place in the world. Each journal entry adds a new chapter to your story, revealing the hero that you are becoming day by day.`
      }
    ];
    
    // Extract highlights from entries
    const highlights = [];
    
    // Find entries with strong emotions
    const emotionalEntries = entries.filter(entry => 
      ['Happy', 'Excited', 'Sad', 'Anxious', 'Stressed', 'Inspired'].includes(entry.mood)
    );
    
    if (emotionalEntries.length > 0) {
      // Select up to 3 random emotional entries
      const numHighlights = Math.min(emotionalEntries.length, 3);
      for (let i = 0; i < numHighlights; i++) {
        const randomIndex = Math.floor(Math.random() * emotionalEntries.length);
        const entry = emotionalEntries[randomIndex];
        
        highlights.push({
          title: entry.title || `Journal Entry - ${new Date(entry.createdAt).toLocaleDateString()}`,
          mood: entry.mood,
          excerpt: entry.content ? entry.content.substring(0, 100) + '...' : 'No content available',
          date: new Date(entry.createdAt).toLocaleDateString()
        });
        
        // Remove this entry to avoid duplicates
        emotionalEntries.splice(randomIndex, 1);
      }
    }
    
    // Generate summary
    const summary = `Your hero's journey over the past ${timeframe} reveals a narrative of ${primaryMood.toLowerCase()} as you navigate the realms of ${topThemes.join(', ')}. Through challenges and victories, your story unfolds as one of growth and self-discovery.`;
    
    return {
      summary,
      chapters,
      highlights
    };
  } catch (error) {
    console.error('Enhanced hero journey generation failed', error);
    // Return a simple narrative
    return {
      summary: "Your journal tells the story of your personal hero's journey, filled with challenges, growth, and transformation.",
      chapters: [
        {
          title: "Your Journey",
          content: "Continue journaling to see your hero's journey unfold in greater detail."
        }
      ],
      highlights: []
    };
  }
};

/**
 * Generate the Call to Adventure section
 * @param {Array} topThemes - Top themes from entries
 * @param {number} entryCount - Number of entries
 * @returns {string} - Generated content
 */
const generateCallToAdventure = (topThemes, entryCount) => {
  const positiveThemes = ['Goals', 'Ideas', 'Projects', 'Learning'].filter(theme => topThemes.includes(theme));
  const challengeThemes = ['Work', 'Health', 'Fitness'].filter(theme => topThemes.includes(theme));
  
  if (positiveThemes.length > 0) {
    return `You've been called to adventure through your focus on ${positiveThemes.join(' and ')}, pushing you beyond your comfort zone. Your journal entries reveal a pattern of seeking growth and new experiences in these areas, marking the beginning of your hero's journey.`;
  } else if (challengeThemes.length > 0) {
    return `Your journey has presented challenges in the realm of ${challengeThemes.join(' and ')}, calling you to rise to the occasion. These challenges have served as catalysts, pushing you to develop new strengths and perspectives as you navigate your path.`;
  } else {
    return `Your journey has presented both opportunities and challenges, calling you to grow and adapt. With ${entryCount} journal entries, you've been documenting this call to adventure, capturing the moments that have pushed you to expand your horizons.`;
  }
};

/**
 * Generate the Challenges & Trials section
 * @param {string} primaryMood - Primary mood from entries
 * @param {Array} entries - Journal entries
 * @returns {string} - Generated content
 */
const generateChallengesSection = (primaryMood, entries) => {
  const recentEntries = entries.slice(0, Math.min(entries.length, 5));
  const recentMoods = recentEntries.map(entry => entry.mood || 'Neutral');
  const hasChallenges = recentMoods.some(mood => 
    ['Stressed', 'Anxious', 'Sad', 'Frustrated'].includes(mood)
  );
  
  if (['Stressed', 'Anxious', 'Frustrated'].includes(primaryMood)) {
    return `You've faced obstacles that have often left you feeling ${primaryMood.toLowerCase()}, yet your persistence in journaling shows your commitment to self-reflection and growth. These challenges are shaping you, developing resilience and inner strength that will serve you well. Your journal entries reveal how you're navigating these trials, finding your way through difficulties with increasing wisdom.`;
  } else if (['Happy', 'Excited', 'Optimistic'].includes(primaryMood)) {
    if (hasChallenges) {
      return `While your journey has been characterized by ${primaryMood.toLowerCase()} moments overall, you've recently encountered some challenges that have tested your resilience. Your ability to maintain perspective through these trials demonstrates your growth. Your journal entries show how you're learning to integrate both the positive and challenging aspects of your experience.`;
    } else {
      return `Your journey has been characterized by ${primaryMood.toLowerCase()} moments, showing your ability to find joy and meaning in your experiences. This positive outlook has been your strength, helping you navigate challenges with grace and optimism. Even in difficult moments, your journal entries reveal your capacity to find the silver lining.`;
    }
  } else {
    return `Throughout your journey, you've experienced a range of emotions, learning to navigate both the highs and lows with increasing self-awareness. This emotional range is developing your capacity for resilience and adaptability. Your journal entries document this evolution, showing how you're growing through each experience, whether challenging or rewarding.`;
  }
};

/**
 * Generate the Transformation section
 * @param {Array} entries - Journal entries
 * @param {string} primaryMood - Primary mood from entries
 * @returns {string} - Generated content
 */
const generateTransformationSection = (entries, primaryMood) => {
  // Look for patterns of growth or change
  const hasGrowthThemes = entries.some(entry => 
    (entry.tags && entry.tags.some(tag => 
      ['Growth', 'Learning', 'Progress', 'Change', 'Development'].includes(tag)
    )) ||
    (entry.content && entry.content.toLowerCase().includes('learn') || 
     entry.content && entry.content.toLowerCase().includes('grow') || 
     entry.content && entry.content.toLowerCase().includes('change'))
  );
  
  if (hasGrowthThemes) {
    return `Your journal entries reveal a meaningful transformation taking place. Through reflection and experience, you're developing new perspectives and capabilities. The themes of growth and learning in your writing suggest you're actively engaged in your own development, consciously evolving through your experiences.`;
  } else if (['Happy', 'Excited', 'Optimistic', 'Inspired'].includes(primaryMood)) {
    return `Your predominantly ${primaryMood.toLowerCase()} outlook suggests a positive transformation in how you perceive and engage with your world. This shift in perspective is a powerful form of growth, allowing you to find opportunity and meaning even in challenging circumstances. Your journal entries document this evolution in your thinking.`;
  } else if (['Stressed', 'Anxious', 'Sad'].includes(primaryMood)) {
    ret
(Content truncated due to size limit. Use line ranges to read in chunks)