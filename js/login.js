// Login page functionality

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const session = JSON.parse(currentUser);
        if (session.isActive) {
            // User is already logged in, redirect to main page
            window.location.replace('./main.html');
            return;
        }
    }

    const form = document.querySelector('.auth-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user
            const user = users.find(u => u.username === username && u.password === btoa(password));
            
            if (user) {
                // Store logged in user with session info
                const session = {
                    username: user.username,
                    loginTime: new Date().toISOString(),
                    isActive: true
                };
                localStorage.setItem('currentUser', JSON.stringify(session));
                
                // Redirect to main page
                window.location.replace('./main.html');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
});
