// src/utils/testing.js
/**
 * Utility functions for testing the application
 */

// Test if browser supports required APIs
export const testBrowserCompatibility = () => {
  const tests = {
    localStorage: typeof localStorage !== 'undefined',
    webAudio: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined',
    mediaRecorder: typeof MediaRecorder !== 'undefined',
    getUserMedia: navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function',
    speechRecognition: typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
  };
  
  const supported = Object.entries(tests).filter(([_, supported]) => supported).map(([name]) => name);
  const unsupported = Object.entries(tests).filter(([_, supported]) => !supported).map(([name]) => name);
  
  return {
    isFullySupported: unsupported.length === 0,
    supported,
    unsupported,
    tests
  };
};

// Test if localStorage is working correctly
export const testLocalStorage = () => {
  try {
    const testKey = '__test_storage__';
    const testValue = 'test';
    localStorage.setItem(testKey, testValue);
    const result = localStorage.getItem(testKey) === testValue;
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    console.error('LocalStorage test failed:', e);
    return false;
  }
};

// Test if audio recording is working
export const testAudioRecording = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        supported: false,
        error: 'MediaDevices API not supported'
      };
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    if (!MediaRecorder) {
      // Clean up the stream
      stream.getTracks().forEach(track => track.stop());
      
      return {
        supported: false,
        error: 'MediaRecorder API not supported'
      };
    }
    
    // Create a recorder but don't actually record
    const recorder = new MediaRecorder(stream);
    
    // Clean up the stream
    stream.getTracks().forEach(track => track.stop());
    
    return {
      supported: true,
      error: null
    };
  } catch (e) {
    console.error('Audio recording test failed:', e);
    return {
      supported: false,
      error: e.message || 'Unknown error'
    };
  }
};

// Log application errors for debugging
export const logError = (error, context = {}) => {
  console.error('Application Error:', error);
  console.error('Error Context:', context);
  
  // In a production app, you would send this to a logging service
  // For now, we'll just store it in localStorage for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('__app_errors__') || '[]');
    errors.push({
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack,
      context
    });
    
    // Keep only the last 10 errors to avoid filling up localStorage
    if (errors.length > 10) {
      errors.shift();
    }
    
    localStorage.setItem('__app_errors__', JSON.stringify(errors));
  } catch (e) {
    console.error('Error logging failed:', e);
  }
};

// Run a series of tests to verify application functionality
export const runApplicationTests = async () => {
  const results = {
    browserCompatibility: testBrowserCompatibility(),
    localStorage: testLocalStorage(),
    audioRecording: await testAudioRecording(),
  };
  
  const allPassed = 
    results.browserCompatibility.isFullySupported && 
    results.localStorage && 
    results.audioRecording.supported;
  
  return {
    allPassed,
    results
  };
};
