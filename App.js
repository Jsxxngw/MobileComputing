import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import CalendarScreen from './CalendarScreen';
import HomeScreen from './HomeScreen';
import UserDiaryScreen from './UserDiaryScreen';
import UserScreen from './UserScreen';
import { AppRegistry } from 'react-native';

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Calendar: { screen: CalendarScreen },
    User: { screen: UserScreen },
    UserDiary: { screen: UserDiaryScreen },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

const YourAppName = () => {
  return <AppContainer />;
};

AppRegistry.registerComponent('McApp', () => YourAppName);

export default YourAppName;
