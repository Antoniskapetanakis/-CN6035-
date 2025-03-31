import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

enableScreens();

import LoginScreen from './app/LoginScreen';
import RegisterScreen from './app/RegisterScreen';
import Home from './app/Home';
import About from './app/About';
import Contact from './app/Contact';
import ReserveScreen from './app/ReserveScreen';
import ProfileScreen from './app/ProfileScreen';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      login: '',
      home: 'home',
      register: 'register',
      about: 'about',
      contact: 'contact',
      reservation: 'reservation',
      profile: 'profile',
      NotFound: '*',
    },
  },
};

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text style={{ color: 'white', marginLeft: 10, fontSize: 18 }}>←</Text>
    </TouchableOpacity>
  );
};

const NotFoundScreen = () => (
  <Text style={{ color: 'red', fontSize: 24, textAlign: 'center', marginTop: 50 }}>
    404 - Page Not Found
  </Text>
);

const App = () => {
  console.log('App component is rendering'); 

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        {console.log('NavigationContainer is rendering')} 
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="about"
            component={About}
            options={{
              headerTitle: '',
              headerBackTitleVisible: false,
              headerLeft: () => <CustomBackButton />,
              headerStyle: { backgroundColor: '#000' },
            }}
          />
          <Stack.Screen
            name="contact"
            component={Contact}
            options={{
              headerTitle: '',
              headerBackTitleVisible: false,
              headerLeft: () => <CustomBackButton />,
              headerStyle: { backgroundColor: '#000' },
            }}
          />

          <Stack.Screen
            name="reservation"
            component={ReserveScreen}
            options={{ headerShown: true, title: 'Reservation' }}
          />
          <Stack.Screen
            name="profile"
            component={ProfileScreen}
            options={{ headerTitle: 'Profile', headerBackTitleVisible: false, headerStyle: { backgroundColor: '#000' } }}
          />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;