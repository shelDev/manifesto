import React, { useState, useEffect } from 'react';
import journalApi from '../api/journalApi';
import { useAuth } from '../hooks/useAuth';

// Custom hook for journal entries with server integration
export const useJournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    sort: 'created_at',
    order: 'DESC',
    mood: null,
    search: null
  });
  
  const { user } = useAuth();
  
  // Fetch entries from server
  const fetchEntries = async (page = 1, limit = 10, sort = 'created_at', order = 'DESC', mood = null, search = null) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await journalApi.getEntries(page, limit, sort, order, mood, search);
      
      setEntries(result.entries);
      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      });
      
      setFilters({
        sort,
        order,
        mood,
        search
      });
      
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load journal entries');
      setLoading(false);
      return null;
    }
  };
  
  // Fetch a single entry
  const fetchEntry = async (entryId) => {
    if (!user || !entryId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const entry = await journalApi.getEntry(entryId);
      setLoading(false);
      return entry;
    } catch (err) {
      console.error('Error fetching entry:', err);
      setError('Failed to load journal entry');
      setLoading(false);
      return null;
    }
  };
  
  // Create a new entry
  const createEntry = async (entryData) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newEntry = await journalApi.createEntry(entryData);
      
      // Update entries list with the new entry
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      
      setLoading(false);
      return newEntry;
    } catch (err) {
      console.error('Error creating entry:', err);
      setError('Failed to create journal entry');
      setLoading(false);
      return null;
    }
  };
  
  // Update an existing entry
  const updateEntry = async (entryId, entryData) => {
    if (!user || !entryId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedEntry = await journalApi.updateEntry(entryId, entryData);
      
      // Update entries list with the updated entry
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.entry_id === entryId ? updatedEntry : entry
        )
      );
      
      setLoading(false);
      return updatedEntry;
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update journal entry');
      setLoading(false);
      return null;
    }
  };
  
  // Delete an entry
  const deleteEntry = async (entryId) => {
    if (!user || !entryId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await journalApi.deleteEntry(entryId);
      
      // Remove the deleted entry from the entries list
      setEntries(prevEntries => 
        prevEntries.filter(entry => entry.entry_id !== entryId)
      );
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete journal entry');
      setLoading(false);
      return false;
    }
  };
  
  // Generate AI analysis for an entry
  const analyzeEntry = async (entryId, options = {}) => {
    if (!user || !entryId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await journalApi.analyzeEntry(entryId, options);
      setLoading(false);
      return analysis;
    } catch (err) {
      console.error('Error analyzing entry:', err);
      setError('Failed to analyze journal entry');
      setLoading(false);
      return null;
    }
  };
  
  // Create a sharing link for an entry
  const shareEntry = async (entryId, options = {}) => {
    if (!user || !entryId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const shareData = await journalApi.shareEntry(entryId, options);
      
      // Update entries list to reflect sharing status
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.entry_id === entryId ? { ...entry, is_public: true } : entry
        )
      );
      
      setLoading(false);
      return shareData;
    } catch (err) {
      console.error('Error sharing entry:', err);
      setError('Failed to create share link');
      setLoading(false);
      return null;
    }
  };
  
  // Remove sharing for an entry
  const removeShare = async (entryId) => {
    if (!user || !entryId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await journalApi.removeShare(entryId);
      
      // Update entries list to reflect sharing status
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.entry_id === entryId ? { ...entry, is_public: false } : entry
        )
      );
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error removing share:', err);
      setError('Failed to remove share');
      setLoading(false);
      return false;
    }
  };
  
  // Load initial entries when user changes
  useEffect(() => {
    if (user) {
      fetchEntries(
        pagination.page,
        pagination.limit,
        filters.sort,
        filters.order,
        filters.mood,
        filters.search
      );
    } else {
      setEntries([]);
    }
  }, [user]);
  
  return {
    entries,
    loading,
    error,
    pagination,
    filters,
    fetchEntries,
    fetchEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    analyzeEntry,
    shareEntry,
    removeShare,
    setFilters
  };
};
