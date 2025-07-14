import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation';
import theme from './src/theme';
import PresentationScreen from './src/screens/PresentationScreen';

// Set this to true to show the presentation screen instead of the app
const PRESENTATION_MODE = false;

export default function App() {
  return (
    <PaperProvider theme={theme}>
      {PRESENTATION_MODE ? <PresentationScreen /> : <AppNavigator />}
    </PaperProvider>
  );
}

AppRegistry.registerComponent('VoiceJournal', () => App);
