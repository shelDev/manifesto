import React, { useState } from 'react';
import { useSharing } from '../hooks/useSharing';

const ShareEntryModal = ({ entryId, onClose }) => {
  const [password, setPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [usePassword, setUsePassword] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  const {
    shareUrl,
    isShared,
    expiresAt,
    isPasswordProtected,
    loading,
    error,
    createShareLink,
    removeShareLink,
    copyShareUrl
  } = useSharing(entryId);
  
  const handleCreateShare = async () => {
    const options = {
      expires_at: expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : null,
      is_password_protected: usePassword,
      password: usePassword ? password : null
    };
    
    await createShareLink(options);
  };
  
  const handleCopyLink = async () => {
    const success = await copyShareUrl();
    if (success) {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Share Journal Entry</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!isShared ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Expires After</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
              >
                <option value={1}>1 day</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={0}>Never</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={usePassword}
                  onChange={() => setUsePassword(!usePassword)}
                  className="mr-2"
                />
                <span className="text-gray-700">Password Protection</span>
              </label>
            </div>
            
            {usePassword && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter a password"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShare}
                disabled={loading || (usePassword && !password)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Share Link'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Share Link</label>
              <div className="flex">
                <input 
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-l"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-purple-600 text-white rounded-r hover:bg-purple-700"
                >
                  Copy
                </button>
              </div>
              {showCopySuccess && (
                <p className="text-green-600 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            {expiresAt && (
              <div className="mb-4">
                <p className="text-gray-700">
                  Expires: {new Date(expiresAt).toLocaleDateString()} at {new Date(expiresAt).toLocaleTimeString()}
                </p>
              </div>
            )}
            
            {isPasswordProtected && (
              <div className="mb-4">
                <p className="text-gray-700">
                  Password protected: Yes
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={removeShareLink}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove Share'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareEntryModal;
