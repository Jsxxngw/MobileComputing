import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

class UserDiaryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: '',
      month: '',
      day: '',
      dailyText: '',
      mentalText: '',
      healthText: '',
      currentSection: 'daily', // 현재 선택된 섹션 (daily, mental, health)
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const date = navigation.getParam('date', '');

    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    const dailyText = await this.getDiary(`${date}_daily`);
    const mentalText = await this.getDiary(`${date}_mental`);
    const healthText = await this.getDiary(`${date}_health`);

    this.setState({
      year: year,
      month: month,
      day: day,
      dailyText,
      mentalText,
      healthText,
    });
  }

  getDiary = async (key) => {
    try {
      const diary = await AsyncStorage.getItem(key);
      if (diary !== null) {
        return diary;
      } else {
        return '';
      }
    } catch (error) {
      console.log('Error retrieving diary:', error);
      return '';
    }
  };

  saveDiary = async (key, text) => {
    try {
      await AsyncStorage.setItem(key, text);
      console.log('Diary saved successfully.');
    } catch (error) {
      console.log('Error saving diary:', error);
    }
  };
  
  handleSave = async () => {
    const { dailyText, mentalText, healthText } = this.state;
    const { navigation } = this.props;
    const date = navigation.getParam('date', '');
  
    if (dailyText.trim() === '' && mentalText.trim() === '' && healthText.trim() === '') {
      return;
    }
  
    if (dailyText.trim() !== '') {
      await this.saveDiary(`${date}_daily`, dailyText);
    }
  
    if (mentalText.trim() !== '') {
      await this.saveDiary(`${date}_mental`, mentalText);
    }
  
    if (healthText.trim() !== '') {
      await this.saveDiary(`${date}_health`, healthText);
    }
  
    if (navigation.getParam('onDiarySaved')) {
      navigation.getParam('onDiarySaved')(date);
    }
  };
  

  handleDelete = () => {
    Alert.alert(
      '일기 삭제',
      '삭제 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: async () => {
            await this.deleteDiary();
            if (this.props.navigation.getParam('onDiaryDeleted')) {
              this.props.navigation.getParam('onDiaryDeleted')(this.props.navigation.getParam('date', ''));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  deleteDiary = async () => {
    const { navigation } = this.props;
    const date = navigation.getParam('date', '');
    const currentSection = this.state.currentSection;

    try {
      await AsyncStorage.removeItem(`${date}_${currentSection}`);
      console.log('Diary deleted successfully.');
    } catch (error) {
      console.log('Error deleting diary:', error);
    }

    this.setState({
      dailyText: '',
      mentalText: '',
      healthText: '',
    });
  };

  dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  changeSection = (section) => {
    this.setState({ currentSection: section });
  };

  render() {
    const { currentSection, dailyText, mentalText, healthText } = this.state;

    let currentText = '';
    if (currentSection === 'daily') {
      currentText = dailyText;
    } else if (currentSection === 'mental') {
      currentText = mentalText;
    } else if (currentSection === 'health') {
      currentText = healthText;
    }

    return (
      <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.handleDelete}>
              <Ionicons name="trash-outline" size={24} color="black" style={{ marginLeft: 330 }}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{this.state.year}년 {this.state.month}월 {this.state.day}일</Text>
          <View style={styles.sectionButtons}>
            <TouchableOpacity
              style={[styles.sectionButton, currentSection === 'daily' && styles.activeSectionButton]}
              onPress={() => this.changeSection('daily')}
            >
              <Text style={[styles.sectionButtonText, currentSection === 'daily' && styles.activeSectionButtonText]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sectionButton, currentSection === 'mental' && styles.activeSectionButton]}
              onPress={() => this.changeSection('mental')}
            >
              <Text style={[styles.sectionButtonText, currentSection === 'mental' && styles.activeSectionButtonText]}>Mental</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sectionButton, currentSection === 'health' && styles.activeSectionButton]}
              onPress={() => this.changeSection('health')}
            >
              <Text style={[styles.sectionButtonText, currentSection === 'health' && styles.activeSectionButtonText]}>Health</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            multiline={true}
            placeholder={`Writing about ${currentSection}...`}
            onChangeText={(text) => {
              if (currentSection === 'daily') {
                this.setState({ dailyText: text });
              } else if (currentSection === 'mental') {
                this.setState({ mentalText: text });
              } else if (currentSection === 'health') {
                this.setState({ healthText: text });
              }
            }}
            value={currentText}
          />
          <TouchableOpacity style={styles.button} onPress={this.handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeSectionButton: {
    backgroundColor: '#ccc',
  },
  sectionButtonText: {
    textAlign: 'center',
  },
  activeSectionButtonText: {
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 200,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    padding: 10,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: '#F0EAD6',
    borderRadius: 5,
    lineHeight: 25,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserDiaryScreen;
