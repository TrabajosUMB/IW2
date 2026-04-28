import React, { useState, useEffect, useCallback } from 'react';
import { galeriaService, utils } from '../services/api';
import { Image, Copy, CheckCircle, Trash2, AlertCircle, RefreshCw, Filter, ExternalLink } from 'lucide-react';

const PLATAFORMAS = [
  { id: '', nombre: 'Todas las plataformas' },
  { id: 'instagram', nombre: 'Instagram' },
  { id: 'twitter',   nombre: 'Twitter/X' },
  { id: 'facebook',  nombre: 'Facebook' },
  { id: 'linkedin',  nombre: 'LinkedIn' },
  { id: 'general',   nombre: 'General' },
];

const TONOS = [
  { id: '', nombre: 'Todos los tonos' },
  { id: 'formal',      nombre: 'Formal' },
  { id: 'creativo',    nombre: 'Creativo' },
  { id: 'promocional', nombre: 'Promocional' },
  { id: 'profesional', nombre: 'Profesional' },
  { id: 'juvenil',     nombre: 'Juvenil' },
];

const PLATAFORMA_COLORS = {
  instagram: '#e1306c',
  twitter:   '#1da1f2',
  facebook:  '#1877f2',
  linkedin:  '#0a66c2',
  general:   '#7c3aed',
};

const GaleriaPage = () => {
  const [items, setItems]               = useState([]);
  const [paginacion, setPaginacion]     = useState(null);
  const [cargando, setCargando]         = useState(true);
  const [strapiOnline, setStrapiOnline] = useState(null);
  const [filtros, setFiltros]           = useState({ plataforma: '', tono: '' });
  const [pagina, setPagina]             = useState(1);
  const [copiado, setCopiado]           = useState({});
  const [eliminando, setEliminando]     = useState(null);

  const cargarGaleria = useCallback(async () => {
    setCargando(true);
    try {
      const res = await galeriaService.obtenerGaleria({ pagina, porPagina: 9, ...filtros });
      if (res.exito) {
        setItems(res.items || []);
        setPaginacion(res.paginacion || null);
        setStrapiOnline(true);
      }
    } catch {
      setStrapiOnline(false);
      setItems([]);
    } finally {
      setCargando(false);
    }
  }, [pagina, filtros]);

  useEffect(() => { cargarGaleria(); }, [cargarGaleria]);

  const handleFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPagina(1);
  };

  const handleCopiar = async (texto, id) => {
    const ok = await utils.copiarAlPortapapeles(texto);
    if (ok) {
      setCopiado(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setCopiado(prev => ({ ...prev, [id]: false })), 2000);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación de la galería?')) return;
    setEliminando(id);
    try {
      await galeriaService.eliminarPublicacion(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      alert('No se pudo eliminar. Intenta de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  const attrOf = (item) => item.attributes || item;

  return (
    <div className="bg-app" style={{ minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: '12px', padding: '10px' }}>
              <Image size={24} color="#a78bfa" />
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', margin: 0 }}>
              Galería de <span className="text-gradient">Publicaciones</span>
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            Contenido generado y guardado — gestionado con Strapi CMS
          </p>

          {strapiOnline !== null && (
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: strapiOnline ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${strapiOnline ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: strapiOnline ? '#34d399' : '#f87171', display: 'inline-block' }} />
              <span style={{ color: strapiOnline ? '#34d399' : '#f87171', fontSize: '0.78rem', fontWeight: 500 }}>
                Strapi CMS {strapiOnline ? 'online' : 'offline'}
              </span>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={16} color="rgba(255,255,255,0.4)" />
          <select
            value={filtros.plataforma}
            onChange={e => handleFiltro('plataforma', e.target.value)}
            className="input-dark"
            style={{ flex: 1, minWidth: '160px', maxWidth: '220px', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {PLATAFORMAS.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <select
            value={filtros.tono}
            onChange={e => handleFiltro('tono', e.target.value)}
            className="input-dark"
            style={{ flex: 1, minWidth: '160px', maxWidth: '220px', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {TONOS.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <button
            onClick={cargarGaleria}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Actualizar
          </button>
        </div>

        {/* Estado offline */}
        {strapiOnline === false && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
            <AlertCircle size={32} color="#f87171" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ color: '#f87171', fontWeight: 600, marginBottom: '8px' }}>Strapi CMS no disponible</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginBottom: '16px' }}>
              Para ver la galería, inicia Strapi con:
            </p>
            <code style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '6px', color: '#a78bfa', fontSize: '0.875rem', display: 'block', marginBottom: '16px' }}>
              cd cms &amp;&amp; npm run develop
            </code>
            <a
              href="http://localhost:1337/admin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontSize: '0.875rem' }}
            >
              <ExternalLink size={14} /> Abrir Strapi Admin
            </a>
          </div>
        )}

        {/* Skeleton de carga */}
        {cargando && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '14px' }} />
                <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '10px', width: '70%' }} />
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '90%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Grid de publicaciones */}
        {!cargando && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {items.map(item => {
              const a = attrOf(item);
              const color = PLATAFORMA_COLORS[a.plataforma] || '#7c3aed';
              return (
                <div key={item.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {a.imagen_url && (
                    <img
                      src={a.imagen_url}
                      alt={a.tema}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: `${color}22`, border: `1px solid ${color}55`, color, fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                      {a.plataforma}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                      {a.tono}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px', lineHeight: 1.3 }}>{a.tema}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', lineHeight: 1.5 }}>{a.objetivo}</p>
                  </div>

                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {a.texto}
                  </p>

                  {Array.isArray(a.hashtags_principales) && a.hashtags_principales.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {a.hashtags_principales.map((h, i) => (
                        <span key={i} style={{ color: '#60a5fa', fontSize: '0.78rem' }}>{h}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      onClick={() => handleCopiar(a.texto, item.id)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '7px', fontSize: '0.78rem', borderRadius: '7px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', cursor: 'pointer' }}
                    >
                      {copiado[item.id] ? <><CheckCircle size={12} /> Copiado</> : <><Copy size={12} /> Copiar texto</>}
                    </button>
                    <button
                      onClick={() => handleEliminar(item.id)}
                      disabled={eliminando === item.id}
                      style={{ padding: '7px 10px', borderRadius: '7px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
                    {item.attributes?.createdAt ? utils.formatearFecha(item.attributes.createdAt) : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && strapiOnline && items.length === 0 && (
          <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Image size={28} color="#a78bfa" />
            </div>
            <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>Galería vacía</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
              Genera contenido y guárdalo con el botón "Guardar en Galería"
            </p>
          </div>
        )}

        {/* Paginación */}
        {paginacion && paginacion.pageCount > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              style={{ padding: '8px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: pagina <= 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: pagina <= 1 ? 'default' : 'pointer', fontSize: '0.875rem' }}
            >
              Anterior
            </button>
            <span style={{ padding: '8px 18px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              {pagina} / {paginacion.pageCount}
            </span>
            <button
              onClick={() => setPagina(p => Math.min(paginacion.pageCount, p + 1))}
              disabled={pagina >= paginacion.pageCount}
              style={{ padding: '8px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: pagina >= paginacion.pageCount ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: pagina >= paginacion.pageCount ? 'default' : 'pointer', fontSize: '0.875rem' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriaPage;
