import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createPatient,
  deletePatient as deletePatientInDb,
  fetchPatients,
  updatePatient as updatePatientInDb,
} from '../database/patientsRepository';

/**
 * Estado clínico compartido (pacientes, citas e historial).
 *
 * Los pacientes se persisten en la base SQLite local (expo-sqlite) y se
 * cargan al iniciar la app. Las citas y los registros médicos siguen en
 * memoria; su persistencia queda para una etapa posterior.
 */
const ClinicContext = createContext(null);

const toISODate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

export const todayISO = () => toISODate(new Date());

export const formatDate = (isoDate, options = {}) => {
  if (!isoDate) return '—';

  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);

  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
};

export const formatLongDate = (isoDate) =>
  formatDate(isoDate, { weekday: 'long', day: 'numeric', month: 'long' });

const seedAppointments = [
  {
    id: 'cita-1',
    pacienteId: 'pac-1',
    paciente: 'María Pérez',
    fecha: addDays(0),
    hora: '09:30',
    motivo: 'Control de asma',
    medico: 'Dra. Elena Ruiz',
    estado: 'confirmada',
    notas: 'Revisar técnica de inhalación y espirometría.',
  },
  {
    id: 'cita-2',
    pacienteId: 'pac-2',
    paciente: 'Juan Pérez',
    fecha: addDays(0),
    hora: '11:15',
    motivo: 'Revisión general',
    medico: 'Dr. Marco Díaz',
    estado: 'pendiente',
    notas: 'Consulta por tos persistente.',
  },
  {
    id: 'cita-3',
    pacienteId: 'pac-3',
    paciente: 'Ana García',
    fecha: addDays(2),
    hora: '14:00',
    motivo: 'Seguimiento de alergia',
    medico: 'Dra. Elena Ruiz',
    estado: 'confirmada',
    notas: 'Revisar respuesta al antihistamínico.',
  },
  {
    id: 'cita-4',
    pacienteId: 'pac-4',
    paciente: 'Sofía Ramírez',
    fecha: addDays(5),
    hora: '10:00',
    motivo: 'Vacunación',
    medico: 'Dr. Marco Díaz',
    estado: 'pendiente',
    notas: 'Aplicar refuerzo correspondiente a la edad.',
  },
];

const seedRecords = [
  {
    id: 'reg-1',
    pacienteId: 'pac-1',
    paciente: 'María Pérez',
    fecha: addDays(-8),
    diagnostico: 'Asma leve persistente',
    tratamiento: 'Salbutamol según necesidad',
    medico: 'Dra. Elena Ruiz',
    notas: 'Buena respuesta al tratamiento. Continuar control mensual.',
  },
  {
    id: 'reg-2',
    pacienteId: 'pac-2',
    paciente: 'Juan Pérez',
    fecha: addDays(-16),
    diagnostico: 'Gripe',
    tratamiento: 'Reposo e hidratación',
    medico: 'Dr. Marco Díaz',
    notas: 'Sin signos de alarma. Control si persiste la fiebre.',
  },
  {
    id: 'reg-3',
    pacienteId: 'pac-3',
    paciente: 'Ana García',
    fecha: addDays(-27),
    diagnostico: 'Rinitis alérgica',
    tratamiento: 'Antihistamínico por 10 días',
    medico: 'Dra. Elena Ruiz',
    notas: 'Evitar alérgenos conocidos y mantener ambientes ventilados.',
  },
  {
    id: 'reg-4',
    pacienteId: 'pac-1',
    paciente: 'María Pérez',
    fecha: addDays(-55),
    diagnostico: 'Fiebre viral',
    tratamiento: 'Paracetamol',
    medico: 'Dr. Marco Díaz',
    notas: 'Revisión en una semana. Hidratación constante.',
  },
];

export const ClinicProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [records, setRecords] = useState(seedRecords);

  const refreshPatients = useCallback(async () => {
    setIsLoadingPatients(true);

    try {
      const storedPatients = await fetchPatients();
      setPatients(storedPatients);
      setPatientsError(null);
      return storedPatients;
    } catch (error) {
      console.warn('[clinic] No se pudieron cargar los pacientes.', error);
      setPatientsError(error);
      return [];
    } finally {
      setIsLoadingPatients(false);
    }
  }, []);

  useEffect(() => {
    refreshPatients();
  }, [refreshPatients]);

  const addPatient = useCallback(async (data) => {
    const id = await createPatient(data);
    setPatients((current) => [{ id, ...data }, ...current]);
    return id;
  }, []);

  const updatePatient = useCallback(async (id, data) => {
    await updatePatientInDb(id, data);

    setPatients((current) =>
      current.map((patient) =>
        patient.id === id ? { ...patient, ...data } : patient
      )
    );
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.pacienteId === id
          ? { ...appointment, paciente: data.nombre || appointment.paciente }
          : appointment
      )
    );
    setRecords((current) =>
      current.map((record) =>
        record.pacienteId === id
          ? { ...record, paciente: data.nombre || record.paciente }
          : record
      )
    );
  }, []);

  const deletePatient = useCallback(async (id) => {
    await deletePatientInDb(id);

    setPatients((current) => current.filter((patient) => patient.id !== id));
    setAppointments((current) =>
      current.filter((appointment) => appointment.pacienteId !== id)
    );
    setRecords((current) =>
      current.filter((record) => record.pacienteId !== id)
    );
  }, []);

  const addAppointment = useCallback((data) => {
    const id = `cita-${Date.now()}`;
    setAppointments((current) => [{ id, ...data }, ...current]);
    return id;
  }, []);

  const updateAppointment = useCallback((id, data) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, ...data } : appointment
      )
    );
  }, []);

  const deleteAppointment = useCallback((id) => {
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== id)
    );
  }, []);

  const addRecord = useCallback((data) => {
    const id = `reg-${Date.now()}`;
    setRecords((current) => [{ id, ...data }, ...current]);
    return id;
  }, []);

  const updateRecord = useCallback((id, data) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id ? { ...record, ...data } : record
      )
    );
  }, []);

  const deleteRecord = useCallback((id) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      patients,
      appointments,
      records,
      isLoadingPatients,
      patientsError,
      refreshPatients,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addRecord,
      updateRecord,
      deleteRecord,
      todayISO,
      formatDate,
      formatLongDate,
    }),
    [
      patients,
      appointments,
      records,
      isLoadingPatients,
      patientsError,
      refreshPatients,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addRecord,
      updateRecord,
      deleteRecord,
    ]
  );

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);

  if (!context) {
    throw new Error('useClinic debe usarse dentro de un ClinicProvider');
  }

  return context;
};

export default ClinicContext;
