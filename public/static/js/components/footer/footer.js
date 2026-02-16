export function renderFooter() {
    const app = document.getElementById('app');
    
    // Check if footer already exists to prevent duplicates
    if (document.getElementById('footer')) {
        return;
    }

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.id = 'footer';

    const currentYear = new Date().getFullYear();

    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-brand">
                <img src="static/svg/01.svg" alt="GraphQL Logo" class="footer-logo">
                <span class="footer-brand-text">GraphQL</span>
            </div>
            <div class="footer-links">
                <a href="https://medium.com/@elmahmoudimars/graphql-6e1d7ec0c679" target="_blank" class="footer-link">Documentation</a>
                <a href="https://zone01oujda.ma/" target="_blank" class="footer-link">API</a>
                <a href="https://github.com/abdel-mars/" target="_blank" class="footer-link">Support</a>
            </div>
            <div class="footer-copyright">
                <p>&copy; ${currentYear} GraphQL</p>
            </div>
        </div>
    `;
    
    app.appendChild(footer);
}

