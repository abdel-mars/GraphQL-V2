import { toggleTheme } from '../../utils/theme.js';
import { logout } from '../../utils/jwt.js';

export function renderHeader(isCompact = false) {
  const existingHeader = document.getElementById('header');
  if (existingHeader) {
    existingHeader.remove();
  }

  const app = document.getElementById('app');
  const header = document.createElement('header');
  header.className = 'header';
  header.id = 'header';

  // Add compact class if specified
  if (isCompact) {
    header.classList.add('compact');
  }

  //checkTheme in localStorage
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark' || document.body.classList.contains('dark-theme');
  if (isDark) {
    header.classList.add('dark-theme');
  }

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('jwt') !== null;

  header.innerHTML = `
    <div class="logo">
      <a href="#" id="homeLink">
        <img src="static/svg/01.svg" alt="GraphQL Logo" class="logo-svg">
        <span class="logo-text">GraphQL</span>
      </a>
    </div>

    <div class="header-controls">
      <div id="themeToggler" class="theme-toggler ${isDark ? 'active' : ''}">
        <box-icon name='sun' size="md" class="sun"></box-icon>
        <box-icon name='moon' size="md" class="moon"></box-icon>
      </div>
      ${isLoggedIn ? `<button id="logoutBtn" class="logout-btn">Log Out</button>` : ''}
    </div>
  `;
      app.appendChild(header);

  // Set icon colors after box-icon elements are created
  setTimeout(() => {
    const sunIcon = document.querySelector('.theme-toggler .sun');
    const moonIcon = document.querySelector('.theme-toggler .moon');
    
    if (sunIcon && sunIcon.shadowRoot) {
      const sunSvg = sunIcon.shadowRoot.querySelector('svg');
      if (sunSvg) {
        sunSvg.style.fill = '#ffffff';
      }
    }
    
    if (moonIcon && moonIcon.shadowRoot) {
      const moonSvg = moonIcon.shadowRoot.querySelector('svg');
      if (moonSvg) {
        moonSvg.style.fill = '#000000';
      }
    }
  }, 100);

  // Add event listeners for navigation
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
  });
  
  // Add event listener for theme toggler
  const themeToggler = document.getElementById('themeToggler');
  themeToggler.addEventListener('click', () => {
    toggleTheme();
  });

  // Add event listener for logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      window.location.reload();
    });
  }

  // Handle scroll for transparent header
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header.classList.add('transparent');
    } else {
      header.classList.remove('transparent');
    }
    
    lastScrollY = currentScrollY;
  });
}
