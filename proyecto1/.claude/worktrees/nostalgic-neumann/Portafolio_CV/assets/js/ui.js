// UI JavaScript - Interacciones para el portafolio académico

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Funcionalidad del menú hamburguesa
    function initHamburgerMenu() {
        if (!hamburger || !nav) return;
        
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling para enlaces internos
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Verificar si es un enlace interno
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Navegación activa basada en scroll
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        function updateActiveNav() {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Llamar una vez al inicio
    }
    
    // Funcionalidad de acordeones para competencias
    function initAccordions() {
        console.log('Inicializando acordeones...');
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        if (accordionHeaders.length === 0) {
            console.log('No se encontraron headers de acordeón');
            return;
        }
        
        console.log('Se encontraron', accordionHeaders.length, 'headers de acordeón');
        
        accordionHeaders.forEach((header, index) => {
            console.log('Configurando acordeón', index);
            header.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Evitar que el evento se propague
                console.log('Clic en acordeón', index);
                
                const targetId = this.getAttribute('data-target');
                const accordionItem = this.closest('.accordion-item');
                const content = document.getElementById(targetId);
                
                console.log('Target ID:', targetId, 'Accordion Item:', accordionItem, 'Content:', content);
                
                if (!accordionItem || !content) {
                    console.log('No se encontró accordion item o content');
                    return;
                }
                
                // Cerrar otros acordeones
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const otherItem = otherHeader.closest('.accordion-item');
                        const otherContent = document.getElementById(otherHeader.getAttribute('data-target'));
                        if (otherItem && otherContent) {
                            otherItem.classList.remove('active');
                            otherContent.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle acordeón actual
                const isActive = accordionItem.classList.contains('active');
                
                if (isActive) {
                    console.log('Cerrando acordeón');
                    accordionItem.classList.remove('active');
                    content.style.maxHeight = '0';
                } else {
                    console.log('Abriendo acordeón');
                    accordionItem.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }
    
    // Funcionalidad específica para la página de horario
    function initSchedulePage() {
        const toggleViewBtn = document.getElementById('toggleView');
        const desktopSchedule = document.getElementById('desktopSchedule');
        const mobileSchedule = document.getElementById('mobileSchedule');
        
        if (!toggleViewBtn || !desktopSchedule || !mobileSchedule) return;
        
        let isMobileView = window.innerWidth <= 767;
        
        function updateScheduleView() {
            if (isMobileView) {
                desktopSchedule.style.display = 'none';
                mobileSchedule.style.display = 'block';
                toggleViewBtn.innerHTML = '<span class="view-icon">🖥️</span><span class="view-text">Vista Desktop</span>';
            } else {
                desktopSchedule.style.display = 'block';
                mobileSchedule.style.display = 'none';
                toggleViewBtn.innerHTML = '<span class="view-icon">📱</span><span class="view-text">Vista Móvil</span>';
            }
        }
        
        toggleViewBtn.addEventListener('click', function() {
            isMobileView = !isMobileView;
            updateScheduleView();
        });
        
        // Actualizar vista al cambiar tamaño de ventana
        window.addEventListener('resize', function() {
            const shouldBeMobileView = window.innerWidth <= 767;
            if (shouldBeMobileView !== isMobileView) {
                isMobileView = shouldBeMobileView;
                updateScheduleView();
            }
        });
        
        // Interacciones con los items del horario
        const scheduleItems = document.querySelectorAll('.schedule-item');
        scheduleItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remover clase highlighted de todos los items
                scheduleItems.forEach(i => i.classList.remove('highlighted'));
                // Agregar clase highlighted al item clickeado
                this.classList.add('highlighted');
                
                // Mostrar información adicional si existe
                const materia = this.getAttribute('data-materia');
                if (materia) {
                    showScheduleDetails(materia, this);
                }
            });
        });
        
        updateScheduleView();
    }
    
    // Funcionalidad específica para la página de organigrama
    function initOrgChartPage() {
        const verticalViewBtn = document.getElementById('verticalView');
        const timelineViewBtn = document.getElementById('timelineView');
        const verticalOrg = document.getElementById('verticalOrg');
        const timelineOrg = document.getElementById('timelineOrg');
        
        if (!verticalViewBtn || !timelineViewBtn || !verticalOrg || !timelineOrg) return;
        
        function switchToVerticalView() {
            verticalOrg.style.display = 'block';
            timelineOrg.style.display = 'none';
            verticalViewBtn.classList.add('active');
            verticalViewBtn.classList.remove('btn-secondary');
            verticalViewBtn.classList.add('btn-primary');
            timelineViewBtn.classList.remove('active');
            timelineViewBtn.classList.remove('btn-primary');
            timelineViewBtn.classList.add('btn-secondary');
            
            // Animar entrada de nodos
            animateOrgNodes();
        }
        
        function switchToTimelineView() {
            verticalOrg.style.display = 'none';
            timelineOrg.style.display = 'block';
            timelineViewBtn.classList.add('active');
            timelineViewBtn.classList.remove('btn-secondary');
            timelineViewBtn.classList.add('btn-primary');
            verticalViewBtn.classList.remove('active');
            verticalViewBtn.classList.remove('btn-primary');
            verticalViewBtn.classList.add('btn-secondary');
            
            // Animar entrada de timeline
            animateTimeline();
        }
        
        verticalViewBtn.addEventListener('click', switchToVerticalView);
        timelineViewBtn.addEventListener('click', switchToTimelineView);
        
        // Interacciones con nodos del organigrama
        const orgNodes = document.querySelectorAll('.org-node');
        orgNodes.forEach(node => {
            node.addEventListener('click', function() {
                // Remover clase highlighted de todos los nodos
                orgNodes.forEach(n => n.classList.remove('highlighted'));
                // Agregar clase highlighted al nodo clickeado
                this.classList.add('highlighted');
            });
        });
        
        // Interacciones con eventos del timeline
        const timelineEvents = document.querySelectorAll('.timeline-event');
        timelineEvents.forEach(event => {
            event.addEventListener('click', function() {
                const card = this.querySelector('.timeline-card');
                if (card) {
                    // Remover clase highlighted de todas las tarjetas
                    document.querySelectorAll('.timeline-card').forEach(c => c.classList.remove('highlighted'));
                    // Agregar clase highlighted a la tarjeta clickeada
                    card.classList.add('highlighted');
                }
            });
        });
        
        // Inicializar con vista vertical
        switchToVerticalView();
    }
    
    // Funciones de animación
    function animateOrgNodes() {
        const nodes = document.querySelectorAll('#verticalOrg .org-node');
        nodes.forEach((node, index) => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    function animateTimeline() {
        const events = document.querySelectorAll('.timeline-event');
        events.forEach((event, index) => {
            event.style.opacity = '0';
            event.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                event.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                event.style.opacity = '1';
                event.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }
    
    // Mostrar detalles del horario
    function showScheduleDetails(materia, element) {
        // Crear tooltip o modal con información adicional
        const existingTooltip = document.querySelector('.schedule-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'schedule-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>${materia}</h4>
                <p>Haz clic para ver más detalles</p>
                <button class="tooltip-close">×</button>
            </div>
        `;
        
        // Estilos para el tooltip
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-primary);
            color: var(--text-white);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            max-width: 250px;
            font-size: var(--text-sm);
        `;
        
        document.body.appendChild(tooltip);
        
        // Posicionar tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.top = rect.bottom + 10 + 'px';
        tooltip.style.left = rect.left + 'px';
        
        // Cerrar tooltip
        const closeBtn = tooltip.querySelector('.tooltip-close');
        closeBtn.addEventListener('click', () => tooltip.remove());
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);
    }
    
    // Inicialización de tooltips
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'ui-tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--text-primary);
                    color: var(--text-white);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--radius-md);
                    font-size: var(--text-xs);
                    z-index: var(--z-tooltip);
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = rect.bottom + 5 + 'px';
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.ui-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }
    
    // Animación de números en estadísticas
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalNumber = parseInt(stat.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 50; // 50 frames para la animación
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentNumber);
            }, 20);
        });
    }
    
    // Inicialización de barras de progreso
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    // Detección de página actual
    function initPageSpecificFeatures() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('horario.html')) {
            initSchedulePage();
        } else if (currentPath.includes('organigrama.html')) {
            initOrgChartPage();
        } else {
            // Inicializar acordeones solo en la página principal
            initAccordions();
        }
        
        // Inicializar animaciones comunes
        animateNumbers();
        initProgressBars();
    }
    
    // Inicialización principal
    function init() {
        // Inicializar menú hamburguesa
        initHamburgerMenu();
        
        // Inicializar smooth scrolling
        initSmoothScrolling();
        
        // Inicializar navegación activa
        initActiveNavigation();
        
        // Inicializar tooltips
        initTooltips();
        
        // Inicializar acordeones siempre para asegurar que funcionen
        initAccordions();
        
        // Inicializar características específicas de página
        initPageSpecificFeatures();
        
        // Agregar estilos dinámicos
        addDynamicStyles();
    }
    
    // Agregar estilos CSS dinámicos
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .schedule-tooltip {
                animation: fadeInUp 0.3s ease-out;
            }
            
            .ui-tooltip {
                animation: fadeInUp 0.2s ease-out;
            }
            
            .highlighted {
                animation: pulse 1s ease-in-out;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ejecutar inicialización
    init();
    
    // Exponer funciones globales si es necesario
    window.UI = {
        showScheduleDetails,
        animateNumbers,
        initProgressBars
    };
});

// Utilidades adicionales
const Utils = {
    // Debounce para eventos de scroll/resize
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para eventos frecuentes
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Detectar tipo de dispositivo
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 767) return 'mobile';
        if (width <= 1023) return 'tablet';
        return 'desktop';
    },
    
    // Formatear hora
    formatTime(hour) {
        return hour.toString().padStart(2, '0') + ':00';
    },
    
    // Generar color aleatorio
    getRandomColor() {
        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils };
}
