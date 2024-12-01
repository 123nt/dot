// Register page functionality

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorText = document.getElementById('error-text');

    if (!form || !errorText) return;

    // Function to check if username exists (case-insensitive)
    function isUsernameTaken(username, users) {
        return users.some(user => user.username.toLowerCase() === username.toLowerCase());
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        try {
            // Input validation
            if (!username || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Password strength validation
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
                throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
            }

            // Check for existing username
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (isUsernameTaken(username, users)) {
                throw new Error('This username is already taken. Please choose a different one.');
            }

            // Create new user
            const newUser = {
                username: username,
                password: btoa(password),
                isActive: false,
                createdAt: new Date().toISOString()
            };

            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Clear form and error message
            form.reset();
            errorText.style.display = 'none';
            
            // Show success message before redirect
            errorText.style.color = 'green';
            errorText.textContent = 'Registration successful! Redirecting to login...';
            errorText.style.display = 'block';

            // Redirect after a brief delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            errorText.style.color = 'red';
            errorText.textContent = error.message;
            errorText.style.display = 'block';
        }
    });
});
