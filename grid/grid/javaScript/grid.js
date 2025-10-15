document.addEventListener('DOMContentLoaded', function() {
    // Iniciar pag
    initPage();
    
    // Agregar event listeners a los botones del menú
    setupMenuListeners();
    
    // Mostrar la sección por defecto
    showSection('.full_bleed');
});

function initPage() {
    console.log('Grid layout initialized');
    
    // Clases de animación a las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Lazy loading a las imágenes
    setupLazyLoading();
}

function setupMenuListeners() {
    const menuButtons = document.querySelectorAll('.menu button');
    
    menuButtons.forEach(button => {
        // Remover el onclick del HTML y agregar event listener
        button.removeAttribute('onclick');
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target') || 
                          this.textContent.toLowerCase().trim().replace(' ', '_');
            showSection('.' + target);
            
            // Estado del botón
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionClass) {
    // Ocultar todas las secciones principales
    const sections = document.querySelectorAll('.full_bleed, .gallery, .content-container');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.querySelector(sectionClass);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Scroll suave al inicio de la sección
        targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        console.log(`Showing section: ${sectionClass}`);
    } else {
        console.warn(`Section not found: ${sectionClass}`);
        
        // Fallback: mostrar todo el contenido
        sections.forEach(section => section.classList.remove('hidden'));
    }
}

function setupLazyLoading() {
    // Configurar Intersection Observer para lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Utilidades adicionales
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', debounce(function() {
    console.log('Window resized');
    // Recalcular layouts si es necesario
}, 250));

// Exportar funciones para uso global (si es necesario)
window.GridApp = {
    showSection,
    initPage
};