import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const MedicalHistoryScreen = ({ route }) => {
  const { user } = useAuth();
  const historyData = [
    {
      id: '1',
      fecha: '2024-08-01',
      diagnostico: 'Fiebre',
      tratamiento: 'Paracetamol',
      notas: 'Revisión en una semana',
    },
    {
      id: '2',
      fecha: '2024-07-15',
      diagnostico: 'Gripe',
      tratamiento: 'Reposo e hidratación',
      notas: 'Tomar líquidos abundantes',
    },
    {
      id: '3',
      fecha: '2024-06-10',
      diagnostico: 'Alergia',
      tratamiento: 'Antihistamínicos',
      notas: 'Evitar alérgenos conocidos',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historia Clínica</Text>

      <Text style={styles.sessionText}>
        Usuario en sesión: {user?.nombreUsuario}
      </Text>
      {route.params?.desde && (
        <Text style={styles.paramText}>
          Accedido desde: {route.params.desde}
        </Text>
      )}

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dateText}>{item.fecha}</Text>
            <Text style={styles.itemText}>
              <Text style={styles.boldText}>Diagnóstico: </Text>
              {item.diagnostico}
            </Text>
            <Text style={styles.itemText}>
              <Text style={styles.boldText}>Tratamiento: </Text>
              {item.tratamiento}
            </Text>
            <Text style={styles.itemText}>
              <Text style={styles.boldText}>Notas: </Text>
              {item.notas}
            </Text>
          </View>
        )}
      />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 3,
  },
  boldText: {
    fontWeight: '600',
    color: '#334155',
  },
});

export default MedicalHistoryScreen;
