import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diaries: [],
      selectedDates: [],
    };
  }

  componentDidMount() {
    this.loadDiaries();
    this.loadSelectedDates();
  }

  loadDiaries = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const diaryKeys = keys.filter((key) => key.endsWith('_daily'));
  
      const diaries = await Promise.all(
        diaryKeys.map(async (dailyKey) => {
          const date = dailyKey.split('_daily')[0];
          const mentalKey = `${date}_mental`;
          const healthKey = `${date}_health`;
  
          const [dailyText, mentalText, healthText] = await AsyncStorage.multiGet([
            dailyKey,
            mentalKey,
            healthKey,
          ]);
  
          return {
            date,
            dailyText: dailyText[1] || '',
            mentalText: mentalText[1] || '',
            healthText: healthText[1] || '',
          };
        })
      );
  
      this.setState({ diaries });
    } catch (error) {
      console.log('Error loading diaries:', error);
    }
  };

  loadSelectedDates = async () => {
    try {
      const selectedDates = await AsyncStorage.getItem('selected_dates');
      if (selectedDates) {
        this.setState({ selectedDates: JSON.parse(selectedDates) });
      }
    } catch (error) {
      console.log('Error loading selected dates:', error);
    }
  };

  renderDiary = ({ item }) => {
    const { date, dailyText, mentalText, healthText } = item;
    const { selectedDates } = this.state;
    const isHighlighted = selectedDates.includes(date);

    return (
      <View style={[styles.diaryItem, isHighlighted && styles.highlightedItem]}>
        <TouchableOpacity onPress={() => this.showDiaryPopup(date, dailyText, mentalText, healthText)}>
          <Text style={styles.diaryTitle}>{date}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.deleteDiary(date)}
        >
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  showDiaryPopup = (date, dailyText, mentalText, healthText) => {
    Alert.alert(
      date,
      `Daily : ${dailyText}\n\nMental : ${mentalText}\n\nHealth : ${healthText}`
    );
  };

  deleteDiary = async (date) => {
    try {
      await AsyncStorage.removeItem(`diary_${date}`);
      // 상태 업데이트 및 재 렌더링
      this.setState((prevState) => ({
        diaries: prevState.diaries.filter((diary) => diary.date !== date),
      }));

      // 선택된 날짜에서 삭제한 날짜 제거
      this.setState((prevState) => ({
        selectedDates: prevState.selectedDates.filter((selectedDate) => selectedDate !== date),
      }));

      // 선택된 날짜 저장
      await AsyncStorage.setItem('selected_dates', JSON.stringify(this.state.selectedDates));
    } catch (error) {
      console.log('Error deleting diary:', error);
    }
  };

  render() {
    const { diaries } = this.state;

    if (diaries.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>저장된 일기가 없습니다.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={diaries}
          renderItem={this.renderDiary}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.diaryList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
  },
  diaryList: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  diaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  diaryTitle: {
    fontSize: 18,
  },
  deleteButton: {
    marginLeft: 10,
  },
  highlightedItem: {
    backgroundColor: 'lightgreen',
  },
});

export default UserScreen;
