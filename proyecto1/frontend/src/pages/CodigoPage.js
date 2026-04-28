import React, { useState, useEffect } from 'react';
import { codigoService, utils } from '../services/api';
import { Code, CheckCircle, AlertCircle, TrendingUp, FileText, Zap, Target, BarChart3, Lightbulb } from 'lucide-react';

const CodigoPage = () => {
  const [formData, setFormData] = useState({ codigo: '', lenguaje: 'auto' });
  const [lenguajes, setLenguajes] = useState([]);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => { cargarLenguajes(); }, []);

  const cargarLenguajes = async () => {
    try {
      const respuesta = await codigoService.obtenerLenguajes();
      if (respuesta.exito) setLenguajes(respuesta.datos);
    } catch (error) { console.error('Error cargando lenguajes:', error); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validacion = utils.validarFormularioCodigo(formData);
    if (!validacion.esValido) { setErrores(validacion.errores); return; }

    setCargando(true);
    setErrores({});
    setResultados(null);

    try {
      const respuesta = await codigoService.analizarCodigo(formData);
      if (respuesta.exito) setResultados(respuesta.analisis);
      else setErrores({ general: respuesta.error || 'Error analizando código' });
    } catch (error) {
      setErrores({ general: error.message });
    } finally {
      setCargando(false);
    }
  };

  const nivelConfig = {
    excelente:      { color: '#34d399', bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.3)',  icon: CheckCircle, label: 'Excelente' },
    bueno:          { color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  border: 'rgba(96,165,250,0.3)',  icon: TrendingUp,  label: 'Bueno' },
    medio:          { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.3)',  icon: AlertCircle, label: 'Medio' },
    'necesita-mejora': { color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.3)', icon: AlertCircle, label: 'Necesita Mejora' },
  };

  const cfg = nivelConfig[resultados?.nivelCalidad] || nivelConfig['medio'];

  return (
    <div className="bg-app" style={{ minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '10px' }}>
            Analizador de <span className="text-gradient">Código</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto' }}>
            Análisis heurístico de calidad, legibilidad y buenas prácticas para tu código.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>

          {/* ── Formulario ── */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: '10px', padding: '8px' }}>
                <Code size={20} color="#a78bfa" />
              </div>
              <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Código para Analizar</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Lenguaje */}
              <div>
                <label className="label-dark">Lenguaje de Programación</label>
                <select name="lenguaje" value={formData.lenguaje} onChange={handleInputChange} className="input-dark" disabled={cargando} style={{ cursor: 'pointer' }}>
                  {lenguajes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                </select>
              </div>

              {/* Código */}
              <div>
                <label className="label-dark">Fragmento de Código</label>
                <textarea
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  className="input-dark"
                  placeholder={`// Pega tu código aquí\nfunction ejemplo() {\n    console.log('Hola mundo');\n}`}
                  rows={14}
                  disabled={cargando}
                  style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace", fontSize: '0.8rem', resize: 'vertical', lineHeight: 1.6, ...(errores.codigo ? { borderColor: 'rgba(239,68,68,0.6)' } : {}) }}
                />
                {errores.codigo && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>{errores.codigo}</p>}
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '4px', textAlign: 'right' }}>
                  {formData.codigo.length.toLocaleString()} / 50,000 caracteres
                </p>
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
                    Analizando Código...
                  </>
                ) : (
                  <><Zap size={16} /> Analizar Código</>
                )}
              </button>
            </form>
          </div>

          {/* ── Resultados ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {cargando && (
              <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
                {[0.6, 1, 0.8, 0.9].map((w, i) => (
                  <div key={i} style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '12px', width: `${w * 100}%` }} />
                ))}
                <div style={{ marginTop: '16px', textAlign: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '12px' }} className="loading-pulse">
                  <span style={{ color: '#a78bfa', fontSize: '0.875rem' }}>🔍 Analizando estructura y calidad...</span>
                </div>
              </div>
            )}

            {resultados && (
              <>
                {/* Badge de calidad */}
                <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Resumen del Análisis</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '20px', padding: '5px 14px' }}>
                      {React.createElement(cfg.icon, { size: 14, color: cfg.color })}
                      <span style={{ color: cfg.color, fontSize: '0.8rem', fontWeight: 600 }}>{cfg.label}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { icon: FileText, label: 'Lenguaje', val: resultados.lenguaje },
                      { icon: BarChart3, label: 'Total líneas', val: resultados.estadisticas?.totalLineas },
                      { icon: Code,     label: 'Líneas código', val: resultados.estadisticas?.lineasCodigo },
                      { icon: Target,   label: 'Comentarios', val: resultados.estadisticas?.lineasComentarios },
                    ].map(({ icon: Icon, label, val }) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Icon size={12} color="#a78bfa" />
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{label}</span>
                        </div>
                        <p style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0, textTransform: 'capitalize' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas con barras */}
                {resultados.metricasCalidad && (
                  <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Target size={16} color="#a78bfa" />
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Métricas de Calidad</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Mantenibilidad */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Mantenibilidad</span>
                          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>{resultados.metricasCalidad.mantenibilidad}/100</span>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px' }}>
                          <div style={{ height: '6px', borderRadius: '4px', width: `${resultados.metricasCalidad.mantenibilidad}%`, background: 'linear-gradient(90deg, #7c3aed, #2563eb)', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>

                      {/* Densidad de comentarios */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Densidad de Comentarios</span>
                          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>{Math.round(resultados.metricasCalidad.densidadComentarios * 100)}%</span>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px' }}>
                          <div style={{ height: '6px', borderRadius: '4px', width: `${Math.min(resultados.metricasCalidad.densidadComentarios * 100, 100)}%`, background: 'linear-gradient(90deg, #7c3aed, #2563eb)', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>

                      {/* Complejidad */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Complejidad Ciclomática</span>
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{resultados.metricasCalidad.complejidadCiclomatica}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {resultados.observaciones?.length > 0 && (
                  <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <AlertCircle size={16} color="#fbbf24" />
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Observaciones</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {resultados.observaciones.map((obs, i) => (
                        <div key={i} style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '8px', padding: '10px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                          {obs}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sugerencias */}
                {resultados.sugerencias?.length > 0 && (
                  <div className="glass-card animate-fade-in" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Lightbulb size={16} color="#60a5fa" />
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Sugerencias de Mejora</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {resultados.sugerencias.map((sug, i) => (
                        <div key={i} style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '8px', padding: '10px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                          {sug}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!resultados && !cargando && (
              <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Code size={28} color="rgba(167,139,250,0.6)" />
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>Esperando Código</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                  Pega tu código para obtener un análisis detallado de calidad
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoPage;
