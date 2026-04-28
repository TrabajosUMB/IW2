import React, { useState, useEffect } from 'react';
import { contenidoService, galeriaService, utils } from '../services/api';
import { FileText, Hash, Copy, CheckCircle, AlertCircle, Target, MessageSquare, Zap, ChevronDown, ChevronUp, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const ContenidoPage = () => {
  const [formData, setFormData] = useState({
    tema: '',
    objetivo: '',
    tono: 'profesional',
    plataforma: 'general',
    contextoAdicional: ''
  });

  const [tonos, setTonos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});
  const [copiado, setCopiado] = useState({ texto: false, hashtags: false });
  const [mostrarRazonamiento, setMostrarRazonamiento] = useState(false);
  const [guardandoGaleria, setGuardandoGaleria] = useState(false);
  const [guardadoGaleria, setGuardadoGaleria] = useState(false);

  useEffect(() => { cargarOpciones(); }, []);

  const cargarOpciones = async () => {
    try {
      const [tonosRes, plataformasRes] = await Promise.all([
        contenidoService.obtenerTonos(),
        contenidoService.obtenerPlataformas()
      ]);
      if (tonosRes.exito) setTonos(tonosRes.datos);
      if (plataformasRes.exito) setPlataformas(plataformasRes.datos);
    } catch (error) {
      console.error('Error cargando opciones:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validacion = utils.validarFormularioContenido(formData);
    if (!validacion.esValido) { setErrores(validacion.errores); return; }

    setCargando(true);
    setErrores({});
    setResultados(null);
    setMostrarRazonamiento(false);
    setGuardadoGaleria(false);

    try {
      const respuesta = await contenidoService.generarContenido(formData);
      if (respuesta.exito) {
        setResultados({ ...respuesta.datos, modoMock: respuesta.modoMock });
      } else {
        setErrores({ general: respuesta.error || 'Error generando contenido' });
      }
    } catch (error) {
      setErrores({ general: error.message });
    } finally {
      setCargando(false);
    }
  };

  const handleCopiar = async (texto, tipo) => {
    const exito = await utils.copiarAlPortapapeles(texto);
    if (exito) {
      setCopiado(prev => ({ ...prev, [tipo]: true }));
      setTimeout(() => setCopiado(prev => ({ ...prev, [tipo]: false })), 2000);
    }
  };

  const handleGuardarGaleria = async () => {
    if (!resultados || guardadoGaleria) return;
    setGuardandoGaleria(true);
    try {
      await galeriaService.guardarPublicacion({
        tema: formData.tema,
        objetivo: formData.objetivo,
        tono: formData.tono,
        plataforma: formData.plataforma,
        texto: resultados.texto,
        hashtags: resultados.hashtags,
        imagenUrl: resultados.imagen?.url || '',
        modelo: resultados.metadatos?.modelo || 'desconocido',
      });
      setGuardadoGaleria(true);
    } catch {
      // fallo silencioso — Strapi puede no estar corriendo en dev
    } finally {
      setGuardandoGaleria(false);
    }
  };

  const plataformaActual = formData.plataforma;

  return (
    <div className="bg-app" style={{ minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
            Generador de <span className="text-gradient">Contenido IA</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
            Powered by Gemma 4 · Llama 3.3 vía OpenRouter — genera textos, hashtags e imágenes en segundos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* ── Formulario ── */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: '10px', padding: '8px' }}>
                <FileText size={20} color="#a78bfa" />
              </div>
              <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Configurar Publicación</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Tema */}
              <div>
                <label className="label-dark">
                  <Target size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Tema de la Publicación
                </label>
                <input
                  type="text"
                  name="tema"
                  value={formData.tema}
                  onChange={handleInputChange}
                  className="input-dark"
                  placeholder="Ej: Lanzamiento de app de productividad..."
                  disabled={cargando}
                  style={errores.tema ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
                />
                {errores.tema && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errores.tema}</p>}
              </div>

              {/* Objetivo */}
              <div>
                <label className="label-dark">
                  <Zap size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Objetivo del Mensaje
                </label>
                <textarea
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleInputChange}
                  className="input-dark"
                  placeholder="Ej: Que la gente descargue la app, compren los productos..."
                  rows={2}
                  disabled={cargando}
                  style={{ resize: 'vertical', ...(errores.objetivo ? { borderColor: 'rgba(239,68,68,0.6)' } : {}) }}
                />
                {errores.objetivo && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errores.objetivo}</p>}
              </div>

              {/* Tono */}
              <div>
                <label className="label-dark">Tono Deseado</label>
                <select name="tono" value={formData.tono} onChange={handleInputChange} className="input-dark" disabled={cargando} style={{ cursor: 'pointer' }}>
                  {tonos.map(t => <option key={t.id} value={t.id}>{t.nombre} — {t.descripcion}</option>)}
                </select>
              </div>

              {/* Plataforma */}
              <div>
                <label className="label-dark">Plataforma Destino</label>
                <select name="plataforma" value={formData.plataforma} onChange={handleInputChange} className="input-dark" disabled={cargando} style={{ cursor: 'pointer' }}>
                  {plataformas.map(p => <option key={p.id} value={p.id}>{p.nombre} — {p.descripcion}</option>)}
                </select>
              </div>

              {/* Contexto adicional */}
              <div>
                <label className="label-dark">
                  <MessageSquare size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  Contexto Adicional <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea
                  name="contextoAdicional"
                  value={formData.contextoAdicional}
                  onChange={handleInputChange}
                  className="input-dark"
                  placeholder="Agrega información específica para personalizar más el contenido..."
                  rows={2}
                  disabled={cargando}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Error general */}
              {errores.general && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px' }}>
                  <AlertCircle size={16} color="#f87171" />
                  <span style={{ color: '#f87171', fontSize: '0.875rem' }}>{errores.general}</span>
                </div>
              )}

              {/* Botón */}
              <button type="submit" disabled={cargando} className="btn-gradient" style={{ width: '100%', padding: '14px', fontSize: '0.95rem', gap: '8px' }}>
                {cargando ? (
                  <>
                    <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Generando con IA...
                  </>
                ) : (
                  <><span>✨</span> Generar Contenido con IA</>
                )}
              </button>
            </form>
          </div>

          {/* ── Resultados ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {cargando && (
              <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
                {[0.75, 1, 0.85].map((w, i) => (
                  <div key={i} style={{ height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '12px', width: `${w * 100}%` }} />
                ))}
                <div style={{ marginTop: '16px', textAlign: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '12px' }} className="loading-pulse">
                  <span style={{ color: '#a78bfa', fontSize: '0.875rem' }}>✨ Generando tu contenido con IA...</span>
                </div>
              </div>
            )}

            {resultados && (
              <>
                {/* Modo mock */}
                {resultados.modoMock && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '12px' }}>
                    <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>⚠️ Mostrando contenido de ejemplo — la IA no está disponible en este momento</span>
                  </div>
                )}

                {/* Razonamiento */}
                {resultados.razonamiento && (
                  <div className="glass-card animate-fade-in" style={{ padding: '16px' }}>
                    <button
                      onClick={() => setMostrarRazonamiento(!mostrarRazonamiento)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🧠 Ver razonamiento de la IA
                      </span>
                      {mostrarRazonamiento ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                    </button>
                    {mostrarRazonamiento && (
                      <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                        {resultados.razonamiento}
                      </p>
                    )}
                  </div>
                )}

                {/* Preview social */}
                <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                  {/* Header del post */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      AI
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>ai.social.app</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Publicación · ahora</div>
                    </div>
                    <span className="platform-badge">{plataformaActual}</span>
                  </div>

                  {/* Imagen */}
                  {resultados.imagen?.url && (
                    <img
                      src={resultados.imagen.url}
                      alt="Imagen generada"
                      style={{ width: '100%', borderRadius: '12px', marginBottom: '14px', maxHeight: '260px', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://picsum.photos/seed/placeholder/1024/1024'; }}
                    />
                  )}

                  {/* Texto */}
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                    {resultados.texto}
                  </p>

                  {/* Contador Twitter */}
                  {plataformaActual === 'twitter' && (
                    <div style={{ fontSize: '0.75rem', textAlign: 'right', color: resultados.texto?.length > 240 ? '#f87171' : 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                      {resultados.texto?.length || 0}/240 caracteres
                    </div>
                  )}

                  {/* Hashtags principales */}
                  {resultados.hashtags?.principales?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {resultados.hashtags.principales.map((h, i) => (
                        <span key={i} style={{ color: '#60a5fa', fontSize: '0.875rem' }}>{h}</span>
                      ))}
                    </div>
                  )}

                  {/* Acciones */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleCopiar(resultados.texto, 'texto')}
                      className="btn-gradient"
                      style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '6px' }}
                    >
                      {copiado.texto ? <><CheckCircle size={13} /> Copiado!</> : <><Copy size={13} /> Copiar texto</>}
                    </button>
                    <button
                      onClick={handleGuardarGaleria}
                      disabled={guardandoGaleria || guardadoGaleria}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px', cursor: guardadoGaleria ? 'default' : 'pointer',
                        background: guardadoGaleria ? 'rgba(52,211,153,0.15)' : 'rgba(124,58,237,0.15)',
                        border: `1px solid ${guardadoGaleria ? 'rgba(52,211,153,0.4)' : 'rgba(124,58,237,0.4)'}`,
                        color: guardadoGaleria ? '#34d399' : '#a78bfa',
                        transition: 'all 0.2s',
                      }}
                    >
                      {guardadoGaleria
                        ? <><BookmarkCheck size={13} /> Guardado!</>
                        : guardandoGaleria
                          ? <>Guardando...</>
                          : <><BookmarkPlus size={13} /> Guardar en Galería</>}
                    </button>
                  </div>
                </div>

                {/* Hashtags secundarios */}
                {resultados.hashtags?.secundarios?.length > 0 && (
                  <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Hash size={16} color="#a78bfa" />
                      <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Hashtags secundarios</h4>
                      <button
                        onClick={() => handleCopiar(resultados.hashtags.secundarios.join(' '), 'hashtags')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: copiado.hashtags ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiado.hashtags ? <><CheckCircle size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {resultados.hashtags.secundarios.map((h, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = '#a78bfa'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadatos */}
                <div className="glass-card animate-fade-in" style={{ padding: '16px' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Información de generación</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      ['Modelo', resultados.metadatos?.modelo || 'mock'],
                      ['Imagen', resultados.metadatos?.modeloImagen || '—'],
                      ['Tono', resultados.metadatos?.tono],
                      ['Plataforma', resultados.metadatos?.plataforma],
                      ['Generado', resultados.metadatos?.fechaGeneracion ? new Date(resultados.metadatos.fechaGeneracion).toLocaleString() : '—'],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>{label}:</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'capitalize' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!resultados && !cargando && (
              <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ fontSize: '1.75rem' }}>✨</span>
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>Listo para generar</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                  Completa el formulario y la IA creará tu contenido personalizado
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenidoPage;
