import { checkAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }

    const form = document.querySelector('form');
    const errorText = document.getElementById('error-text');
    const backBtn = document.getElementById('back-btn');

    // Load current username
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const usernameInput = document.getElementById('username');
    const statusInput = document.getElementById('status');
    if (currentUser && usernameInput) {
        usernameInput.value = currentUser.username;
        if (statusInput && currentUser.status) {
            statusInput.value = currentUser.status;
        }
    }

    // Handle back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'main.html';
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newUsername = document.getElementById('username').value.trim();
            const status = document.getElementById('status').value.trim();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            try {
                // Validate inputs
                if (!newUsername) {
                    throw new Error('Username cannot be empty');
                }

                if (newUsername.length < 3) {
                    throw new Error('Username must be at least 3 characters long');
                }

                // Get current user and all users
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));

                // Verify current password
                if (currentPassword && btoa(currentPassword) !== currentUser.password) {
                    throw new Error('Current password is incorrect');
                }

                // Check if new username is taken by another user
                const isUsernameTaken = users.some(user => 
                    user.username.toLowerCase() === newUsername.toLowerCase() && 
                    user.username !== currentUser.username
                );

                if (isUsernameTaken) {
                    throw new Error('Username is already taken');
                }

                // If new password is provided, validate it
                if (newPassword || confirmPassword) {
                    if (newPassword !== confirmPassword) {
                        throw new Error('New passwords do not match');
                    }

                    if (newPassword.length < 6) {
                        throw new Error('New password must be at least 6 characters long');
                    }

                    const hasUpperCase = /[A-Z]/.test(newPassword);
                    const hasLowerCase = /[a-z]/.test(newPassword);
                    const hasNumbers = /\d/.test(newPassword);

                    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
                        throw new Error('New password must contain at least one uppercase letter, one lowercase letter, and one number');
                    }
                }

                // Update user in users array
                const userIndex = users.findIndex(user => user.username === currentUser.username);
                if (userIndex !== -1) {
                    users[userIndex].username = newUsername;
                    users[userIndex].status = status;
                    if (newPassword) {
                        users[userIndex].password = btoa(newPassword);
                    }
                    localStorage.setItem('users', JSON.stringify(users));

                    // Update current user
                    currentUser.username = newUsername;
                    currentUser.status = status;
                    if (newPassword) {
                        currentUser.password = btoa(newPassword);
                    }
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));

                    // Show success message and redirect
                    errorText.style.color = 'green';
                    errorText.textContent = 'Account updated successfully! Redirecting...';
                    errorText.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 1500);
                }
            } catch (error) {
                errorText.style.color = 'red';
                errorText.textContent = error.message;
                errorText.style.display = 'block';
            }
        });
    }
});
