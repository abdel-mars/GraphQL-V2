import { renderHeadeer } from './components/header/header.js';
import { renderFooter } from './components/footer/footer.js';
import { initTheme } from './utils/theme.js';
import { isLoggedIn } from './utils/jwt.js';
import { renderProfileView } from './components/profile/profileView.js';
import { renderSignInView } from './components/auth/signinView.js';

//init the app

export function initApp() {
    initTheme();
    renderHeadeer();

    //check auth status
    if (isLoggedIn()) {
        renderProfileView();
    } else {
        renderSignInView();
    }

    // Render footer
    renderFooter();

    //listen for auth status changes to update the header
    window.addEventListener('storage', (event) => {
        if (event.key === 'jwt') {
            //render header when JWT changes login/logout
            const header = document.getElementById('header');
            if (header) {
                header.remove();
            }
            renderHeadeer();
            initTheme();

            if (event.newValue) {
                renderProfileView();
            } else {
                renderSignInView();
            }
        }
        if (event.key === 'theme') {
            initTheme();
        }
    });
}
