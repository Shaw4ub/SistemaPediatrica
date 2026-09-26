import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LoginScreen,
  HomeScreen,
  ProfileScreen,
  SettingsScreen,
} from './frontend/src/screens';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  const navigateTo = (screenName) => {
    setCurrentScreen(screenName);
  };

  // Si no está autenticado, mostramos la pantalla de inicio de sesión
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaView>
    );
  }

  // Renderizado condicional de pantallas según la navegación activa
  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileScreen user={user} onBack={() => navigateTo('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return (
          <HomeScreen
            user={user}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
  },
});

