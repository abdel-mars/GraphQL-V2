import { renderHeader } from './components/header/header.js';
import { renderFooter } from './components/footer/footer.js';
import { initTheme } from './utils/theme.js';
import { isLoggedIn } from './utils/jwt.js';
import { renderProfileView } from './components/profile/profileView.js';
import { renderSignInView } from './components/auth/signinView.js';

//init the app

export function initApp() {
    initTheme();
    
    // Check if user is logged in to determine header style
    const loggedIn = isLoggedIn();
    renderHeader(!loggedIn); // Compact header on signin page, full size when logged in

    //check auth status
    if (loggedIn) {
        renderProfileView();
    } else {
        renderSignInView();
    }

    // Render footer only when not logged in (sign-in page)
    if (!loggedIn) {
        renderFooter();
    }

    //listen for auth status changes to update the header
    window.addEventListener('storage', (event) => {
        if (event.key === 'jwt') {
            //render header when JWT changes login/logout
            const header = document.getElementById('header');
            if (header) {
                header.remove();
            }
            
            const isNowLoggedIn = event.newValue !== null;
            renderHeader(!isNowLoggedIn); // Compact when logging out, expanded when logging in
            initTheme();

            if (event.newValue) {
                renderProfileView();
            } else {
                renderSignInView();
                // Show footer when logging out
                renderFooter();
            }
        }
        if (event.key === 'theme') {
            initTheme();
        }
    });
}
