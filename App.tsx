/* eslint-disable camelcase */
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import {
	useFonts,
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state/store';
import UserContextProvider from "./src/contexts/UserContext"
import { Routes } from './src/routes';
import AppProvider from './src/hooks';
import TokenNotifications from './src/components/TokenNotifications';
import AppLoading from './AppLoading';
import { fontConfig } from './src/constants/fontConfig';

export default function App() {
	const [fontsLoaded] = useFonts({
		Roboto_100Thin,
		Roboto_300Light,
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const fonts = fontConfig({
		regular: {
			fontFamily: 'Roboto_400Regular',
			fontWeight: 'normal',
		},
		medium: {
			fontFamily: 'Roboto_700Bold',
			fontWeight: 'normal',
		},
		light: {
			fontFamily: 'Roboto_300Light',
			fontWeight: 'normal',
		},
		thin: {
			fontFamily: 'Roboto_100Thin',
			fontWeight: 'normal',
		},
	});

	const theme = {
		...DefaultTheme,
		roundness: 2,
		fonts: configureFonts(fonts),
		colors: {
			...DefaultTheme.colors,
			primary: '#28c17e',
			accent: '#f1c40f',
		},
	};

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Provider store={store}>
			<PersistGate loading={<ActivityIndicator size="large" color="#28c17e" />} persistor={persistor}>
				<AppProvider>
				<UserContextProvider>
					<PaperProvider theme={theme}>
						<SafeAreaProvider>
							<SafeAreaView style={{ flex: 1 }}>
								<NavigationContainer>
									<TokenNotifications>
										<StatusBar />
										<Routes />
									</TokenNotifications>
								</NavigationContainer>
							</SafeAreaView>
						</SafeAreaProvider>
					</PaperProvider>
					</UserContextProvider>
				</AppProvider>
			</PersistGate>
		</Provider>
	);
}
