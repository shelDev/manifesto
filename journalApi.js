import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { saveJournalEntry, uploadAudio } from '../api/journalApi';

// Frontend API client for server integration
const journalApi = {
  // Get all journal entries for the authenticated user
  async getEntries(page = 1, limit = 10, sort = 'created_at', order = 'DESC', mood = null, search = null) {
    const token = localStorage.getItem('auth_token');
    let url = `/api/entries?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
    
    if (mood) url += `&mood=${mood}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    
    return response.json();
  },
  
  // Get a specific journal entry
  async getEntry(entryId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch entry');
    }
    
    return response.json();
  },
  
  // Create a new journal entry
  async createEntry(entryData) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create entry');
    }
    
    return response.json();
  },
  
  // Update an existing journal entry
  async updateEntry(entryId, entryData) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entryData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update entry');
    }
    
    return response.json();
  },
  
  // Delete a journal entry
  async deleteEntry(entryId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete entry');
    }
    
    return response.json();
  },
  
  // Upload audio recording for an entry
  async uploadAudio(entryId, audioBlob) {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch(`/api/entries/${entryId}/audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }
    
    return response.json();
  },
  
  // Get audio recording for an entry
  async getAudio(entryId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}/audio`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch audio');
    }
    
    return response.json();
  },
  
  // Generate AI analysis for an entry
  async analyzeEntry(entryId, options = {}) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze entry');
    }
    
    return response.json();
  },
  
  // Get AI analysis for an entry
  async getAnalysis(entryId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}/analysis`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }
    
    return response.json();
  },
  
  // Create a sharing link for an entry
  async shareEntry(entryId, options = {}) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}/share`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create share link');
    }
    
    return response.json();
  },
  
  // Remove sharing for an entry
  async removeShare(entryId) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`/api/entries/${entryId}/share`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove share');
    }
    
    return response.json();
  },
  
  // Access a shared entry
  async getSharedEntry(token, password = null) {
    let url = `/api/shared/${token}`;
    if (password) {
      url += `?password=${encodeURIComponent(password)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to access shared entry');
    }
    
    return response.json();
  }
};

export default journalApi;
