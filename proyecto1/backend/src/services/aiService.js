const OpenAI = require('openai');

/**
 * Servicio de generación de texto vía OpenRouter (modelos gratuitos).
 * Intenta los modelos en cascada hasta obtener respuesta válida:
 *   1. google/gemma-4-31b-it:free          (Gemma 4 31B — calidad alta)
 *   2. google/gemma-3-27b-it:free          (Gemma 3 27B — fallback sólido)
 *   3. meta-llama/llama-3.3-70b-instruct:free  (Llama 3.3 70B — último recurso)
 * Si los tres fallan, lanza error para que contenidoService active el mock.
 */
class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.cliente = this.apiKey
      ? new OpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: this.apiKey,
          defaultHeaders: {
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Generador de Contenido IW2'
          }
        })
      : null;

    // Orden de preferencia de modelos gratuitos en OpenRouter (verificado 2026-04)
    this.modelosCascada = [
      'google/gemma-4-31b-it:free',
      'google/gemma-3-27b-it:free',
      'meta-llama/llama-3.3-70b-instruct:free',
    ];

    if (!this.apiKey) {
      console.warn('⚠️  OPENROUTER_API_KEY no encontrada. Generación con OpenRouter no disponible.');
    } else {
      console.log(`✅ OpenRouter API key cargada (${this.apiKey.slice(0, 14)}...)`);
    }
  }

  /**
   * Genera texto y hashtags para redes sociales usando modelos gratuitos vía OpenRouter.
   * La respuesta incluye opcionalmente un campo "razonamiento" que expone
   * la estrategia interna que usó el modelo.
   *
   * @param {string} tema
   * @param {string} objetivo
   * @param {string} tono
   * @param {string} plataforma
   * @returns {{
   *   texto: string,
   *   hashtagsPrincipales: string[],
   *   hashtagsSecundarios: string[],
   *   razonamiento: string|null,
   *   promptImagen: string|null
   * }}
   */
  async generarTextoContenido(tema, objetivo, tono, plataforma) {
    if (!this.cliente) {
      throw new Error('OPENROUTER_API_KEY no configurada. No se puede generar texto con DeepSeek.');
    }

    const systemPrompt = `Eres un experto en marketing digital y estrategia de redes sociales. Tu tarea es generar contenido optimizado para redes sociales usando un proceso de razonamiento estructurado.

PROCESO DE RAZONAMIENTO:
1. Analiza el tema, objetivo, tono y plataforma objetivo
2. Considera las mejores prácticas específicas de la plataforma (límites de caracteres, formato, audiencia típica)
3. Diseña una estrategia de contenido apropiada
4. Genera el contenido final optimizado

REGLAS POR PLATAFORMA:
- Instagram: 3-5 oraciones emotivas, 2-4 emojis relevantes intercalados, foco visual y emocional
- Twitter/X: máximo 240 caracteres, gancho fuerte al inicio, directo e impactante
- Facebook: 4-6 oraciones conversacionales, incluir pregunta al final para engagement
- LinkedIn: 4-6 oraciones profesionales, estructura problema→insight→llamada a la acción, máximo 1 emoji

REGLAS DE TONO:
- Formal: vocabulario técnico, sin contracciones, oraciones completas
- Creativo: metáforas, lenguaje vívido, original y memorable
- Promocional: beneficios claros, urgencia, llamada a la acción directa
- Profesional: autoridad, datos cuando aplica, enfocado en valor
- Juvenil: lenguaje moderno, energético, relatable, puede incluir jerga actual

FORMATO DE RESPUESTA (JSON estricto, sin markdown, sin texto extra):
{"razonamiento":"breve explicación de la estrategia elegida (1-2 oraciones)","texto":"contenido generado para la plataforma","hashtagsPrincipales":["#tag1","#tag2","#tag3"],"hashtagsSecundarios":["#tag4","#tag5","#tag6","#tag7","#tag8"],"promptImagen":"A detailed English image prompt for Pollinations.ai, specific to the topic, platform aesthetic and tone. Must be descriptive (15-25 words), photographic style. Example: 'A vibrant coffee shop scene with warm lighting and artisan cups, cozy atmosphere, professional photography, social media style'"}`;

    const userPrompt = `Genera contenido para:
- Tema: ${tema}
- Objetivo: ${objetivo}
- Tono: ${tono}
- Plataforma: ${plataforma}

Responde ÚNICAMENTE con el JSON, sin texto adicional.`;

    // Intentar modelos en cascada hasta que uno responda correctamente
    let respuesta = null;
    let ultimoError = null;

    for (const modelo of this.modelosCascada) {
      try {
        console.log(`🤖 Intentando modelo: ${modelo}`);
        respuesta = await this.cliente.chat.completions.create({
          model: modelo,
          timeout: 30000,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        });
        console.log(`✅ Respuesta obtenida con: ${modelo}`);
        break; // salir del bucle si tuvo éxito
      } catch (error) {
        console.error(`⚠️ DeepSeek (${modelo}) falló con ${error?.status || error?.code}: ${error?.message?.substring(0, 100)}`);
        ultimoError = error;
        // continuar con el siguiente modelo
      }
    }

    if (!respuesta) {
      throw new Error(`Todos los modelos de OpenRouter fallaron. Último error: ${ultimoError?.message}`);
    }

    const raw = respuesta.choices[0].message.content.trim();

    // Limpiar posibles bloques de código markdown
    const limpio = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Parsear con manejo de error explícito — si falla, contenidoService activa el mock
    let resultado;
    try {
      resultado = JSON.parse(limpio);
    } catch (errorParseo) {
      console.error('DeepSeek devolvió JSON malformado:', limpio.slice(0, 200));
      throw new Error(`DeepSeek devolvió una respuesta no parseable: ${errorParseo.message}`);
    }

    // Validar campo mínimo obligatorio
    if (!resultado.texto || typeof resultado.texto !== 'string') {
      throw new Error('DeepSeek devolvió un campo "texto" vacío o inválido');
    }

    return {
      texto: resultado.texto,
      hashtagsPrincipales: Array.isArray(resultado.hashtagsPrincipales)
        ? resultado.hashtagsPrincipales
        : [],
      hashtagsSecundarios: Array.isArray(resultado.hashtagsSecundarios)
        ? resultado.hashtagsSecundarios
        : [],
      razonamiento:  resultado.razonamiento  || null,
      promptImagen:  resultado.promptImagen  || null
    };
  }
}

module.exports = new AIService();
