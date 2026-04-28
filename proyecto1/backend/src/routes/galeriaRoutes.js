const express    = require('express');
const controller = require('../controllers/galeriaController');

const router = express.Router();

router.get('/',        controller.obtenerGaleria.bind(controller));
router.post('/',       controller.guardarPublicacion.bind(controller));
router.delete('/:id',  controller.eliminarPublicacion.bind(controller));
router.get('/estado',  controller.estado.bind(controller));

module.exports = router;
