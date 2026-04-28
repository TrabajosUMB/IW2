/**
 * Servicio de análisis y revisión de código
 * Implementa análisis heurístico para proporcionar retroalimentación útil
 */

const db = require('../db');

class CodigoService {
  constructor() {
    // Patrones de detección por lenguaje
    this.patronesLenguaje = {
      javascript: {
        extensiones: ['.js', '.jsx', '.ts', '.tsx'],
        palabrasClave: ['function', 'const', 'let', 'var', 'class', 'import', 'export'],
        buenasPracticas: {
          comentarios: /\/\*[\s\S]*?\*\/|\/\/.*/g,
          funciones: /function\s+\w+|=>\s*{|\w+\s*:\s*\([^)]*\)\s*=>/g,
          variables: /(?:const|let|var)\s+\w+/g,
          errores: /catch\s*\([^)]*\)\s*{|throw\s+/g
        }
      },
      python: {
        extensiones: ['.py'],
        palabrasClave: ['def', 'class', 'import', 'from', 'if', 'for', 'while'],
        buenasPracticas: {
          comentarios: /#.*$/gm,
          funciones: /def\s+\w+\s*\(/g,
          variables: /\w+\s*=/g,
          errores: /except\s+\w+|raise\s+/g
        }
      },
      java: {
        extensiones: ['.java'],
        palabrasClave: ['public', 'private', 'class', 'interface', 'import'],
        buenasPracticas: {
          comentarios: /\/\*[\s\S]*?\*\/|\/\/.*/g,
          funciones: /(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(/g,
          variables: /\w+\s+\w+\s*=/g,
          errores: /catch\s*\([^)]*\)\s*{|throw\s+/g
        }
      }
    };

    // Métricas de calidad
    this.metricasCalidad = {
      longitudLineaMaxima: 120,
      complejidadMaxima: 10,
      comentariosMinimos: 0.1, // 10% del código
      funcionesMaximas: 20
    };
  }

  /**
   * Analiza un fragmento de código y devuelve observaciones
   */
  async analizarCodigo(codigo, lenguaje = 'auto') {
    try {
      if (!codigo || codigo.trim().length === 0) {
        return {
          exito: false,
          error: 'El código está vacío'
        };
      }

      // Detectar lenguaje si es auto
      if (lenguaje === 'auto') {
        lenguaje = this.detectarLenguaje(codigo);
      }

      // Análisis básico
      const lineas = codigo.split('\n');
      const analisis = {
        lenguaje,
        estadisticas: this.obtenerEstadisticasBasicas(codigo, lineas),
        observaciones: [],
        sugerencias: [],
        metricasCalidad: {},
        nivelCalidad: 'medio'
      };

      // Realizar diferentes análisis
      this.analizarEstructura(codigo, analisis);
      this.analizarLegibilidad(codigo, lineas, analisis);
      this.analizarBuenasPracticas(codigo, lenguaje, analisis);
      this.calcularMetricasCalidad(codigo, lineas, analisis);

      // Determinar nivel general de calidad
      analisis.nivelCalidad = this.determinarNivelCalidad(analisis);

      const resultado = {
        exito: true,
        analisis
      };

      // Guardar en historial (no propagar error de DB si falla)
      try {
        await db.query(
          `INSERT INTO historial_codigo (lenguaje, codigo_analizado, resultado)
           VALUES ($1, $2, $3)`,
          [lenguaje, codigo, JSON.stringify(analisis)]
        );
      } catch (errorDb) {
        console.error('Error guardando en historial_codigo:', errorDb.message);
      }

      return resultado;
    } catch (error) {
      console.error('Error analizando código:', error);
      return {
        exito: false,
        error: 'Error analizando el código: ' + error.message
      };
    }
  }

  /**
   * Detecta el lenguaje de programación basado en patrones
   */
  detectarLenguaje(codigo) {
    const codigoLower = codigo.toLowerCase();
    
    for (const [lenguaje, config] of Object.entries(this.patronesLenguaje)) {
      const coincidencias = config.palabrasClave.filter(palabra => 
        codigoLower.includes(palabra)
      ).length;
      
      if (coincidencias >= 2) {
        return lenguaje;
      }
    }
    
    return 'javascript'; // Por defecto
  }

  /**
   * Obtiene estadísticas básicas del código
   */
  obtenerEstadisticasBasicas(codigo, lineas) {
    return {
      totalLineas: lineas.length,
      lineasCodigo: lineas.filter(linea => linea.trim() && !linea.trim().startsWith('//') && !linea.trim().startsWith('#')).length,
      lineasVacias: lineas.filter(linea => !linea.trim()).length,
      lineasComentarios: lineas.filter(linea => 
        linea.trim().startsWith('//') || 
        linea.trim().startsWith('#') || 
        linea.trim().startsWith('/*') ||
        linea.trim().startsWith('*')
      ).length,
      caracteres: codigo.length,
      palabras: codigo.split(/\s+/).filter(p => p).length
    };
  }

  /**
   * Analiza la estructura general del código
   */
  analizarEstructura(codigo, analisis) {
    const { lenguaje } = analisis;
    const config = this.patronesLenguaje[lenguaje];

    if (config) {
      // Contar funciones
      const coincidenciasFunciones = codigo.match(config.buenasPracticas.funciones);
      const numFunciones = coincidenciasFunciones ? coincidenciasFunciones.length : 0;
      
      analisis.estructura = {
        numFunciones,
        numVariables: this.contarVariables(codigo, config),
        tieneManejoErrores: this.detectarManejoErrores(codigo, config),
        complejidadAparente: this.estimarComplejidad(codigo)
      };

      // Observaciones sobre estructura
      if (numFunciones === 0) {
        analisis.observaciones.push('⚠️ No se detectaron funciones definidas');
      } else if (numFunciones > 10) {
        analisis.observaciones.push('ℹ️ Se detectaron muchas funciones, considera modularizar');
      }

      if (!analisis.estructura.tieneManejoErrores) {
        analisis.sugerencias.push('💡 Considera agregar manejo de errores (try/catch)');
      }
    }
  }

  /**
   * Analiza la legibilidad del código
   */
  analizarLegibilidad(codigo, lineas, analisis) {
    let lineasLargas = 0;
    let indentacionInconsistente = false;
    const indentaciones = [];

    lineas.forEach((linea, index) => {
      const lineaTrim = linea.trim();
      if (lineaTrim) {
        // Detectar líneas largas
        if (lineaTrim.length > this.metricasCalidad.longitudLineaMaxima) {
          lineasLargas++;
        }

        // Analizar indentación
        const espaciosIniciales = linea.length - linea.trimStart().length;
        if (espaciosIniciales > 0) {
          indentaciones.push(espaciosIniciales);
        }
      }
    });

    // Verificar consistencia de indentación
    if (indentaciones.length > 1) {
      const indentacionUnica = [...new Set(indentaciones)];
      if (indentacionUnica.length > 2) {
        indentacionInconsistente = true;
      }
    }

    analisis.legibilidad = {
      lineasLargas,
      indentacionInconsistente,
      promedioLongitudLinea: codigo.length / lineas.length
    };

    // Generar observaciones
    if (lineasLargas > 0) {
      analisis.observaciones.push(`⚠️ ${lineasLargas} líneas exceden los ${this.metricasCalidad.longitudLineaMaxima} caracteres`);
    }

    if (indentacionInconsistente) {
      analisis.sugerencias.push('💡 La indentación es inconsistente, usa un formato estándar');
    }
  }

  /**
   * Analiza buenas prácticas
   */
  analizarBuenasPracticas(codigo, lenguaje, analisis) {
    const config = this.patronesLenguaje[lenguaje];
    
    if (config) {
      // Detectar comentarios
      const comentarios = codigo.match(config.buenasPracticas.comentarios);
      const numComentarios = comentarios ? comentarios.length : 0;
      
      // Calcular proporción de comentarios
      const lineasCodigo = analisis.estadisticas.lineasCodigo;
      const proporcionComentarios = numComentarios / Math.max(lineasCodigo, 1);

      analisis.buenasPracticas = {
        numComentarios,
        proporcionComentarios,
        tieneComentarios: numComentarios > 0
      };

      // Observaciones sobre comentarios
      if (numComentarios === 0) {
        analisis.sugerencias.push('💡 Agrega comentarios para explicar la lógica compleja');
      } else if (proporcionComentarios < 0.05) {
        analisis.sugerencias.push('💡 Considera agregar más comentarios para mejorar la documentación');
      }

      // Sugerencias específicas por lenguaje
      if (lenguaje === 'javascript') {
        if (codigo.includes('var ')) {
          analisis.sugerencias.push('💡 Considera usar "const" o "let" en lugar de "var"');
        }
        if (!codigo.includes('===') && !codigo.includes('!==')) {
          analisis.sugerencias.push('💡 Usa comparaciones estrictas (===, !==) para evitar errores');
        }
      }
    }
  }

  /**
   * Calcula métricas de calidad
   */
  calcularMetricasCalidad(codigo, lineas, analisis) {
    analisis.metricasCalidad = {
      densidadComentarios: analisis.buenasPracticas?.proporcionComentarios || 0,
      complejidadCiclomatica: analisis.estructura?.complejidadAparente || 1,
      longitudPromedioFuncion: this.calcularLongitudPromedioFuncion(codigo, analisis.lenguaje),
      mantenibilidad: this.calcularMantenibilidad(analisis)
    };
  }

  /**
   * Determina el nivel general de calidad
   */
  determinarNivelCalidad(analisis) {
    let puntaje = 0;
    let totalCriterios = 0;

    // Criterio: comentarios
    totalCriterios++;
    if (analisis.buenasPracticas?.tieneComentarios) puntaje++;

    // Criterio: manejo de errores
    totalCriterios++;
    if (analisis.estructura?.tieneManejoErrores) puntaje++;

    // Criterio: legibilidad
    totalCriterios++;
    if (!analisis.legibilidad?.indentacionInconsistente && analisis.legibilidad?.lineasLargas === 0) puntaje++;

    // Criterio: complejidad
    totalCriterios++;
    if ((analisis.estructura?.complejidadAparente || 1) <= 5) puntaje++;

    const porcentaje = (puntaje / totalCriterios) * 100;

    if (porcentaje >= 75) return 'excelente';
    if (porcentaje >= 50) return 'bueno';
    if (porcentaje >= 25) return 'medio';
    return 'necesita-mejora';
  }

  /**
   * Métodos auxiliares
   */
  contarVariables(codigo, config) {
    const coincidencias = codigo.match(config.buenasPracticas.variables);
    return coincidencias ? coincidencias.length : 0;
  }

  detectarManejoErrores(codigo, config) {
    // Crear nueva instancia para evitar el bug de estado con flag /g y .test()
    const regex = new RegExp(config.buenasPracticas.errores.source, 'i');
    return regex.test(codigo);
  }

  estimarComplejidad(codigo) {
    // Estimación simple basada en estructuras de control
    const estructurasControl = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch'];
    let complejidad = 1; // Base
    
    estructurasControl.forEach(estructura => {
      const regex = new RegExp(`\\b${estructura}\\b`, 'gi');
      const coincidencias = codigo.match(regex);
      if (coincidencias) {
        complejidad += coincidencias.length;
      }
    });
    
    return complejidad;
  }

  calcularLongitudPromedioFuncion(codigo, lenguaje) {
    const config = this.patronesLenguaje[lenguaje];
    if (!config) return 0;

    const funciones = codigo.match(config.buenasPracticas.funciones);
    if (!funciones) return 0;

    // Simplificación: estimar longitud promedio
    return Math.floor(codigo.split('\n').length / funciones.length);
  }

  calcularMantenibilidad(analisis) {
    let puntaje = 100;
    
    // Penalizar por complejidad
    puntaje -= (analisis.estructura?.complejidadAparente || 1) * 5;
    
    // Penalizar por falta de comentarios
    if (!analisis.buenasPracticas?.tieneComentarios) puntaje -= 20;
    
    // Penalizar por problemas de legibilidad
    if (analisis.legibilidad?.lineasLargas > 0) puntaje -= analisis.legibilidad.lineasLargas * 2;
    if (analisis.legibilidad?.indentacionInconsistente) puntaje -= 15;
    
    return Math.max(0, Math.min(100, puntaje));
  }
}

module.exports = new CodigoService();
