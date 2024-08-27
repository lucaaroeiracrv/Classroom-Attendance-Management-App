import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function AssuranceScreen({ navigation }) {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [today] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    const fetchClassrooms = async () => {
      let storedClassrooms = await AsyncStorage.getItem('classrooms');
      storedClassrooms = storedClassrooms ? JSON.parse(storedClassrooms) : [];
      setClassrooms(storedClassrooms);
    };
    fetchClassrooms();
  }, []);

  const markAttendance = async (student, status) => {
    const updatedStudent = { ...student };
    if (status === 'presence') {
      updatedStudent.attendance = [...updatedStudent.attendance, today];
    } else if (status === 'absence') {
      updatedStudent.attendance = updatedStudent.attendance.filter(date => date !== today);
    }

    const updatedClassroom = {
      ...selectedClassroom,
      students: selectedClassroom.students.map(s =>
        s.name === student.name ? updatedStudent : s
      ),
    };

    const updatedClassrooms = classrooms.map(c =>
      c.className === selectedClassroom.className ? updatedClassroom : c
    );

    await AsyncStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
    setClassrooms(updatedClassrooms);
    setSelectedClassroom(updatedClassroom);
  };

  const markAllAs = async (status) => {
    const updatedStudents = selectedClassroom.students.map(student => {
      const updatedStudent = { ...student };
      if (status === 'presence') {
        updatedStudent.attendance = [...updatedStudent.attendance, today];
      } else if (status === 'absence') {
        updatedStudent.attendance = updatedStudent.attendance.filter(date => date !== today);
      }
      return updatedStudent;
    });

    const updatedClassroom = {
      ...selectedClassroom,
      students: updatedStudents,
    };

    const updatedClassrooms = classrooms.map(c =>
      c.className === selectedClassroom.className ? updatedClassroom : c
    );

    await AsyncStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
    setClassrooms(updatedClassrooms);
    setSelectedClassroom(updatedClassroom);
  };

  const handleBackToClassroomSelection = () => {
    setSelectedClassroom(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {selectedClassroom ? (
          <>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToClassroomSelection}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              Chamada - {selectedClassroom.className}
            </Text>
          </>
        ) : (
          <Text style={styles.headerText}>Selecione uma Turma</Text>
        )}
      </View>
      {!selectedClassroom ? (
        <FlatList
          data={classrooms}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={styles.classroomButton}
              underlayColor="#ddd"
              onPress={() => setSelectedClassroom(item)}
            >
              <Text style={styles.classroomText}>{item.className}</Text>
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <>
          <FlatList
            data={selectedClassroom.students}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.studentName}>{item.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    item.attendance.includes(today)
                      ? styles.checkboxChecked
                      : styles.checkboxAbsent
                  ]}
                  onPress={() => {
                    const newAttendanceStatus = item.attendance.includes(today) ? 'absence' : 'presence';
                    markAttendance(item, newAttendanceStatus);
                  }}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonSmallAbsent}
              onPress={() => markAllAs('absence')}
            >
              <Text style={styles.buttonText}>Falta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSmallPresent}
              onPress={() => markAllAs('presence')}
            >
              <Text style={styles.buttonText}>Presença</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classroomButton: {
    backgroundColor: '#2196F3', // Azul para os botões de turma
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  classroomText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginLeft: 10,
    backgroundColor: '#fff',
  },
  checkboxAbsent: {
    borderColor: '#F44336', // Vermelho para falta
    backgroundColor: '#F44336', // Inicialmente vermelho
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50', // Verde para presença
    borderColor: '#4CAF50',
  },
  buttonsContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonSmallAbsent: {
    backgroundColor: '#F44336', // Vermelho para falta
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonSmallPresent: {
    backgroundColor: '#4CAF50', // Verde para presença
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});