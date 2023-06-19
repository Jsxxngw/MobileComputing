import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      savedDates: {},
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('User')}
          >
            <Ionicons name="person" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  render() {
    const containerStyle = [styles.container, { marginTop: -60 }];

    return (
      <View style={containerStyle}>
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => this.handleDayPress(day)}
          markedDates={{
            ...this.state.savedDates,
            [this.state.selectedDate]: {
              selected: true,
              customStyles: {
                container: {
                  backgroundColor: 'red',
                },
              },
            },
          }}
          markingType={'custom'}
        />
      </View>
    );
  }
  handleDiaryDeleted = (date) => {
    this.setState((prevState) => {
      const updatedSavedDates = { ...prevState.savedDates };
      delete updatedSavedDates[date];
      return { savedDates: updatedSavedDates };
    });
  };

  handleDiarySaved = (date) => {
    this.setState((prevState) => ({
      savedDates: {
        ...prevState.savedDates,
        [date]: {
          selected: true,
          selectedColor: 'green',
        },
      },
    }));
  };


  handleDayPress(day) {
    this.setState({
      selectedDate: day.dateString,
    });

    const savedDiary = this.state.savedDates[day.dateString];

    if (savedDiary) {
      Alert.alert(
        '일기 작성',
        '이미 저장된 일기가 있습니다. 새로 작성하시겠습니까?',
        [
          {
            text: '취소',
 style: 'cancel',
          },
          {
            text: '새로 작성',
            onPress: () => {
              this.props.navigation.navigate('UserDiary', {
                date: day.dateString,
                onDiarySaved: this.handleDiarySaved,
                onDiaryDeleted: this.handleDiaryDeleted,
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      this.props.navigation.navigate('UserDiary', {
        date: day.dateString,
        onDiarySaved: this.handleDiarySaved,
        onDiaryDeleted: this.handleDiaryDeleted,
      });
    }
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  calendar: {
    aspectRatio: 1,
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: 'white',
    width: '90%',
  },
  iconContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  iconButton: {
    marginRight: 10,
  },
  header: {
    backgroundColor: 'white',
  },
});

export default CalendarScreen;
