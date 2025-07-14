# Manifesto Documentation

## Overview

Manifesto is a mobile application that allows users to easily record their thoughts, emotions, notes, reminders, and memories through voice journaling. The app provides AI-driven insights to encourage self-reflection and transforms journal entries into an epic hero's journey narrative.

## Features

### Voice Recording
- Record thoughts and feelings with a simple interface
- Real-time waveform visualization during recording
- "Calm Mode" for distraction-free journaling
- Automatic transcription of voice to text

### AI-Powered Analysis
- Advanced sentiment analysis identifying emotional dimensions
- Topic extraction and theme identification
- Correlation insights between moods and topics
- Personalized journal prompts based on writing patterns
- Natural language query processing with confidence scoring
- Hero's journey narrative generation

### Journal Management
- Browse and search journal entries
- Filter by mood, date, and topics
- View detailed entry information with mood analysis
- Share entries to social media (optional)

### Insights and Visualization
- Mood trends over time (week, month, year)
- Topic distribution and analysis
- Interactive hero's journey narrative
- Correlation visualizations between moods and topics

## Technical Architecture

### Frontend
- React Native with Expo for cross-platform mobile development
- React Navigation for screen navigation
- React Native Paper for UI components
- Styled Components for styling

### Core Utilities
- `audioUtils.js`: Handles voice recording, playback, and waveform visualization
- `storage.js`: Manages journal entry storage, retrieval, and filtering
- `aiUtils.js`: Provides basic AI-driven mood analysis and tag generation
- `advancedAiUtils.js`: Implements sophisticated AI features like advanced sentiment analysis, topic extraction, and narrative generation

### Screens
- `DashboardScreenEnhanced.js`: Overview of journal activity, recent entries, and personalized prompts
- `RecordingScreenEnhanced.js`: Voice recording interface with waveform visualization and Calm Mode
- `BrowsingScreenFunctional.js`: Journal entry list with search and filtering capabilities
- `AskJournalScreenEnhanced.js`: Natural language query interface with confidence indicators
- `InsightsScreenEnhanced.js`: Data visualization of mood trends, topics, correlations, and hero's journey

## Design

The application features a clean, bold design inspired by Superhuman but with a lighter color scheme. It incorporates purple line-art style icons for a distinctive and engaging user interface.

### Color Palette
- Primary: #6200ee (Purple)
- Primary Light: #9b4dff
- Accent 1: #03dac6 (Teal)
- Accent 2: #ff6e40 (Orange)
- Background: #f5f5f5 (Light Gray)
- Card: #ffffff (White)
- Card Dark: #f0f0f0 (Slightly Darker White)
- Text: #212121 (Near Black)
- Text Secondary: #757575 (Medium Gray)
- Text Light: #9e9e9e (Light Gray)
- Border: #e0e0e0 (Very Light Gray)
- Success: #4caf50 (Green)
- Error: #f44336 (Red)

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation Steps
1. Clone the repository
   ```
   git clone https://github.com/yourusername/voice-journal-app.git
   cd voice-journal-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Run on iOS or Android
   ```
   npm run ios
   ```
   or
   ```
   npm run android
   ```

## Usage Guide

### Recording a Journal Entry
1. Navigate to the "Record" tab
2. Tap the "Start Recording" button
3. Speak naturally about your thoughts and feelings
4. Tap the "Stop Recording" button when finished
5. Review the transcription, mood analysis, and topic extraction
6. Tap "Save Journal Entry" to save

### Browsing Journal Entries
1. Navigate to the "Browse" tab
2. Scroll through your entries or use the search bar
3. Use filters to narrow down entries by mood, date, or topics
4. Tap on an entry to view details

### Asking Questions About Your Journal
1. Navigate to the "Ask" tab
2. Type a question about your thoughts, feelings, or experiences
3. Tap "Ask Journal" to get an answer
4. View the response, confidence level, related entries, and suggested actions

### Viewing Insights
1. Navigate to the "Insights" tab
2. Switch between time ranges (week, month, year)
3. Explore different tabs:
   - Mood Trends: View mood patterns over time
   - Topics: See distribution of topics in your journal
   - Correlations: Discover relationships between moods and topics
   - Journey: Read your hero's journey narrative

## Testing

The application has undergone comprehensive testing to ensure all features work as expected:

- Functionality testing: Voice recording, transcription, storage, browsing, and querying
- AI feature testing: Sentiment analysis, topic extraction, narrative generation, and personalized prompts
- UI/UX testing: Responsive design, navigation flow, visual consistency, and accessibility
- Performance testing: Loading times, processing speed, scrolling performance, and memory usage

All tests have passed successfully, confirming that the application meets all requirements.

## Future Enhancements

Potential future enhancements for the Manifesto app include:

1. Cloud synchronization for backup and multi-device access
2. Voice command support for hands-free journaling
3. Integration with wearable devices for mood tracking
4. Enhanced visualization options for insights
5. Collaborative journaling features for shared experiences
6. Export options for journal entries (PDF, Word, etc.)
7. Integration with calendar and reminder apps

## Conclusion

Manifesto is a powerful tool for self-reflection and personal growth. By combining the ease of voice recording with sophisticated AI analysis, it provides users with valuable insights into their thoughts, feelings, and patterns over time. The hero's journey narrative feature transforms everyday journaling into an epic story of personal development, encouraging continued use and deeper self-understanding.
