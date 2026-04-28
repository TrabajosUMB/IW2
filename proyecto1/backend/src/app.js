require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar rutas
const contenidoRoutes = require('./routes/contenidoRoutes');
const codigoRoutes    = require('./routes/codigoRoutes');
const galeriaRoutes   = require('./routes/galeriaRoutes');

// Módulo de base de datos
const { inicializarTablas } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/contenido', contenidoRoutes);
app.use('/api/codigo',    codigoRoutes);
app.use('/api/galeria',   galeriaRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de Plataforma Generadora de Contenido',
    version: '1.0.0',
    endpoints: {
      contenido: '/api/contenido',
      codigo:    '/api/codigo',
      galeria:   '/api/galeria'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe'
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📝 API disponible en http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  await inicializarTablas();
});

module.exports = app;
