import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';

export default function AppLoading() {
  //alert("Ola")
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Carregando...</Text>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}
