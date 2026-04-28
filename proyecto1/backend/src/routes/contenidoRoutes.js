const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController');

/**
 * Rutas para el módulo de generación de contenido
 */

// POST /api/contenido/generar - Generar contenido completo
router.post('/generar', contenidoController.generarContenido);

// GET /api/contenido/tonos - Obtener tonos disponibles
router.get('/tonos', contenidoController.obtenerTonosDisponibles);

// GET /api/contenido/plataformas - Obtener plataformas disponibles
router.get('/plataformas', contenidoController.obtenerPlataformasDisponibles);

// GET /api/contenido/historial - Últimos 20 registros de contenido generado
router.get('/historial', contenidoController.obtenerHistorial.bind(contenidoController));

module.exports = router;
