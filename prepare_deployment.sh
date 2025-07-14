#!/bin/bash

# Deployment script for Voice Journal Web Application
# This script prepares all necessary files for deployment to IONOS hosting

# Create deployment directory
mkdir -p /home/ubuntu/voice-journal-deployment

# Copy backend files
echo "Copying backend files..."
mkdir -p /home/ubuntu/voice-journal-deployment/backend
cp -r /home/ubuntu/voice-journal-backend/* /home/ubuntu/voice-journal-deployment/backend/

# Copy frontend files
echo "Copying frontend files..."
mkdir -p /home/ubuntu/voice-journal-deployment/frontend
cp -r /home/ubuntu/voice-journal-mockup/*.html /home/ubuntu/voice-journal-deployment/frontend/

# Create assets directories
mkdir -p /home/ubuntu/voice-journal-deployment/frontend/css
mkdir -p /home/ubuntu/voice-journal-deployment/frontend/js
mkdir -p /home/ubuntu/voice-journal-deployment/frontend/images
mkdir -p /home/ubuntu/voice-journal-deployment/uploads/audio

# Create CSS file
echo "Creating CSS files..."
cat > /home/ubuntu/voice-journal-deployment/frontend/css/styles.css << 'EOL'
:root {
    --primary-color: #6b46c1;
    --primary-light: #9f7aea;
    --primary-dark: #553c9a;
    --secondary-color: #f687b3;
    --background-color: #f7fafc;
    --text-color: #2d3748;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
}

.nav-item {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    color: var(--text-color);
    transition: all 0.2s ease;
}

.nav-item:hover {
    background-color: rgba(107, 70, 193, 0.1);
}

.nav-item.active {
    background-color: var(--primary-color);
    color: white;
}

.nav-item svg {
    margin-right: 0.5rem;
}

.entry-card {
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.entry-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.mood-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: var(--primary-light);
    color: white;
}

.topic-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color);
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.record-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(107, 70, 193, 0.3);
    transition: all 0.3s ease;
}

.record-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(107, 70, 193, 0.4);
}

.record-button.recording {
    background-color: #e53e3e;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 6px 15px rgba(229, 62, 62, 0.4);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);
    }
}

.waveform-container {
    height: 100px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 16px;
    position: relative;
    overflow: hidden;
}

.waveform {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.waveform-bar {
    width: 3px;
    background-color: var(--primary-light);
    border-radius: 3px;
    transition: height 0.1s ease;
}

.stat-card {
    border-radius: 0.5rem;
    padding: 1.5rem;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-container {
    height: 200px;
    position: relative;
}

.chart-bar {
    position: absolute;
    bottom: 0;
    width: 8%;
    background-color: var(--primary-light);
    border-radius: 4px 4px 0 0;
    transition: height 0.5s ease;
}

.chart-label {
    position: absolute;
    bottom: -25px;
    width: 8%;
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-color);
}

.filter-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: var(--primary-color);
    color: white;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.filter-pill button {
    margin-left: 0.5rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.filter-pill button:hover {
    opacity: 1;
}

.calm-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(107, 70, 193, 0.97);
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

.audio-player {
    width: 100%;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 16px;
    position: relative;
}

.audio-waveform {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
EOL

# Create JavaScript files
echo "Creating JavaScript files..."
mkdir -p /home/ubuntu/voice-journal-deployment/frontend/js

# Create main.js
cat > /home/ubuntu/voice-journal-deployment/frontend/js/main.js << 'EOL'
// Main JavaScript file for Voice Journal Web Application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeRecording();
    initializeSharing();
    initializeAuthentication();
});

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation (in a real app, this would navigate to the page)
            const targetPage = this.getAttribute('href') || '#';
            console.log('Navigating to:', targetPage);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const sidebar = document.querySelector('.w-64');
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('block');
        });
    }
}

// Recording functionality
function initializeRecording() {
    const recordButton = document.querySelector('.record-button');
    const waveformContainer = document.querySelector('.waveform-container');
    const transcriptionResult = document.querySelector('.bg-white.rounded-lg.shadow-md.p-6.mb-8');
    const aiAnalysis = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6.mb-8');
    const saveDiscardButtons = document.querySelector('.flex.justify-center.space-x-4');
    const calmModeToggle = document.querySelector('input[type="checkbox"]');
    const calmModeOverlay = document.querySelector('.calm-mode');
    
    if (recordButton) {
        let isRecording = false;
        
        recordButton.addEventListener('click', function() {
            isRecording = !isRecording;
            
            if (isRecording) {
                // Start recording
                recordButton.classList.add('recording');
                recordButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                `;
                
                // Show waveform
                if (waveformContainer) {
                    waveformContainer.classList.remove('hidden');
                    animateWaveform();
                }
            } else {
                // Stop recording
                recordButton.classList.remove('recording');
                recordButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                `;
                
                // Show transcription and analysis (simulating processing)
                setTimeout(() => {
                    if (transcriptionResult) transcriptionResult.classList.remove('hidden');
                    if (aiAnalysis) aiAnalysis.classList.remove('hidden');
                    if (saveDiscardButtons) saveDiscardButtons.classList.remove('hidden');
                }, 1500);
            }
        });
        
        // Calm Mode toggle
        if (calmModeToggle && calmModeOverlay) {
            calmModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    calmModeOverlay.classList.remove('hidden');
                } else {
                    calmModeOverlay.classList.add('hidden');
                }
            });
            
            // Exit Calm Mode button
            const exitCalmModeButton = calmModeOverlay.querySelector('button');
            if (exitCalmModeButton) {
                exitCalmModeButton.addEventListener('click', function() {
                    calmModeOverlay.classList.add('hidden');
                    calmModeToggle.checked = false;
                });
            }
        }
    }
}

// Animate waveform bars
function animateWaveform() {
    const waveformBars = document.querySelectorAll('.waveform-bar');
    
    if (waveformBars.length > 0) {
        setInterval(() => {
            waveformBars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 100) + '%';
                bar.style.height = randomHeight;
            });
        }, 100);
    }
}

// Sharing functionality
function initializeSharing() {
    const shareButtons = document.querySelectorAll('button:has(svg[stroke-linecap="round"][stroke-linejoin="round"][stroke-width="2"][d*="M8.684 13.342"])');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Share functionality would open a dialog to share this entry.');
        });
    });
    
    // Copy share link button
    const copyLinkButton = document.querySelector('button:has(.h-5.w-5.mr-1):contains("Copy Share Link")');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function() {
            alert('Link copied to clipboard!');
        });
    }
}

// Authentication functionality
function initializeAuthentication() {
    const logoutButton = document.querySelector('button:has(svg[d*="M17 16l4-4m0 0l-4-4m4 4H7"])');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                // In a real app, this would log the user out
                console.log('User logged out');
                // Redirect to login page
                // window.location.href = 'login.html';
            }
        });
    }
}
EOL

# Create audio.js
cat > /home/ubuntu/voice-journal-deployment/frontend/js/audio.js << 'EOL'
// Audio recording and playback functionality for Voice Journal

class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioBlob = null;
        this.audioUrl = null;
        this.stream = null;
        this.isRecording = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
    }
    
    async startRecording() {
        if (this.isRecording) return;
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];
            
            this.mediaRecorder.addEventListener('dataavailable', event => {
                this.audioChunks.push(event.data);
            });
            
            this.mediaRecorder.addEventListener('stop', () => {
                this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.audioUrl = URL.createObjectURL(this.audioBlob);
                this.isRecording = false;
                
                // Stop all tracks
                this.stream.getTracks().forEach(track => track.stop());
                
                // Trigger recording complete event
                const event = new CustomEvent('recordingComplete', { 
                    detail: { 
                        audioBlob: this.audioBlob,
                        audioUrl: this.audioUrl
                    } 
                });
                document.dispatchEvent(event);
            });
            
            // Set up audio analysis for waveform visualization
            this.setupAudioAnalysis();
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Trigger recording started event
            document.dispatchEvent(new Event('recordingStarted'));
            
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            return false;
        }
    }
    
    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
    }
    
    setupAudioAnalysis() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        
        const source = this.audioContext.createMediaStreamSource(this.stream);
        source.connect(this.analyser);
        
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
    }
    
    getAudioData() {
        if (!this.analyser || !this.dataArray) return null;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }
    
    async uploadAudio(url, formData) {
        if (!this.audioBlob) return null;
        
        formData = formData || new FormData();
        formData.append('audio', this.audioBlob, 'recording.wav');
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error uploading audio:', error);
            return null;
        }
    }
}

// Audio playback class
class AudioPlayer {
    constructor(audioUrl) {
        this.audio = new Audio(audioUrl);
        this.isPlaying = false;
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }
    
    stop() {
        this.audio.pause();
        
(Content truncated due to size limit. Use line ranges to read in chunks)