import * as SQLite from 'expo-sqlite';

/**
 * Base de datos local de la aplicación.
 *
 * - Un único archivo `sistemapediatrica.db` abierto de forma perezosa.
 * - `openDatabaseAsync` registra la base automáticamente en las Expo DevTools
 *   (pestaña "Expo SQLite"), lo que permite inspeccionarla durante el desarrollo.
 * - El esquema se crea/migra al abrir y se siembra solo si la tabla está vacía.
 */
export const DATABASE_NAME = 'sistemapediatrica.db';
export const PATIENTS_TABLE = 'pacientes';

const SCHEMA_VERSION = 1;

let databasePromise = null;

/**
 * Devuelve la misma conexión para toda la app (singleton).
 * Si falla la apertura, se limpia la promesa para permitir un reintento.
 */
export const getDatabase = () => {
  if (!databasePromise) {
    databasePromise = openDatabase().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
};

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // WAL mejora la concurrencia lectura/escritura en nativo. En web es inocuo.
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await ensureSchema(db);
  await seedPatients(db);

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);

  return db;
};

/**
 * Esquema de la tabla Pacientes.
 *
 * Campos originales de la app:
 *   id, nombre, edad, sexo, tutor, telefono, tipo_sangre, condicion,
 *   alergias, direccion, notas.
 *
 * Campos nuevos (ampliación solicitada):
 *   correo, fecha_nacimiento, contacto_emergencia, telefono_emergencia.
 */
const CREATE_PATIENTS_TABLE = `
CREATE TABLE IF NOT EXISTS ${PATIENTS_TABLE} (
  id TEXT PRIMARY KEY NOT NULL,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL DEFAULT 0,
  sexo TEXT NOT NULL DEFAULT 'Femenino',
  tutor TEXT NOT NULL DEFAULT '',
  telefono TEXT DEFAULT '',
  correo TEXT DEFAULT '',
  fecha_nacimiento TEXT DEFAULT NULL,
  contacto_emergencia TEXT DEFAULT '',
  telefono_emergencia TEXT DEFAULT '',
  tipo_sangre TEXT DEFAULT '',
  condicion TEXT DEFAULT '',
  alergias TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

/**
 * Columnas que podrían faltar si la base se creó con una versión anterior
 * del esquema. `ALTER TABLE` solo permite agregar columnas nulables o con
 * valor por defecto, por eso se declaran de forma sencilla.
 */
const COLUMN_MIGRATIONS = [
  ['correo', "TEXT DEFAULT ''"],
  ['fecha_nacimiento', 'TEXT DEFAULT NULL'],
  ['contacto_emergencia', "TEXT DEFAULT ''"],
  ['telefono_emergencia', "TEXT DEFAULT ''"],
  ['creado_en', 'TEXT DEFAULT NULL'],
  ['actualizado_en', 'TEXT DEFAULT NULL'],
];

const ensureSchema = async (db) => {
  await db.execAsync(CREATE_PATIENTS_TABLE);

  const columns = await db.getAllAsync(`PRAGMA table_info(${PATIENTS_TABLE})`);
  const existing = new Set(columns.map((column) => column.name));

  for (const [name, definition] of COLUMN_MIGRATIONS) {
    if (!existing.has(name)) {
      await db.execAsync(
        `ALTER TABLE ${PATIENTS_TABLE} ADD COLUMN ${name} ${definition};`
      );
    }
  }
};

/**
 * Pacientes de ejemplo. Usan los mismos ids que las citas y los registros
 * semilla de ClinicContext para conservar las relaciones existentes.
 */
const SEED_PATIENTS = [
  {
    id: 'pac-1',
    nombre: 'María Pérez',
    edad: 7,
    sexo: 'Femenino',
    tutor: 'José Pérez',
    telefono: '+503 7213 7890',
    correo: 'jose.perez@example.com',
    fechaNacimiento: '2019-05-14',
    contactoEmergencia: 'José Pérez',
    telefonoEmergencia: '+503 7213 7890',
    tipoSangre: 'O+',
    condicion: 'Asma',
    alergias: 'Penicilina',
    direccion: 'Col. Escalón, San Salvador',
    notas: 'Usa inhalador de rescate. Control mensual.',
  },
  {
    id: 'pac-2',
    nombre: 'Juan Pérez',
    edad: 5,
    sexo: 'Masculino',
    tutor: 'Ana López',
    telefono: '+503 7456 1203',
    correo: 'ana.lopez@example.com',
    fechaNacimiento: '2021-02-03',
    contactoEmergencia: 'Ana López',
    telefonoEmergencia: '+503 7456 1203',
    tipoSangre: 'A+',
    condicion: 'Gripe',
    alergias: 'Ninguna',
    direccion: 'Col. Layco, San Salvador',
    notas: 'Seguimiento por cuadro respiratorio.',
  },
  {
    id: 'pac-3',
    nombre: 'Ana García',
    edad: 9,
    sexo: 'Femenino',
    tutor: 'Luis García',
    telefono: '+503 7890 4421',
    correo: 'luis.garcia@example.com',
    fechaNacimiento: '2017-08-21',
    contactoEmergencia: 'Luis García',
    telefonoEmergencia: '+503 7890 4421',
    tipoSangre: 'B+',
    condicion: 'Alergia estacional',
    alergias: 'Polen',
    direccion: 'Santa Tecla, La Libertad',
    notas: 'Evitar exposición al polen en temporada seca.',
  },
  {
    id: 'pac-4',
    nombre: 'Sofía Ramírez',
    edad: 3,
    sexo: 'Femenino',
    tutor: 'Carmen Ramírez',
    telefono: '+503 7012 8890',
    correo: 'carmen.ramirez@example.com',
    fechaNacimiento: '2023-06-10',
    contactoEmergencia: 'Carmen Ramírez',
    telefonoEmergencia: '+503 7012 8890',
    tipoSangre: 'O-',
    condicion: 'Control de crecimiento',
    alergias: 'Ninguna',
    direccion: 'Mejicanos, San Salvador',
    notas: 'Esquema de vacunación al día.',
  },
];

const seedPatients = async (db) => {
  const result = await db.getFirstAsync(
    `SELECT COUNT(*) AS total FROM ${PATIENTS_TABLE}`
  );

  if (result?.total > 0) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const patient of SEED_PATIENTS) {
      await db.runAsync(
        `INSERT INTO ${PATIENTS_TABLE} (
          id, nombre, edad, sexo, tutor, telefono, correo, fecha_nacimiento,
          contacto_emergencia, telefono_emergencia, tipo_sangre, condicion,
          alergias, direccion, notas, creado_en, actualizado_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient.id,
          patient.nombre,
          patient.edad,
          patient.sexo,
          patient.tutor,
          patient.telefono,
          patient.correo,
          patient.fechaNacimiento,
          patient.contactoEmergencia,
          patient.telefonoEmergencia,
          patient.tipoSangre,
          patient.condicion,
          patient.alergias,
          patient.direccion,
          patient.notas,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
    }
  });
};

/* ------------------------------------------------------------------ */
/* Utilidades de inspección (pantalla "Base de datos SQLite")          */
/* ------------------------------------------------------------------ */

const assertSafeIdentifier = (identifier) => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error('Nombre de tabla no válido.');
  }
};

/**
 * Resumen de la base: archivo, versión de SQLite y tablas con su conteo.
 */
export const getDatabaseSummary = async () => {
  const db = await getDatabase();

  const versionRow = await db.getFirstAsync(
    'SELECT sqlite_version() AS version'
  );
  const tables = await db.getAllAsync(
    `SELECT name FROM sqlite_master
     WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
     ORDER BY name`
  );

  const tableSummaries = [];
  for (const table of tables) {
    assertSafeIdentifier(table.name);
    const count = await db.getFirstAsync(
      `SELECT COUNT(*) AS total FROM "${table.name}"`
    );
    tableSummaries.push({ name: table.name, rows: count?.total ?? 0 });
  }

  return {
    name: DATABASE_NAME,
    path: db.databasePath,
    version: versionRow?.version ?? 'desconocida',
    tables: tableSummaries,
  };
};

/**
 * Columnas de una tabla (`PRAGMA table_info`).
 */
export const getTableSchema = async (tableName) => {
  assertSafeIdentifier(tableName);
  const db = await getDatabase();

  return db.getAllAsync(`PRAGMA table_info("${tableName}")`);
};

/**
 * Primeras filas de una tabla, ordenadas por su clave primaria cuando existe.
 */
export const getTableRows = async (tableName, limit = 50) => {
  assertSafeIdentifier(tableName);
  const db = await getDatabase();
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);

  const rows = await db.getAllAsync(
    `SELECT * FROM "${tableName}" LIMIT ${safeLimit}`
  );

  return {
    columns: rows.length ? Object.keys(rows[0]) : [],
    rows,
  };
};

const READ_ONLY_PATTERN = /^(SELECT|PRAGMA|WITH|EXPLAIN)\b/i;

/**
 * Ejecuta una consulta de solo lectura para el visor.
 * Se bloquean escrituras para evitar dañar los datos desde la UI de depuración.
 */
export const runReadOnlyQuery = async (sql) => {
  const trimmed = String(sql ?? '').trim().replace(/;+\s*$/, '');

  if (!trimmed) {
    throw new Error('Escribe una consulta para ejecutarla.');
  }

  if (trimmed.includes(';')) {
    throw new Error('Ejecuta una sola consulta a la vez.');
  }

  if (!READ_ONLY_PATTERN.test(trimmed)) {
    throw new Error(
      'Solo se permiten consultas de lectura: SELECT, PRAGMA, WITH o EXPLAIN.'
    );
  }

  const db = await getDatabase();
  const rows = await db.getAllAsync(trimmed);
  const columns = rows.length ? Object.keys(rows[0]) : [];

  return {
    columns,
    rows: rows.slice(0, 100),
    total: rows.length,
    truncated: rows.length > 100,
  };
};
