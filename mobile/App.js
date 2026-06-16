import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProfileProvider, useProfiles } from './src/context/ProfileContext';
import { colors } from './src/theme/colors';
import { loadStoredApiBase } from './src/lib/api';

import GetStarted from './src/screens/GetStarted';
import ServerConfig from './src/screens/ServerConfig';
import ProfilePicker from './src/screens/ProfilePicker';
import ProfileCreate from './src/screens/ProfileCreate';
import OnboardingExplain from './src/screens/OnboardingExplain';
import Home from './src/screens/Home';
import Dashboard from './src/screens/Dashboard';
import DayTracker from './src/screens/DayTracker';
import Progress from './src/screens/Progress';
import Profile from './src/screens/Profile';
import Settings from './src/screens/Settings';
import GoalsOverview from './src/screens/GoalsOverview';
import CategoryPicker from './src/screens/CategoryPicker';
import CategoryGoals from './src/screens/CategoryGoals';
import CustomGoal from './src/screens/CustomGoal';
import AccountSecurity from './src/screens/AccountSecurity';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.headline,
    primary: colors.button,
    border: colors.divider,
    notification: colors.button,
  },
};

const screenOptions = { headerShown: false, contentStyle: { backgroundColor: colors.background } };

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="GetStarted">
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="ServerConfig" component={ServerConfig} />
    </Stack.Navigator>
  );
}

function ProfileBootstrapStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="ProfilePicker">
      <Stack.Screen name="ProfilePicker" component={ProfilePicker} />
      <Stack.Screen name="ProfileCreate" component={ProfileCreate} />
      <Stack.Screen name="Onboarding" component={OnboardingExplain} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Home">
      {/* Tabs */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Progress" component={Progress} />
      <Stack.Screen name="GoalsOverview" component={GoalsOverview} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />

      {/* Sub-flows */}
      <Stack.Screen name="DayTracker" component={DayTracker} />
      <Stack.Screen name="CategoryPicker" component={CategoryPicker} />
      <Stack.Screen name="CategoryGoals" component={CategoryGoals} />
      <Stack.Screen name="CustomGoal" component={CustomGoal} />
      <Stack.Screen name="AccountSecurity" component={AccountSecurity} />
      <Stack.Screen name="ServerConfig" component={ServerConfig} />
      <Stack.Screen name="ProfilePicker" component={ProfilePicker} />
      <Stack.Screen name="ProfileCreate" component={ProfileCreate} />
      <Stack.Screen name="Onboarding" component={OnboardingExplain} />
    </Stack.Navigator>
  );
}

function Gate() {
  const { user, bootstrapped } = useAuth();
  const { profiles, ready: profilesReady } = useProfiles();

  if (!bootstrapped) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.paragraph} />
      </View>
    );
  }
  if (!user) return <AuthStack />;
  if (!profilesReady) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.paragraph} />
      </View>
    );
  }
  if (profiles.length === 0) return <ProfileBootstrapStack />;
  return <MainStack />;
}

export default function App() {
  const [apiReady, setApiReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  useEffect(() => {
    loadStoredApiBase().finally(() => setApiReady(true));
  }, []);

  // Render once the API base is resolved and fonts are ready. If fonts fail to
  // load we still proceed (system fallbacks) rather than block the app forever.
  if (!apiReady || (!fontsLoaded && !fontError)) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.paragraph} />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider>
          <StatusBar style="light" backgroundColor={colors.background} />
          <NavigationContainer theme={navTheme}>
            <Gate />
          </NavigationContainer>
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
