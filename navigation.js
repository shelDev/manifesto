import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screens
import DashboardScreenEnhanced from './screens/DashboardScreenEnhanced';
import RecordingScreenEnhanced from './screens/RecordingScreenEnhanced';
import BrowsingScreenFunctional from './screens/BrowsingScreenFunctional';
import AskJournalScreenEnhanced from './screens/AskJournalScreenEnhanced';
import InsightsScreenEnhanced from './screens/InsightsScreenEnhanced';

// Import theme
import theme from './theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Record') {
            iconName = focused ? 'mic' : 'mic-outline';
          } else if (route.name === 'Ask') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreenEnhanced} />
      <Tab.Screen name="Browse" component={BrowsingScreenFunctional} />
      <Tab.Screen 
        name="Record" 
        component={RecordingScreenEnhanced}
        options={{
          tabBarLabel: 'Record',
          tabBarIcon: ({ color, size }) => (
            <Ionicons 
              name="mic-circle" 
              size={size * 1.5} 
              color={theme.colors.primary} 
              style={{ marginBottom: -10 }}
            />
          ),
        }}
      />
      <Tab.Screen name="Ask" component={AskJournalScreenEnhanced} />
      <Tab.Screen name="Insights" component={InsightsScreenEnhanced} />
    </Tab.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Recording" component={RecordingScreenEnhanced} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
