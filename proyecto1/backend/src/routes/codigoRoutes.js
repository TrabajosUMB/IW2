const express = require('express');
const router = express.Router();
const codigoController = require('../controllers/codigoController');

/**
 * Rutas para el módulo de análisis de código
 */

// POST /api/codigo/analizar - Analizar fragmento de código
router.post('/analizar', codigoController.analizarCodigo);

// GET /api/codigo/lenguajes - Obtener lenguajes soportados
router.get('/lenguajes', codigoController.obtenerLenguajesSoportados);

// GET /api/codigo/metricas - Obtener métricas de calidad
router.get('/metricas', codigoController.obtenerMetricasCalidad);

// GET /api/codigo/historial - Últimos 20 registros de análisis de código
router.get('/historial', codigoController.obtenerHistorial.bind(codigoController));

module.exports = router;
