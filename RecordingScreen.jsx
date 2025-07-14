import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, TextField, 
  Card, CardContent, Chip, IconButton, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import WaveSurfer from 'wavesurfer.js';

import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { recordAudio, stopRecording } from '../utils/audioUtils';
import { saveJournalEntry } from '../api/journalApi';

const RecordButton = styled(IconButton)(({ theme, isrecording }) => ({
  backgroundColor: isrecording === 'true' ? theme.palette.error.main : theme.palette.primary.main,
  color: theme.palette.common.white,
  width: 80,
  height: 80,
  '&:hover': {
    backgroundColor: isrecording === 'true' ? theme.palette.error.dark : theme.palette.primary.dark,
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
}));

const WaveformContainer = styled(Box)({
  width: '100%',
  height: 120,
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
  padding: 16,
  marginTop: 24,
  marginBottom: 24,
});

const RecordingScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [topics, setTopics] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [waveform, setWaveform] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [calmMode, setCalmMode] = useState(false);
  
  // Initialize waveform
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: theme.palette.primary.light,
      progressColor: theme.palette.primary.main,
      cursorColor: theme.palette.secondary.main,
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
    });
    
    setWaveform(wavesurfer);
    
    return () => {
      wavesurfer.destroy();
    };
  }, []);
  
  // Update recording time
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle recording start/stop
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      const { audioBlob, audioUrl } = await stopRecording();
      setAudioBlob(audioBlob);
      
      // Load audio into waveform
      if (waveform) {
        waveform.load(audioUrl);
      }
      
      // Simulate transcription (in real app, this would call a transcription service)
      setIsSaving(true);
      setTimeout(() => {
        setTranscription("This is a simulated transcription of your voice journal entry. In the real application, this would be the actual transcription of what you said during your recording. The transcription would be processed by a speech-to-text service and then analyzed for mood and topics.");
        
        // Simulate mood and topic extraction
        setMood("reflective");
        setTopics(["work", "goals", "personal growth"]);
        setIsSaving(false);
      }, 2000);
      
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setTranscription('');
      await recordAudio();
    }
  };
  
  // Handle audio playback
  const togglePlayback = () => {
    if (waveform) {
      if (isPlaying) {
        waveform.pause();
      } else {
        waveform.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle waveform events
  useEffect(() => {
    if (waveform) {
      waveform.on('finish', () => {
        setIsPlaying(false);
      });
    }
  }, [waveform]);
  
  // Handle save entry
  const handleSaveEntry = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your journal entry');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In the real app, this would upload the audio file and save the entry
      await saveJournalEntry({
        title,
        content: transcription,
        mood,
        topics,
        audioBlob,
        userId: user.id
      });
      
      // Navigate to entries list
      navigate('/browse');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Toggle calm mode
  const toggleCalmMode = () => {
    setCalmMode(!calmMode);
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ 
        py: 4,
        opacity: calmMode && isRecording ? 0.3 : 1,
        transition: 'opacity 0.5s ease'
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" 
                    sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          Voice Journal
        </Typography>
        
        {!calmMode && (
          <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
            Record your thoughts, feelings, and ideas
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <RecordButton 
            isrecording={isRecording.toString()} 
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
          </RecordButton>
        </Box>
        
        {!calmMode && (
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Ready to record'}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={toggleCalmMode}
            sx={{ borderRadius: 20 }}
          >
            {calmMode ? 'Exit Calm Mode' : 'Enter Calm Mode'}
          </Button>
        </Box>
        
        {!isRecording && audioBlob && (
          <>
            <WaveformContainer>
              <div id="waveform"></div>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <IconButton onClick={togglePlayback} color="primary">
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Box>
            </WaveformContainer>
            
            {isSaving ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  label="Entry Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 3 }}
                />
                
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transcription
                    </Typography>
                    <Typography variant="body1">
                      {transcription || 'No transcription available yet'}
                    </Typography>
                  </CardContent>
                </Card>
                
                {mood && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Detected Mood:
                    </Typography>
                    <Chip 
                      label={mood} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                )}
                
                {topics.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Topics:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {topics.map((topic, index) => (
                        <Chip 
                          key={index} 
                          label={topic} 
                          variant="outlined" 
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setAudioBlob(null);
                      setTranscription('');
                      setTitle('');
                      setMood('');
                      setTopics([]);
                      if (waveform) waveform.empty();
                    }}
                  >
                    Discard
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveEntry}
                    disabled={!title.trim() || !transcription}
                  >
                    Save Entry
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default RecordingScreen;
