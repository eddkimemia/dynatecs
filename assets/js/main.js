document.addEventListener('DOMContentLoaded', () => {
    // Determine path prefix based on current file location
    // We check if 'services/' is in the path to determine if we are in a subdirectory
    const isSubPage = window.location.pathname.includes('/services/');
    const prefix = isSubPage ? '../' : '';

    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            let html = await response.text();

            // Adjust internal links and image sources for sub-pages
            if (isSubPage) {
                // Prepend ../ to src and href that don't start with http, #, tel:, mailto:
                html = html.replace(/(src|href)="(?!(http|#|tel:|mailto:|\.\.\/))([^"]+)"/g, '$1="../$3"');
            }

            element.innerHTML = html;

            // Re-initialize menu toggle if the header was loaded
            if (elementId === 'main-header') {
                initMenuToggle();
            }
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
        }
    }

    function initMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuToggle && mobileMenu) {
            // Remove existing listener if any to avoid duplicates
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

            newMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Load components
    loadComponent('main-header', `${prefix}assets/components/header.html`);
    loadComponent('main-footer', `${prefix}assets/components/footer.html`);
});
