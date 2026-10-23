import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const AppointmentScreen = ({ route }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      fecha: '2024-08-01',
      hora: '10:00 AM',
      paciente: 'Juan Pérez',
      motivo: 'Revisión general',
    },
    {
      id: '2',
      fecha: '2024-08-03',
      hora: '11:00 AM',
      paciente: 'Ana García',
      motivo: 'Consulta de seguimiento',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [paciente, setPaciente] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleAddAppointment = () => {
    if (!fecha.trim() || !hora.trim() || !paciente.trim() || !motivo.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      fecha: fecha.trim(),
      hora: hora.trim(),
      paciente: paciente.trim(),
      motivo: motivo.trim(),
    };

    setAppointments([...appointments, newAppointment]);
    setFecha('');
    setHora('');
    setPaciente('');
    setMotivo('');
    setModalVisible(false);
  };

  const handleCancel = () => {
    setFecha('');
    setHora('');
    setPaciente('');
    setMotivo('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas Programadas</Text>

      <Text style={styles.sessionText}>
        Usuario en sesión: {user?.nombreUsuario}
      </Text>
      {route.params?.desde && (
        <Text style={styles.paramText}>
          Accedido desde: {route.params.desde}
        </Text>
      )}

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Fecha: </Text>
              {item.fecha}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Hora: </Text>
              {item.hora}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Paciente: </Text>
              {item.paciente}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Motivo: </Text>
              {item.motivo}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.newButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newButtonText}>Nueva Cita</Text>
      </TouchableOpacity>

      {/* Modal para Agregar Nueva Cita */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nueva Cita</Text>

            <TextInput
              style={styles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={fecha}
              onChangeText={setFecha}
            />

            <TextInput
              style={styles.input}
              placeholder="Hora (HH:MM AM/PM)"
              placeholderTextColor="#999"
              value={hora}
              onChangeText={setHora}
            />

            <TextInput
              style={styles.input}
              placeholder="Paciente"
              placeholderTextColor="#999"
              value={paciente}
              onChangeText={setPaciente}
            />

            <TextInput
              style={styles.input}
              placeholder="Motivo"
              placeholderTextColor="#999"
              value={motivo}
              onChangeText={setMotivo}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalAddButton]}
                onPress={handleAddAppointment}
              >
                <Text style={styles.modalButtonText}>Agregar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  newButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 42,
    borderColor: '#6200ea',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalAddButton: {
    backgroundColor: '#6200ea',
  },
  modalCancelButton: {
    backgroundColor: '#7c4dff',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AppointmentScreen;
