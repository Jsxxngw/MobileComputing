import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends React.Component {
  state = {
    diaryCount: 0,
  };

  // 컴포넌트가 마운트되면 일기 개수를 가져옵니다.
  async componentDidMount() {
    const diaryCount = await this.getDiaryCount();
    this.setState({ diaryCount });
  }

  // 일기 개수를 가져옵니다.
  getDiaryCount = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const diaryKeys = keys.filter((key) => key.startsWith('diary_'));
      return diaryKeys.length;
    } catch (error) {
      console.log('Error retrieving diary count:', error); // 에러 처리(선택 사항)
      return 0;
    }
  };

  // 버튼을 누르면 Calendar로 이동합니다.
  handleButtonPress = () => {
    this.props.navigation.navigate('Calendar');
  };
  
  // 일기 개수에 따라 배경 이미지를 변경합니다.
  render() {
    const { diaryCount } = this.state;
    let backgroundImageSource = require('./assets/pic1.png');

    
    if (diaryCount >= 3) {
      backgroundImageSource = require('./assets/pic3.png');
    }

    if (diaryCount >= 5) {
      backgroundImageSource = require('./assets/pic3.png');
    }

    return (
      // 배경 이미지를 설정하고 뷰를 렌더링합니다.
      <ImageBackground source={backgroundImageSource} style={styles.backgroundImage}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this.handleButtonPress}>
            <Text style={styles.buttonText}>터치하세요</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
});

export default HomeScreen;
