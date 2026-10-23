import { getDatabase, PATIENTS_TABLE } from './db';

/**
 * Repositorio de pacientes sobre SQLite.
 *
 * Traduce entre el modelo camelCase que usan las pantallas y las columnas
 * snake_case de la tabla `pacientes`.
 */

const rowToPatient = (row) => ({
  id: row.id,
  nombre: row.nombre ?? '',
  edad: row.edad != null ? String(row.edad) : '',
  sexo: row.sexo ?? '',
  tutor: row.tutor ?? '',
  telefono: row.telefono ?? '',
  correo: row.correo ?? '',
  fechaNacimiento: row.fecha_nacimiento ?? '',
  contactoEmergencia: row.contacto_emergencia ?? '',
  telefonoEmergencia: row.telefono_emergencia ?? '',
  tipoSangre: row.tipo_sangre ?? '',
  condicion: row.condicion ?? '',
  alergias: row.alergias ?? '',
  direccion: row.direccion ?? '',
  notas: row.notas ?? '',
  creadoEn: row.creado_en ?? null,
  actualizadoEn: row.actualizado_en ?? null,
});

const normalizeAge = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const patientToColumns = (data) => [
  data.nombre?.trim() ?? '',
  normalizeAge(data.edad),
  data.sexo?.trim() || 'Femenino',
  data.tutor?.trim() ?? '',
  data.telefono?.trim() ?? '',
  data.correo?.trim() ?? '',
  data.fechaNacimiento?.trim() || null,
  data.contactoEmergencia?.trim() ?? '',
  data.telefonoEmergencia?.trim() ?? '',
  data.tipoSangre?.trim() ?? '',
  data.condicion?.trim() ?? '',
  data.alergias?.trim() ?? '',
  data.direccion?.trim() ?? '',
  data.notas?.trim() ?? '',
];

export const fetchPatients = async () => {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT * FROM ${PATIENTS_TABLE}
     ORDER BY datetime(creado_en) DESC, nombre COLLATE NOCASE ASC`
  );

  return rows.map(rowToPatient);
};

export const fetchPatientById = async (id) => {
  const db = await getDatabase();
  const row = await db.getFirstAsync(
    `SELECT * FROM ${PATIENTS_TABLE} WHERE id = ?`,
    [id]
  );

  return row ? rowToPatient(row) : null;
};

export const createPatient = async (data) => {
  const db = await getDatabase();
  const id = `pac-${Date.now()}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO ${PATIENTS_TABLE} (
      id, nombre, edad, sexo, tutor, telefono, correo, fecha_nacimiento,
      contacto_emergencia, telefono_emergencia, tipo_sangre, condicion,
      alergias, direccion, notas, creado_en, actualizado_en
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, ...patientToColumns(data), now, now]
  );

  return id;
};

export const updatePatient = async (id, data) => {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE ${PATIENTS_TABLE} SET
      nombre = ?,
      edad = ?,
      sexo = ?,
      tutor = ?,
      telefono = ?,
      correo = ?,
      fecha_nacimiento = ?,
      contacto_emergencia = ?,
      telefono_emergencia = ?,
      tipo_sangre = ?,
      condicion = ?,
      alergias = ?,
      direccion = ?,
      notas = ?,
      actualizado_en = ?
     WHERE id = ?`,
    [...patientToColumns(data), now, id]
  );
};

export const deletePatient = async (id) => {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM ${PATIENTS_TABLE} WHERE id = ?`, [id]);
};

export default {
  fetchPatients,
  fetchPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
