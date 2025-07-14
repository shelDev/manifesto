import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

/**
 * Utility functions for storing and retrieving journal entries
 */

// Storage keys
const STORAGE_KEYS = {
  ENTRIES: 'journal_entries',
  SETTINGS: 'journal_settings',
  USER_PROFILE: 'user_profile',
};

/**
 * Save a new journal entry
 * @param {Object} entry - Journal entry object
 * @returns {Promise<Object>} - Saved entry with ID
 */
export const saveJournalEntry = async (entry) => {
  try {
    // Get existing entries
    const existingEntries = await getJournalEntries();
    
    // Generate a unique ID for the new entry
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add the new entry to the beginning of the array
    const updatedEntries = [newEntry, ...existingEntries];
    
    // Save the updated entries
    await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
    
    return newEntry;
  } catch (error) {
    console.error('Failed to save journal entry', error);
    throw error;
  }
};

/**
 * Get all journal entries
 * @returns {Promise<Array>} - Array of journal entries
 */
export const getJournalEntries = async () => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Failed to get journal entries', error);
    return [];
  }
};

/**
 * Get a single journal entry by ID
 * @param {string} id - Entry ID
 * @returns {Promise<Object|null>} - Journal entry or null if not found
 */
export const getJournalEntryById = async (id) => {
  try {
    const entries = await getJournalEntries();
    return entries.find(entry => entry.id === id) || null;
  } catch (error) {
    console.error('Failed to get journal entry', error);
    return null;
  }
};

/**
 * Update an existing journal entry
 * @param {string} id - Entry ID
 * @param {Object} updatedData - Updated entry data
 * @returns {Promise<Object|null>} - Updated entry or null if not found
 */
export const updateJournalEntry = async (id, updatedData) => {
  try {
    const entries = await getJournalEntries();
    const entryIndex = entries.findIndex(entry => entry.id === id);
    
    if (entryIndex === -1) {
      return null;
    }
    
    // Update the entry
    const updatedEntry = {
      ...entries[entryIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
    
    entries[entryIndex] = updatedEntry;
    
    // Save the updated entries
    await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    
    return updatedEntry;
  } catch (error) {
    console.error('Failed to update journal entry', error);
    throw error;
  }
};

/**
 * Delete a journal entry
 * @param {string} id - Entry ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteJournalEntry = async (id) => {
  try {
    const entries = await getJournalEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === entries.length) {
      return false; // Entry not found
    }
    
    // Save the updated entries
    await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filteredEntries));
    
    return true;
  } catch (error) {
    console.error('Failed to delete journal entry', error);
    throw error;
  }
};

/**
 * Search journal entries by text
 * @param {string} searchText - Text to search for
 * @returns {Promise<Array>} - Array of matching entries
 */
export const searchJournalEntries = async (searchText) => {
  try {
    if (!searchText.trim()) {
      return [];
    }
    
    const entries = await getJournalEntries();
    const searchLower = searchText.toLowerCase();
    
    return entries.filter(entry => 
      (entry.title && entry.title.toLowerCase().includes(searchLower)) ||
      (entry.content && entry.content.toLowerCase().includes(searchLower)) ||
      (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  } catch (error) {
    console.error('Failed to search journal entries', error);
    return [];
  }
};

/**
 * Filter journal entries by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} - Array of entries within date range
 */
export const filterEntriesByDateRange = async (startDate, endDate) => {
  try {
    const entries = await getJournalEntries();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  } catch (error) {
    console.error('Failed to filter entries by date range', error);
    return [];
  }
};

/**
 * Filter journal entries by mood
 * @param {string} mood - Mood to filter by
 * @returns {Promise<Array>} - Array of entries with matching mood
 */
export const filterEntriesByMood = async (mood) => {
  try {
    const entries = await getJournalEntries();
    
    return entries.filter(entry => 
      entry.mood && entry.mood.toLowerCase() === mood.toLowerCase()
    );
  } catch (error) {
    console.error('Failed to filter entries by mood', error);
    return [];
  }
};

/**
 * Filter journal entries by tags
 * @param {Array} tags - Array of tags to filter by
 * @returns {Promise<Array>} - Array of entries with matching tags
 */
export const filterEntriesByTags = async (tags) => {
  try {
    const entries = await getJournalEntries();
    
    return entries.filter(entry => 
      entry.tags && tags.some(tag => 
        entry.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Failed to filter entries by tags', error);
    return [];
  }
};

/**
 * Get entry statistics
 * @returns {Promise<Object>} - Statistics object
 */
export const getEntryStatistics = async () => {
  try {
    const entries = await getJournalEntries();
    
    // Calculate total entries
    const totalEntries = entries.length;
    
    // Calculate entries per day for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const last30DaysEntries = entries.filter(entry => 
      new Date(entry.createdAt) >= thirtyDaysAgo
    );
    
    // Group entries by day
    const entriesByDay = {};
    last30DaysEntries.forEach(entry => {
      const day = format(new Date(entry.createdAt), 'yyyy-MM-dd');
      entriesByDay[day] = (entriesByDay[day] || 0) + 1;
    });
    
    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let streakActive = false;
    
    // Check the last 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const checkDay = format(checkDate, 'yyyy-MM-dd');
      
      if (entriesByDay[checkDay]) {
        currentStreak = streakActive ? currentStreak + 1 : 1;
        streakActive = true;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        streakActive = false;
        currentStreak = 0;
      }
    }
    
    // Get mood distribution
    const moodCounts = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });
    
    // Get tag distribution
    const tagCounts = {};
    entries.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return {
      totalEntries,
      currentStreak,
      longestStreak,
      entriesByDay,
      moodCounts,
      tagCounts,
    };
  } catch (error) {
    console.error('Failed to get entry statistics', error);
    return {
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
      entriesByDay: {},
      moodCounts: {},
      tagCounts: {},
    };
  }
};

/**
 * Save user settings
 * @param {Object} settings - User settings
 * @returns {Promise<void>}
 */
export const saveSettings = async (settings) => {
  try {
    const existingSettings = await getSettings();
    const updatedSettings = { ...existingSettings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Failed to save settings', error);
    throw error;
  }
};

/**
 * Get user settings
 * @returns {Promise<Object>} - User settings
 */
export const getSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : {
      // Default settings
      darkMode: false,
      notifications: true,
      calmMode: false,
      privacyLock: false,
    };
  } catch (error) {
    console.error('Failed to get settings', error);
    return {
      darkMode: false,
      notifications: true,
      calmMode: false,
      privacyLock: false,
    };
  }
};

/**
 * Save user profile
 * @param {Object} profile - User profile
 * @returns {Promise<void>}
 */
export const saveUserProfile = async (profile) => {
  try {
    const existingProfile = await getUserProfile();
    const updatedProfile = { ...existingProfile, ...profile };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
  } catch (error) {
    console.error('Failed to save user profile', error);
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfile = async () => {
  try {
    const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileJson ? JSON.parse(profileJson) : {
      // Default profile
      name: 'User',
      email: '',
      avatar: null,
    };
  } catch (error) {
    console.error('Failed to get user profile', error);
    return {
      name: 'User',
      email: '',
      avatar: null,
    };
  }
};

/**
 * Clear all journal data (for testing or reset)
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ENTRIES,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.USER_PROFILE,
    ]);
  } catch (error) {
    console.error('Failed to clear all data', error);
    throw error;
  }
};
