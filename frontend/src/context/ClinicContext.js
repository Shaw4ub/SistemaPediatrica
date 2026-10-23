import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * Estado clínico compartido (pacientes, citas e historial).
 *
 * Las pantallas de listado, detalle y formularios leen y escriben aquí, de
 * modo que los cambios se reflejan al instante en toda la aplicación.
 * La persistencia en backend queda para una etapa posterior.
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

const seedPatients = [
  {
    id: 'pac-1',
    nombre: 'María Pérez',
    edad: '7',
    sexo: 'Femenino',
    tutor: 'José Pérez',
    telefono: '+503 7213 7890',
    condicion: 'Asma',
    alergias: 'Penicilina',
    tipoSangre: 'O+',
    direccion: 'Col. Escalón, San Salvador',
    notas: 'Usa inhalador de rescate. Control mensual.',
  },
  {
    id: 'pac-2',
    nombre: 'Juan Pérez',
    edad: '5',
    sexo: 'Masculino',
    tutor: 'Ana López',
    telefono: '+503 7456 1203',
    condicion: 'Gripe',
    alergias: 'Ninguna',
    tipoSangre: 'A+',
    direccion: 'Col. Layco, San Salvador',
    notas: 'Seguimiento por cuadro respiratorio.',
  },
  {
    id: 'pac-3',
    nombre: 'Ana García',
    edad: '9',
    sexo: 'Femenino',
    tutor: 'Luis García',
    telefono: '+503 7890 4421',
    condicion: 'Alergia estacional',
    alergias: 'Polen',
    tipoSangre: 'B+',
    direccion: 'Santa Tecla, La Libertad',
    notas: 'Evitar exposición al polen en temporada seca.',
  },
  {
    id: 'pac-4',
    nombre: 'Sofía Ramírez',
    edad: '3',
    sexo: 'Femenino',
    tutor: 'Carmen Ramírez',
    telefono: '+503 7012 8890',
    condicion: 'Control de crecimiento',
    alergias: 'Ninguna',
    tipoSangre: 'O-',
    direccion: 'Mejicanos, San Salvador',
    notas: 'Esquema de vacunación al día.',
  },
];

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
  const [patients, setPatients] = useState(seedPatients);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [records, setRecords] = useState(seedRecords);

  const addPatient = useCallback((data) => {
    const id = `pac-${Date.now()}`;
    setPatients((current) => [{ id, ...data }, ...current]);
    return id;
  }, []);

  const updatePatient = useCallback((id, data) => {
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

  const deletePatient = useCallback((id) => {
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
