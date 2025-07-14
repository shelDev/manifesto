import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import journalApi from '../api/journalApi';

const SharedEntryView = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [entry, setEntry] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  
  // Fetch shared entry
  const fetchSharedEntry = async (entryPassword = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const sharedEntry = await journalApi.getSharedEntry(token, entryPassword);
      setEntry(sharedEntry);
      
      // If entry has audio, set audio URL
      if (sharedEntry.audio) {
        setAudioUrl(`/api/shared/${token}/audio?password=${entryPassword || ''}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error accessing shared entry:', err);
      
      // Check if error is due to password protection
      if (err.message.includes('Password required') || err.message.includes('incorrect')) {
        setIsPasswordProtected(true);
        setError('This entry is password protected');
      } else {
        setError('Failed to access shared entry: ' + err.message);
      }
      
      setLoading(false);
    }
  };
  
  // Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    fetchSharedEntry(password);
  };
  
  // Toggle audio playback
  const togglePlayback = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Initialize audio element
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
      
      return () => {
        audio.pause();
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [audioUrl]);
  
  // Fetch shared entry on component mount
  useEffect(() => {
    fetchSharedEntry();
  }, [token]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (isPasswordProtected && !entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-purple-800 mb-4">Password Protected Entry</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Access Entry
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  if (error && !entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Entry Not Found</h1>
          <p className="text-gray-700 mb-4">This shared entry may have expired or been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-purple-800">{entry.title}</h1>
              <div className="text-gray-500 text-sm">
                Shared by {entry.author} on {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {audioUrl && (
              <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-center">
                  <button
                    onClick={togglePlayback}
                    className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </div>
            
            {entry.mood && (
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                  Mood: {entry.mood}
                </span>
              </div>
            )}
            
            {entry.topics && entry.topics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.topics.map((topicItem, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold text-gray-700"
                    >
                      {topicItem.topic || topicItem}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {entry.analysis && entry.analysis.hero_journey && (
              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">Hero's Journey</h3>
                <p className="text-gray-700">{JSON.parse(entry.analysis.hero_journey).narrative}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Voice Journal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedEntryView;
