import { toggleTheme } from '../../utils/theme.js';
import { logout } from '../../utils/jwt.js';

export function renderHeadeer() {
    const app = document.getElementById('app');
    const header = document.createElement('header');
    header.className = 'header';
    header.id = 'header';

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
      <a href="#" id="homeLink">GraphQL</a>
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
}
