const { Pool } = require('pg');

// Pool de conexiones con las variables de entorno
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'IW2',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

/**
 * Crea las tablas necesarias si aún no existen.
 * Se llama una vez al iniciar la aplicación.
 */
async function inicializarTablas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS historial_contenido (
        id                   SERIAL PRIMARY KEY,
        tema                 VARCHAR(255),
        objetivo             VARCHAR(100),
        tono                 VARCHAR(50),
        plataforma           VARCHAR(50),
        texto_generado       TEXT,
        hashtags_principales TEXT[],
        hashtags_secundarios TEXT[],
        imagen_url           TEXT,
        modo_mock            BOOLEAN DEFAULT FALSE,
        creado_en            TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS historial_codigo (
        id               SERIAL PRIMARY KEY,
        lenguaje         VARCHAR(50),
        codigo_analizado TEXT,
        resultado        JSONB,
        creado_en        TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Tablas de base de datos inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error inicializando tablas de base de datos:', error.message);
  }
}

module.exports = {
  query: (texto, params) => pool.query(texto, params),
  inicializarTablas,
};
