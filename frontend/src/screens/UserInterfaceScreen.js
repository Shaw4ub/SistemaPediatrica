import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const UserInterfaceScreen = ({ route }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [patients, setPatients] = useState([
    { id: '1', name: 'Gilbert García' },
  ]);
  const [editingId, setEditingId] = useState(null);

  const addPatient = () => {
    if (!inputText.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa un nombre para el paciente.');
      return;
    }

    if (editingId) {
      setPatients(
        patients.map((item) =>
          item.id === editingId ? { ...item, name: inputText.trim() } : item
        )
      );
      setEditingId(null);
    } else {
      setPatients([
        ...patients,
        { id: Date.now().toString(), name: inputText.trim() },
      ]);
    }
    setInputText('');
  };

  const handleEdit = (patient) => {
    setInputText(patient.name);
    setEditingId(patient.id);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInputText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputText('');
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gestión de Pacientes</Text>

        <Text style={styles.sessionText}>
          Usuario en sesión: {user?.nombreUsuario}
        </Text>
        {route.params?.desde && (
          <Text style={styles.paramText}>
            Accedido desde: {route.params.desde}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nombre del paciente"
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
        />

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.addButton} onPress={addPatient}>
            <Text style={styles.addButtonText}>
              {editingId ? 'Actualizar Paciente' : 'Agregar Paciente'}
            </Text>
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity
              style={styles.cancelEditButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelEditText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.counterText}>
          Pacientes registrados: {patients.length}
        </Text>

        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.itemEditButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.itemButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemDeleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.itemButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sessionText: {
    fontSize: 13,
    color: '#0369a1',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  paramText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0077b6',
  },
  input: {
    height: 44,
    borderColor: '#90e0ef',
    borderWidth: 1.5,
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 12,
    width: '100%',
    backgroundColor: '#f8fafc',
    fontSize: 15,
  },
  actionButtonsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0077b6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelEditButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelEditText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  counterText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
    alignSelf: 'center',
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  itemEditButton: {
    backgroundColor: '#f9a826',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  itemDeleteButton: {
    backgroundColor: '#e63946',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  itemButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UserInterfaceScreen;
