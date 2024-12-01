// Authentication utilities

// Check if user is logged in
export function checkAuth() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
            return false;
        }

        const session = JSON.parse(currentUser);
        if (!session.isActive) {
            window.location.href = 'login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Logout function
export function logout() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const session = JSON.parse(currentUser);
            session.isActive = false;
            localStorage.setItem('currentUser', JSON.stringify(session));
        }
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        window.location.href = 'login.html';
    }
}

// Initialize auth check when the page loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        try {
            // Check authentication status
            checkAuth();

            // Add logout button functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            window.location.href = 'login.html';
        }
    });
}
