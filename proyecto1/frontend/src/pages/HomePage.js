import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Code, Zap, Users, TrendingUp, Shield, Image } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Generación de Contenido',
      description: 'Crea textos atractivos y personalizados para tus redes sociales con Gemma 4 y Llama 3.3 vía OpenRouter, con imágenes automáticas.',
      link: '/contenido',
      badge: 'IA Generativa'
    },
    {
      icon: Code,
      title: 'Análisis de Código',
      description: 'Obtén feedback detallado sobre la calidad, legibilidad y buenas prácticas de tu código con análisis heurístico experto.',
      link: '/codigo',
      badge: 'Análisis Estático'
    },
    {
      icon: Image,
      title: 'Galería de Contenido',
      description: 'Guarda y gestiona tus mejores publicaciones generadas. Revisa, aprueba y organiza tu contenido desde un CMS centralizado.',
      link: '/galeria',
      badge: 'Strapi CMS'
    }
  ];

  const benefits = [
    { icon: Zap,        title: 'Rápido y Eficiente',       description: 'Genera contenido de calidad en segundos, optimizando tu tiempo de producción.' },
    { icon: Users,      title: 'Fácil de Usar',             description: 'Interfaz intuitiva diseñada para usuarios de todos los niveles técnicos.' },
    { icon: TrendingUp, title: 'Resultados Profesionales',  description: 'Obtén contenido de alta calidad que mejora tu presencia en redes sociales.' },
    { icon: Shield,     title: 'Seguro y Confiable',        description: 'Tu información está protegida con las mejores prácticas de seguridad.' }
  ];

  const stack = [
    { label: 'Gemma 4 · Llama 3.3', sub: 'Modelos de texto' },
    { label: 'Pollinations.ai', sub: 'Imágenes gratis' },
    { label: 'Strapi CMS', sub: 'Galería de contenido' },
    { label: 'PostgreSQL', sub: 'Historial' },
    { label: 'OpenRouter', sub: 'API gateway' },
  ];

  return (
    <div className="bg-app">

      {/* ── Hero ── */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Orbes de fondo */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'rgba(124,58,237,0.12)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: '300px', height: '300px', background: 'rgba(37,99,235,0.08)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          {/* Logo + título */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <img
              src="/logo.png"
              alt="AI SOCIAL"
              style={{ height: '80px', width: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(124,58,237,0.5))' }}
            />
            <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
              AI SOCIAL
            </h1>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '640px', margin: '0 auto 40px' }}>
            Transforma tus ideas en contenido impactante para redes sociales con inteligencia artificial de última generación. Texto, hashtags e imágenes en segundos.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contenido" className="btn-gradient" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              ✨ Generar Contenido
            </Link>
            <Link to="/codigo" className="btn-outline-violet" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              {'<'}/{'>'} Analizar Código
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '60px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
            Características Principales
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
            Todo lo que necesitas para crear contenido profesional y mejorar tu código
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="glass-card-hover" style={{ padding: '32px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(124,58,237,0.2)', borderRadius: '12px', padding: '12px', display: 'inline-flex' }}>
                    <Icon size={24} color="#a78bfa" />
                  </div>
                  <span className="platform-badge">{feature.badge}</span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {feature.description}
                </p>
                <span style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Explorar función
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Stack tecnológico ── */}
      <section style={{ padding: '0 24px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {stack.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '12px 20px', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              ¿Por qué AI SOCIAL?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ background: 'rgba(124,58,237,0.15)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={26} color="#a78bfa" />
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>{benefit.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'rgba(124,58,237,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            ¿Listo para transformar tu contenido?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '1.1rem' }}>
            Únete y empieza a generar contenido profesional con IA en segundos.
          </p>
          <Link to="/contenido" className="btn-gradient" style={{ padding: '16px 40px', fontSize: '1rem' }}>
            Empezar Ahora
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <img src="/logo.png" alt="AI SOCIAL" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
          <span className="text-gradient" style={{ fontWeight: 700 }}>AI SOCIAL</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: '6px' }}>
          Generador de contenido inteligente para redes sociales
        </p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
          Proyecto desarrollado para Programación Web II
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
