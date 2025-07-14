import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import useAudioRecorder from '../../hooks/useAudioRecorder';
import { transcribeAudio } from '../../utils/transcription';
import { analyzeMood, extractTopics } from '../../utils/aiUtils';
import { saveJournalEntry } from '../../utils/storage';

export default function RecordPage() {
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    audioURL, 
    formattedTime,
    error 
  } = useAudioRecorder();
  
  const [transcription, setTranscription] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  
  // Handle recording stop and transcription
  useEffect(() => {
    if (audioURL && !isRecording) {
      // Fetch the audio blob from the URL
      fetch(audioURL)
        .then(response => response.blob())
        .then(blob => {
          setAudioBlob(blob);
          return transcribeAudio(blob);
        })
        .then(result => {
          if (result.success) {
            setTranscription(result.text);
            
            // Analyze mood and extract topics
            const moodResult = analyzeMood(result.text);
            setMoodAnalysis(moodResult);
            
            const extractedTopics = extractTopics(result.text);
            setTopics(extractedTopics);
          } else {
            setTranscription("Transcription failed. Please try again.");
          }
        })
        .catch(err => {
          console.error('Error processing audio:', err);
          setTranscription("Error processing audio. Please try again.");
        });
    }
  }, [audioURL, isRecording]);
  
  const handleSaveEntry = async () => {
    if (!transcription) return;
    
    setIsSaving(true);
    
    try {
      // Create entry object
      const entry = {
        text: transcription,
        mood: moodAnalysis?.mood || 'neutral',
        topics: topics,
        audioUrl: audioURL, // In a real app, we'd store this in a more permanent way
        title: `Journal Entry - ${new Date().toLocaleDateString()}`
      };
      
      // Save entry
      const savedEntry = saveJournalEntry(entry);
      
      if (savedEntry) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleNewRecording = () => {
    setTranscription('');
    setMoodAnalysis(null);
    setTopics([]);
    setSaveSuccess(false);
  };
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Voice Journal</h1>
          <p className="text-text-secondary">Record your thoughts and feelings</p>
        </div>

        <div className="card max-w-3xl mx-auto p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Voice Recording</h2>
            <p className="text-text-secondary mb-6">Tap the button below to start recording your thoughts</p>
            
            {error && (
              <div className="bg-error-light text-error p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {isRecording ? (
              <button 
                onClick={stopRecording} 
                className="btn bg-error text-white px-8 py-3 text-lg"
              >
                Stop Recording
              </button>
            ) : (
              <button 
                onClick={startRecording} 
                className="btn btn-primary px-8 py-3 text-lg"
                disabled={isSaving}
              >
                Start Recording
              </button>
            )}
          </div>

          <div className="bg-background-dark rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Waveform</h3>
              <span className="text-text-secondary">{formattedTime}</span>
            </div>
            <div className="h-24 flex items-center justify-center">
              {isRecording ? (
                <div className="flex items-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 64 + 16}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    ></div>
                  ))}
                </div>
              ) : audioURL ? (
                <div className="w-full">
                  <audio src={audioURL} controls className="w-full" />
                </div>
              ) : (
                <p className="text-text-secondary">Waveform visualization will appear here during recording</p>
              )}
            </div>
          </div>

          <div className="bg-background-dark rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Transcription</h3>
            {transcription ? (
              <p className="text-text-primary">{transcription}</p>
            ) : (
              <p className="text-text-secondary">Your journal entry transcription will appear here after recording</p>
            )}
          </div>

          {moodAnalysis && (
            <div className="bg-background-dark rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Mood Analysis</h3>
                <span className={`badge ${
                  moodAnalysis.mood === 'happy' ? 'badge-success' :
                  moodAnalysis.mood === 'sad' ? 'badge-error' :
                  'badge-primary'
                }`}>
                  {moodAnalysis.mood.charAt(0).toUpperCase() + moodAnalysis.mood.slice(1)}
                </span>
              </div>
              <p className="text-text-primary mb-4">{moodAnalysis.analysis}</p>
              
              {topics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <span key={index} className="badge badge-primary">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {transcription && (
            <div className="flex justify-between">
              <button 
                onClick={handleNewRecording}
                className="btn btn-outline"
                disabled={isRecording || isSaving}
              >
                New Recording
              </button>
              
              <button 
                onClick={handleSaveEntry}
                className="btn btn-primary"
                disabled={isRecording || isSaving || saveSuccess}
              >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Entry'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
