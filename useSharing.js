import React, { useState, useEffect } from 'react';
import journalApi from '../api/journalApi';
import { useAuth } from '../hooks/useAuth';

// Custom hook for sharing journal entries
export const useSharing = (entryId = null) => {
  const [shareUrl, setShareUrl] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  // Create a sharing link for an entry
  const createShareLink = async (options = {}) => {
    if (!user || !entryId) {
      setError('Cannot share: No entry selected or user not authenticated');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const shareData = await journalApi.shareEntry(entryId, options);
      
      setShareUrl(shareData.share_url);
      setIsShared(true);
      setExpiresAt(shareData.expires_at);
      setIsPasswordProtected(shareData.is_password_protected);
      
      setLoading(false);
      return shareData;
    } catch (err) {
      console.error('Error creating share link:', err);
      setError('Failed to create share link: ' + err.message);
      setLoading(false);
      return null;
    }
  };
  
  // Remove sharing for an entry
  const removeShareLink = async () => {
    if (!user || !entryId) {
      setError('Cannot remove share: No entry selected or user not authenticated');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await journalApi.removeShare(entryId);
      
      setShareUrl(null);
      setIsShared(false);
      setExpiresAt(null);
      setIsPasswordProtected(false);
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Error removing share:', err);
      setError('Failed to remove share: ' + err.message);
      setLoading(false);
      return false;
    }
  };
  
  // Check if an entry is shared
  const checkShareStatus = async (checkEntryId = null) => {
    const targetEntryId = checkEntryId || entryId;
    
    if (!user || !targetEntryId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const entry = await journalApi.getEntry(targetEntryId);
      
      if (entry.is_public && entry.share_token) {
        setIsShared(true);
        setShareUrl(`https://${window.location.host}/shared/${entry.share_token}`);
        setExpiresAt(entry.share_expires);
        
        // Check if there's password protection by looking for shared_access
        const shareData = await journalApi.getShareInfo(targetEntryId);
        if (shareData) {
          setIsPasswordProtected(shareData.is_password_protected);
        }
      } else {
        setIsShared(false);
        setShareUrl(null);
        setExpiresAt(null);
        setIsPasswordProtected(false);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error checking share status:', err);
      setLoading(false);
    }
  };
  
  // Access a shared entry (for recipients)
  const accessSharedEntry = async (token, password = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const sharedEntry = await journalApi.getSharedEntry(token, password);
      setLoading(false);
      return sharedEntry;
    } catch (err) {
      console.error('Error accessing shared entry:', err);
      setError('Failed to access shared entry: ' + err.message);
      setLoading(false);
      return null;
    }
  };
  
  // Copy share URL to clipboard
  const copyShareUrl = async () => {
    if (!shareUrl) {
      setError('No share URL to copy');
      return false;
    }
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setError('Failed to copy to clipboard');
      return false;
    }
  };
  
  // Check share status when entryId changes
  useEffect(() => {
    if (entryId) {
      checkShareStatus();
    } else {
      setIsShared(false);
      setShareUrl(null);
      setExpiresAt(null);
      setIsPasswordProtected(false);
    }
  }, [entryId, user]);
  
  return {
    shareUrl,
    isShared,
    expiresAt,
    isPasswordProtected,
    loading,
    error,
    createShareLink,
    removeShareLink,
    checkShareStatus,
    accessSharedEntry,
    copyShareUrl
  };
};
