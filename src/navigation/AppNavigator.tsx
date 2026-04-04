import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SessionDetailScreen from '../screens/SessionDetailScreen';
import PlayerScreen from '../screens/PlayerScreen';
import SummaryScreen from '../screens/SummaryScreen';
import CreateSessionScreen from '../screens/CreateSessionScreen';
import CreatePoseScreen from '../screens/CreatePoseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { HomeStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Summary" component={SummaryScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="CreateSession" component={CreateSessionScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="CreatePose" component={CreatePoseScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
